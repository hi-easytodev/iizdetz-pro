import type { AIMessage, AIResponse, AIProviderConfig } from './types';
import { AIProviderError, retryWithBackoff } from './types';

// ============================================
// ANTHROPIC CLAUDE API CLIENT
// ============================================

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export const CLAUDE_MODELS = {
  OPUS: 'claude-3-opus-20240229',
  SONNET_3_5: 'claude-3-5-sonnet-20241022', // Рекомендуется
  SONNET: 'claude-3-sonnet-20240229',
  HAIKU: 'claude-3-haiku-20240307', // Быстрая и дешевая
};

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: string;
    content: string;
  }>;
  system?: string;
  temperature?: number;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeClient {
  private apiKey: string;
  private defaultModel: string;
  private timeout: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.defaultModel = config.model || CLAUDE_MODELS.SONNET_3_5;
    this.timeout = config.timeout || 60000;

    if (!this.apiKey) {
      throw new Error('Anthropic API key is required');
    }
  }

  async chat(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<AIResponse> {
    // Разделяем system message от остальных
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const requestBody: ClaudeRequest = {
      model: options?.model || this.defaultModel,
      max_tokens: options?.maxTokens || 4096,
      messages: chatMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      system: systemMessage?.content,
      temperature: options?.temperature || 0.7,
    };

    try {
      const response = await retryWithBackoff(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          try {
            const res = await fetch(ANTHROPIC_API_URL, {
              method: 'POST',
              headers: {
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));

              if (res.status === 429) {
                throw new AIProviderError(
                  'anthropic',
                  new Error('Rate limit exceeded'),
                  true
                );
              }

              throw new AIProviderError(
                'anthropic',
                new Error(errorData.error?.message || `HTTP ${res.status}`),
                res.status >= 500
              );
            }

            return await res.json() as ClaudeResponse;
          } finally {
            clearTimeout(timeoutId);
          }
        },
        undefined,
        (attempt, error) => {
          console.log(`Claude retry attempt ${attempt}:`, error.message);
        }
      );

      return {
        content: response.content[0]?.text || '',
        model: response.model,
        provider: 'anthropic',
        usage: {
          prompt_tokens: response.usage.input_tokens,
          completion_tokens: response.usage.output_tokens,
          total_tokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        finish_reason: response.stop_reason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;
      throw new AIProviderError('anthropic', error as Error);
    }
  }
}

// Export convenience functions
let defaultClient: ClaudeClient | null = null;

function getClient(): ClaudeClient {
  if (!defaultClient) {
    defaultClient = new ClaudeClient({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return defaultClient;
}

export async function chat(
  messages: AIMessage[],
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<AIResponse> {
  return getClient().chat(messages, options);
}
