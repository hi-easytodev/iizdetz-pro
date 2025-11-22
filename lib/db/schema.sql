-- ============================================
-- СХЕМА БАЗЫ ДАННЫХ ДЛЯ ПРОЕКТА AI IDEA ANALYZER
-- ============================================

-- Таблица идей
CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  source VARCHAR(50) CHECK (source IN ('reddit', 'twitter')),
  source_url TEXT,
  score INTEGER DEFAULT 0,
  category TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'collected' CHECK (status IN ('collected', 'analyzing', 'published', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_score ON ideas(score DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas USING GIN(category);

-- Таблица анализов
CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  stage VARCHAR(50) CHECK (stage IN ('market', 'demand', 'communities', 'competition', 'forecast', 'gtm', 'tech', 'customers')),
  content JSONB,
  markdown_content TEXT,
  summary JSONB, -- Structured summary for context optimization
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для анализов
CREATE INDEX IF NOT EXISTS idx_analyses_idea_id ON analyses(idea_id);
CREATE INDEX IF NOT EXISTS idx_analyses_stage ON analyses(stage);

-- Таблица запусков pipeline
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  current_stage VARCHAR(50),
  status VARCHAR(50) CHECK (status IN ('running', 'completed', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Индексы для pipeline runs
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_idea_id ON pipeline_runs(idea_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);

-- Таблица данных для графиков
CREATE TABLE IF NOT EXISTS chart_data (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  chart_type VARCHAR(50) CHECK (chart_type IN ('arr_growth', 'market_pie', 'competitive_matrix', 'sparkline')),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для chart data
CREATE INDEX IF NOT EXISTS idx_chart_data_idea_id ON chart_data(idea_id);
CREATE INDEX IF NOT EXISTS idx_chart_data_type ON chart_data(chart_type);

-- Таблица избранных идей пользователей (для будущего расширения)
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  user_id VARCHAR(255), -- Пока просто строка, потом можно связать с users table
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, user_id)
);

-- Индексы для favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_idea_id ON favorites(idea_id);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция для получения полной информации об идее
CREATE OR REPLACE FUNCTION get_idea_with_analyses(p_idea_id INTEGER)
RETURNS TABLE (
  idea_data JSONB,
  market_analysis JSONB,
  strategy JSONB,
  technical JSONB,
  charts JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_jsonb(i.*) as idea_data,
    (SELECT content FROM analyses WHERE idea_id = p_idea_id AND stage = 'market' ORDER BY created_at DESC LIMIT 1) as market_analysis,
    (SELECT content FROM analyses WHERE idea_id = p_idea_id AND stage = 'strategy' ORDER BY created_at DESC LIMIT 1) as strategy,
    (SELECT content FROM analyses WHERE idea_id = p_idea_id AND stage = 'technical' ORDER BY created_at DESC LIMIT 1) as technical,
    (SELECT jsonb_object_agg(chart_type, data) FROM chart_data WHERE idea_id = p_idea_id) as charts
  FROM ideas i
  WHERE i.id = p_idea_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения топ-идей с пагинацией
CREATE OR REPLACE FUNCTION get_top_ideas(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_status VARCHAR DEFAULT 'published',
  p_order_by VARCHAR DEFAULT 'score'
)
RETURNS TABLE (
  id INTEGER,
  title VARCHAR(500),
  description TEXT,
  source VARCHAR(50),
  source_url TEXT,
  score INTEGER,
  category TEXT[],
  status VARCHAR(50),
  created_at TIMESTAMP,
  sparkline_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.description,
    i.source,
    i.source_url,
    i.score,
    i.category,
    i.status,
    i.created_at,
    (SELECT data FROM chart_data WHERE idea_id = i.id AND chart_type = 'sparkline' ORDER BY created_at DESC LIMIT 1) as sparkline_data
  FROM ideas i
  WHERE (p_status IS NULL OR i.status = p_status)
  ORDER BY
    CASE WHEN p_order_by = 'score' THEN i.score END DESC,
    CASE WHEN p_order_by = 'created_at' THEN i.created_at END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
