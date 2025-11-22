import type { AIMessage, AIResponse, AIProvider, FallbackProvider } from './types';
import { executeWithFallback, DEFAULT_FALLBACK_CHAIN } from './types';
import { PerplexityClient, PERPLEXITY_MODELS } from './perplexity';
import { ClaudeClient, CLAUDE_MODELS } from './claude';
import { GeminiClient, GEMINI_MODELS } from './gemini';

// ============================================
// УНИВЕРСАЛЬНЫЙ AI CLIENT С FALLBACK
// ============================================

export interface AIClientConfig {
  preferredProvider?: AIProvider;
  fallbackChain?: FallbackProvider[];
  enableFallback?: boolean;
  timeout?: number;
}

export class UniversalAIClient {
  private config: AIClientConfig;
  private clients: Map<AIProvider, any>;

  constructor(config: AIClientConfig = {}) {
    this.config = {
      enableFallback: true,
      timeout: 60000,
      ...config,
    };

    // Инициализируем доступные клиенты
    this.clients = new Map();

    // Проверяем доступность API ключей и создаем клиенты
    if (process.env.PERPLEXITY_API_KEY) {
      this.clients.set('perplexity', new PerplexityClient({
        apiKey: process.env.PERPLEXITY_API_KEY,
        timeout: this.config.timeout,
      }));
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.clients.set('anthropic', new ClaudeClient({
        apiKey: process.env.ANTHROPIC_API_KEY,
        timeout: this.config.timeout,
      }));
    }

    if (process.env.GOOGLE_GEMINI_API_KEY) {
      this.clients.set('gemini', new GeminiClient({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        timeout: this.config.timeout,
      }));
    }

    // Проверяем, что хотя бы один клиент доступен
    if (this.clients.size === 0) {
      console.warn('No AI providers configured. Please add API keys to .env.local');
    }
  }

  /**
   * Основной метод для отправки запросов с автоматическим fallback
   */
  async chat(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      provider?: AIProvider;
    }
  ): Promise<AIResponse> {
    // Если указан конкретный провайдер, используем только его
    if (options?.provider) {
      const client = this.clients.get(options.provider);
      if (!client) {
        throw new Error(`Provider ${options.provider} is not configured`);
      }
      return client.chat(messages, options);
    }

    // Если fallback отключен, используем первый доступный провайдер
    if (!this.config.enableFallback) {
      const firstProvider = Array.from(this.clients.keys())[0];
      const client = this.clients.get(firstProvider);
      return client!.chat(messages, options);
    }

    // Используем fallback chain
    const fallbackChain = this.config.fallbackChain || DEFAULT_FALLBACK_CHAIN;

    // Фильтруем только доступные провайдеры
    const availableProviders = fallbackChain.filter(p =>
      this.clients.has(p.provider)
    );

    if (availableProviders.length === 0) {
      throw new Error('No AI providers available');
    }

    return executeWithFallback(
      availableProviders,
      async (provider, model) => {
        const client = this.clients.get(provider);
        return client!.chat(messages, {
          ...options,
          model: options?.model || model,
        });
      },
      (failedProvider, nextProvider, error) => {
        console.log(
          `AI Provider ${failedProvider} failed, falling back to ${nextProvider}:`,
          error.message
        );
      }
    );
  }

  /**
   * Deep Research используя Perplexity
   * Если Perplexity недоступен, использует обычный chat с другим провайдером
   */
  async deepResearch(
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
    const perplexityClient = this.clients.get('perplexity') as PerplexityClient | undefined;

    if (perplexityClient) {
      try {
        return await perplexityClient.deepResearch(topic, options);
      } catch (error) {
        console.warn('Perplexity Deep Research failed, using fallback:', error);
      }
    }

    // Fallback: используем обычный chat с детальным промптом
    console.log('Using fallback for Deep Research');

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a professional researcher. Provide comprehensive analysis with detailed information.
Even though you don't have real-time internet access, provide the most accurate information based on your knowledge.
Structure your response clearly and mention when information might need verification.`,
      },
      {
        role: 'user',
        content: `Conduct a deep research on the following topic:\n\n${topic}\n\nProvide:
1. Comprehensive analysis
2. Key insights and data points
3. Related questions for further research

Be thorough and detailed.`,
      },
    ];

    const response = await this.chat(messages, {
      maxTokens: 8000,
      temperature: 0.1,
    });

    return {
      analysis: response.content,
      citations: [], // Fallback не имеет citations
      relatedQuestions: [], // Можно попытаться извлечь из текста
    };
  }

  /**
   * Быстрая генерация текста (для простых задач)
   */
  async quickGenerate(
    prompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> {
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      {
        maxTokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
      }
    );

    return response.content;
  }

  /**
   * Получить список доступных провайдеров
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Проверить доступность конкретного провайдера
   */
  isProviderAvailable(provider: AIProvider): boolean {
    return this.clients.has(provider);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let defaultClient: UniversalAIClient | null = null;

export function getAIClient(config?: AIClientConfig): UniversalAIClient {
  if (!defaultClient) {
    defaultClient = new UniversalAIClient(config);
  }
  return defaultClient;
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Основная функция для chat
 */
export async function chat(
  messages: AIMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    provider?: AIProvider;
  }
): Promise<AIResponse> {
  return getAIClient().chat(messages, options);
}

/**
 * Deep Research через Perplexity (с fallback)
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
  return getAIClient().deepResearch(topic, options);
}

/**
 * Быстрая генерация
 */
export async function quickGenerate(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  return getAIClient().quickGenerate(prompt, options);
}

/**
 * Получить доступные провайдеры
 */
export function getAvailableProviders(): AIProvider[] {
  return getAIClient().getAvailableProviders();
}
