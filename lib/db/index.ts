import { Pool, QueryResult, QueryResultRow } from 'pg';

// Создаем пул соединений для Vercel Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Максимум 20 соединений в пуле
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Wrapper для выполнения SQL запросов
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    // Логируем медленные запросы (> 1 секунды)
    if (duration > 1000) {
      console.warn('Slow query detected:', {
        text: text.substring(0, 100),
        duration: `${duration}ms`,
      });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', {
      text: text.substring(0, 100),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Helper функции для типизированных запросов

export const db = {
  // ============================================
  // IDEAS
  // ============================================

  async createIdea(idea: {
    title: string;
    description: string;
    source: 'reddit' | 'twitter';
    source_url: string;
    score: number;
    category: string[];
  }) {
    const result = await query<{ id: number }>(
      `INSERT INTO ideas (title, description, source, source_url, score, category, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'collected')
       RETURNING id`,
      [idea.title, idea.description, idea.source, idea.source_url, idea.score, idea.category]
    );
    return result.rows[0];
  },

  async getIdeaById(id: number) {
    const result = await query(
      'SELECT * FROM ideas WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async getTopIdeas(
    limit = 20,
    offset = 0,
    status: 'collected' | 'analyzing' | 'published' | 'failed' = 'published',
    orderBy: 'score' | 'created_at' = 'score'
  ) {
    const result = await query(
      'SELECT * FROM get_top_ideas($1, $2, $3, $4)',
      [limit, offset, status, orderBy]
    );
    return result.rows;
  },

  async updateIdeaStatus(
    id: number,
    status: 'collected' | 'analyzing' | 'published' | 'failed'
  ) {
    await query(
      'UPDATE ideas SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
  },

  async searchIdeas(searchTerm: string, limit = 20) {
    const result = await query(
      `SELECT * FROM ideas
       WHERE title ILIKE $1 OR description ILIKE $1
       ORDER BY score DESC
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );
    return result.rows;
  },

  // ============================================
  // ANALYSES
  // ============================================

  async createAnalysis(analysis: {
    idea_id: number;
    stage: 'market' | 'demand' | 'communities' | 'competition' | 'forecast' | 'gtm' | 'tech' | 'customers';
    content: any;
    markdown_content: string;
    summary?: any;
  }) {
    const result = await query(
      `INSERT INTO analyses (idea_id, stage, content, markdown_content, summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        analysis.idea_id,
        analysis.stage,
        JSON.stringify(analysis.content),
        analysis.markdown_content,
        analysis.summary ? JSON.stringify(analysis.summary) : null,
      ]
    );
    return result.rows[0];
  },

  async getAnalysesByIdeaId(ideaId: number) {
    const result = await query(
      `SELECT * FROM analyses WHERE idea_id = $1 ORDER BY created_at DESC`,
      [ideaId]
    );
    return result.rows;
  },

  async getAnalysisByStage(
    ideaId: number,
    stage: 'market' | 'demand' | 'communities' | 'competition' | 'forecast' | 'gtm' | 'tech' | 'customers'
  ) {
    const result = await query(
      `SELECT * FROM analyses WHERE idea_id = $1 AND stage = $2 ORDER BY created_at DESC LIMIT 1`,
      [ideaId, stage]
    );
    return result.rows[0] || null;
  },

  async getSummariesByIdeaId(ideaId: number) {
    const result = await query(
      `SELECT stage, summary FROM analyses
       WHERE idea_id = $1 AND summary IS NOT NULL
       ORDER BY
         CASE stage
           WHEN 'market' THEN 1
           WHEN 'demand' THEN 2
           WHEN 'communities' THEN 3
           WHEN 'competition' THEN 4
           WHEN 'forecast' THEN 5
           WHEN 'gtm' THEN 6
           WHEN 'tech' THEN 7
           WHEN 'customers' THEN 8
         END`,
      [ideaId]
    );
    return result.rows.map((row: any) => row.summary);
  },

  async hasCachedSummaries(ideaId: number): Promise<boolean> {
    const result = await query(
      `SELECT COUNT(*) as count FROM analyses
       WHERE idea_id = $1 AND summary IS NOT NULL`,
      [ideaId]
    );
    return parseInt(result.rows[0]?.count || '0') > 0;
  },

  // ============================================
  // PIPELINE RUNS
  // ============================================

  async createPipelineRun(ideaId: number) {
    const result = await query<{ id: number }>(
      `INSERT INTO pipeline_runs (idea_id, current_stage, status, started_at)
       VALUES ($1, 'starting', 'running', CURRENT_TIMESTAMP)
       RETURNING id`,
      [ideaId]
    );
    return result.rows[0];
  },

  async updatePipelineRun(runId: number, data: {
    current_stage?: string;
    status?: 'running' | 'completed' | 'failed';
    error_message?: string;
  }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.current_stage) {
      updates.push(`current_stage = $${paramCount++}`);
      values.push(data.current_stage);
    }
    if (data.status) {
      updates.push(`status = $${paramCount++}`);
      values.push(data.status);
      if (data.status === 'completed' || data.status === 'failed') {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }
    if (data.error_message) {
      updates.push(`error_message = $${paramCount++}`);
      values.push(data.error_message);
    }

    values.push(runId);
    await query(
      `UPDATE pipeline_runs SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );
  },

  async getPipelineRunByIdeaId(ideaId: number) {
    const result = await query(
      `SELECT * FROM pipeline_runs WHERE idea_id = $1 ORDER BY started_at DESC LIMIT 1`,
      [ideaId]
    );
    return result.rows[0] || null;
  },

  // ============================================
  // CHART DATA
  // ============================================

  async createChartData(chartData: {
    idea_id: number;
    chart_type: 'arr_growth' | 'market_pie' | 'competitive_matrix' | 'sparkline';
    data: any;
  }) {
    const result = await query(
      `INSERT INTO chart_data (idea_id, chart_type, data)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [chartData.idea_id, chartData.chart_type, JSON.stringify(chartData.data)]
    );
    return result.rows[0];
  },

  async getChartDataByIdeaId(ideaId: number) {
    const result = await query(
      `SELECT chart_type, data FROM chart_data WHERE idea_id = $1 ORDER BY created_at DESC`,
      [ideaId]
    );

    // Преобразуем в объект { arr_growth: data, market_pie: data, ... }
    const chartDataMap: Record<string, any> = {};
    result.rows.forEach((row: any) => {
      chartDataMap[row.chart_type] = row.data;
    });

    return chartDataMap;
  },

  // ============================================
  // FAVORITES
  // ============================================

  async addFavorite(ideaId: number, userId: string) {
    try {
      await query(
        `INSERT INTO favorites (idea_id, user_id) VALUES ($1, $2)
         ON CONFLICT (idea_id, user_id) DO NOTHING`,
        [ideaId, userId]
      );
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  async removeFavorite(ideaId: number, userId: string) {
    await query(
      'DELETE FROM favorites WHERE idea_id = $1 AND user_id = $2',
      [ideaId, userId]
    );
  },

  async getFavoritesByUser(userId: string) {
    const result = await query(
      `SELECT i.*, f.created_at as favorited_at
       FROM ideas i
       JOIN favorites f ON i.id = f.idea_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async isIdeaFavorited(ideaId: number, userId: string) {
    const result = await query(
      'SELECT EXISTS(SELECT 1 FROM favorites WHERE idea_id = $1 AND user_id = $2)',
      [ideaId, userId]
    );
    return result.rows[0]?.exists || false;
  },

  // ============================================
  // COMPLEX QUERIES
  // ============================================

  async getIdeaWithFullAnalysis(ideaId: number) {
    const result = await query(
      'SELECT * FROM get_idea_with_analyses($1)',
      [ideaId]
    );
    return result.rows[0] || null;
  },

  // ============================================
  // UTILITY
  // ============================================

  async healthCheck() {
    try {
      await query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  },
};

export default db;
