import type { AIMessage, AIResponse, AIProviderConfig } from './types';
import { AIProviderError, retryWithBackoff } from './types';

// ============================================
// PERPLEXITY API CLIENT
// ============================================

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export const PERPLEXITY_MODELS = {
  // Online models (with internet access - РЕКОМЕНДУЕТСЯ)
  SONAR_LARGE_ONLINE: 'llama-3.1-sonar-large-128k-online',
  SONAR_SMALL_ONLINE: 'llama-3.1-sonar-small-128k-online',
  SONAR_HUGE_ONLINE: 'llama-3.1-sonar-huge-128k-online', // Самая мощная с интернетом

  // Offline models (без интернета, дешевле)
  SONAR_LARGE: 'llama-3.1-sonar-large-128k-chat',
  SONAR_SMALL: 'llama-3.1-sonar-small-128k-chat',
};

interface PerplexityRequest {
  model: string;
  messages: AIMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  return_citations?: boolean;
  return_images?: boolean;
  return_related_questions?: boolean;
  search_domain_filter?: string[];
  search_recency_filter?: 'month' | 'week' | 'day' | 'hour';
  stream?: boolean;
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role?: string;
      content?: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: string[];
  images?: string[];
  related_questions?: string[];
}

/**
 * Perplexity API wrapper
 * Поддерживает Deep Research через online модели
 */
export class PerplexityClient {
  private apiKey: string;
  private defaultModel: string;
  private timeout: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey || process.env.PERPLEXITY_API_KEY || '';
    this.defaultModel = config.model || PERPLEXITY_MODELS.SONAR_LARGE_ONLINE;
    this.timeout = config.timeout || 60000; // 60 секунд по умолчанию

    if (!this.apiKey) {
      throw new Error('Perplexity API key is required');
    }
  }

  /**
   * Основной метод для отправки запросов
   */
  async chat(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      returnCitations?: boolean;
      returnImages?: boolean;
      returnRelatedQuestions?: boolean;
      searchDomainFilter?: string[];
      searchRecencyFilter?: 'month' | 'week' | 'day' | 'hour';
    }
  ): Promise<AIResponse> {
    const requestBody: PerplexityRequest = {
      model: options?.model || this.defaultModel,
      messages,
      max_tokens: options?.maxTokens || 4000,
      temperature: options?.temperature || 0.2,
      return_citations: options?.returnCitations ?? true,
      return_images: options?.returnImages ?? false,
      return_related_questions: options?.returnRelatedQuestions ?? false,
      search_domain_filter: options?.searchDomainFilter,
      search_recency_filter: options?.searchRecencyFilter,
    };

    try {
      const response = await retryWithBackoff(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          try {
            const res = await fetch(PERPLEXITY_API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));

              // Rate limit error
              if (res.status === 429) {
                const retryAfter = res.headers.get('retry-after');
                throw new AIProviderError(
                  'perplexity',
                  new Error(`Rate limit exceeded${retryAfter ? `, retry after ${retryAfter}s` : ''}`),
                  true
                );
              }

              // Other errors
              throw new AIProviderError(
                'perplexity',
                new Error(errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`),
                res.status >= 500 // Retry на серверных ошибках
              );
            }

            return await res.json() as PerplexityResponse;
          } finally {
            clearTimeout(timeoutId);
          }
        },
        undefined,
        (attempt, error) => {
          console.log(`Perplexity retry attempt ${attempt}:`, error.message);
        }
      );

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response from Perplexity');
      }

      return {
        content: choice.message.content,
        model: response.model,
        provider: 'perplexity',
        usage: response.usage,
        finish_reason: choice.finish_reason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError('perplexity', error as Error);
    }
  }

  /**
   * Deep Research - собирает информацию из интернета и проводит анализ
   * Использует online модель с citations и related questions
   */
  async deepResearch(
    topic: string,
    options?: {
      searchRecency?: 'month' | 'week' | 'day' | 'hour';
      searchDomains?: string[];
      includeRelatedQuestions?: boolean;
    }
  ): Promise<{
    analysis: string;
    citations: string[];
    relatedQuestions: string[];
  }> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a professional researcher conducting deep analysis.
Provide comprehensive, well-researched information with citations.
Be thorough, objective, and cite all sources.`,
      },
      {
        role: 'user',
        content: topic,
      },
    ];

    try {
      const response = await this.chat(messages, {
        model: PERPLEXITY_MODELS.SONAR_HUGE_ONLINE, // Самая мощная online модель
        returnCitations: true,
        returnRelatedQuestions: options?.includeRelatedQuestions ?? true,
        searchRecencyFilter: options?.searchRecency || 'month',
        searchDomainFilter: options?.searchDomains,
        maxTokens: 8000,
        temperature: 0.1, // Низкая температура для точности
      });

      // Извлекаем citations и related questions из response metadata
      // (Perplexity возвращает их в отдельных полях)
      const fullResponse = response as any;

      return {
        analysis: response.content,
        citations: fullResponse.citations || [],
        relatedQuestions: fullResponse.related_questions || [],
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError('perplexity', error as Error);
    }
  }

  /**
   * Быстрый поиск с кратким ответом (для фильтрации идей)
   */
  async quickSearch(query: string): Promise<string> {
    const response = await this.chat(
      [{ role: 'user', content: query }],
      {
        model: PERPLEXITY_MODELS.SONAR_SMALL_ONLINE, // Быстрая модель
        maxTokens: 1000,
        temperature: 0.3,
        returnCitations: false,
      }
    );

    return response.content;
  }
}

// ============================================
// ЭКСПОРТ ФУНКЦИЙ ДЛЯ УДОБСТВА
// ============================================

let defaultClient: PerplexityClient | null = null;

function getClient(): PerplexityClient {
  if (!defaultClient) {
    defaultClient = new PerplexityClient({
      apiKey: process.env.PERPLEXITY_API_KEY || '',
    });
  }
  return defaultClient;
}

/**
 * Deep Research - главная функция для анализа идей
 */
export async function deepResearch(
  topic: string,
  options?: {
    searchRecency?: 'month' | 'week' | 'day' | 'hour';
    searchDomains?: string[];
  }
): Promise<{
  analysis: string;
  citations: string[];
  relatedQuestions: string[];
}> {
  return getClient().deepResearch(topic, options);
}

/**
 * Быстрый поиск
 */
export async function quickSearch(query: string): Promise<string> {
  return getClient().quickSearch(query);
}

/**
 * Обычный chat
 */
export async function chat(
  messages: AIMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<AIResponse> {
  return getClient().chat(messages, options);
}
