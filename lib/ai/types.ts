// ============================================
// БАЗОВЫЕ ТИПЫ ДЛЯ AI API
// ============================================

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finish_reason?: string;
}

export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export type AIProvider =
  | 'perplexity'
  | 'anthropic'
  | 'gemini'
  | 'openrouter'
  | 'openai'
  | 'groq'
  | 'together'
  | 'mistral';

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number; // ms
  maxDelay: number; // ms
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// ============================================
// ОШИБКИ
// ============================================

export class AIProviderError extends Error {
  constructor(
    public provider: AIProvider,
    public originalError: Error,
    public retryable: boolean = true
  ) {
    super(`${provider} error: ${originalError.message}`);
    this.name = 'AIProviderError';
  }
}

export class AIProviderRateLimitError extends AIProviderError {
  constructor(provider: AIProvider, retryAfter?: number) {
    super(provider, new Error(`Rate limit exceeded${retryAfter ? `, retry after ${retryAfter}s` : ''}`), true);
    this.name = 'AIProviderRateLimitError';
  }
}

// ============================================
// RETRY УТИЛИТА
// ============================================

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  let lastError: Error;
  let delay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Если ошибка не retryable, не пытаемся повторить
      if (error instanceof AIProviderError && !error.retryable) {
        throw error;
      }

      // Если это последняя попытка, бросаем ошибку
      if (attempt === config.maxRetries) {
        throw lastError;
      }

      // Логируем retry
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Ждем перед следующей попыткой
      await new Promise(resolve => setTimeout(resolve, delay));

      // Увеличиваем delay с экспоненциальным backoff
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw lastError!;
}

// ============================================
// FALLBACK ЛОГИКА
// ============================================

export interface FallbackProvider {
  provider: AIProvider;
  model: string;
}

export const DEFAULT_FALLBACK_CHAIN: FallbackProvider[] = [
  { provider: 'perplexity', model: 'llama-3.1-sonar-large-128k-online' },
  { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  { provider: 'gemini', model: 'gemini-1.5-flash' },
  { provider: 'groq', model: 'llama-3.1-70b-versatile' },
  { provider: 'openrouter', model: 'meta-llama/llama-3.1-70b-instruct' },
  { provider: 'together', model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' },
];

export async function executeWithFallback<T>(
  providers: FallbackProvider[],
  executeFn: (provider: AIProvider, model: string) => Promise<T>,
  onFallback?: (failedProvider: AIProvider, nextProvider: AIProvider, error: Error) => void
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < providers.length; i++) {
    const { provider, model } = providers[i];

    try {
      return await executeFn(provider, model);
    } catch (error) {
      lastError = error as Error;

      console.warn(`Provider ${provider} failed:`, error);

      // Если есть следующий провайдер, пробуем его
      if (i < providers.length - 1) {
        const nextProvider = providers[i + 1];

        if (onFallback) {
          onFallback(provider, nextProvider.provider, lastError);
        }

        console.log(`Falling back to ${nextProvider.provider}...`);
        continue;
      }

      // Если это последний провайдер, бросаем ошибку
      throw new Error(`All AI providers failed. Last error: ${lastError.message}`);
    }
  }

  throw lastError!;
}
