import type { AIMessage, AIResponse, AIProviderConfig } from './types';
import { AIProviderError, retryWithBackoff } from './types';

// ============================================
// GOOGLE GEMINI API CLIENT
// ============================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_MODELS = {
  PRO_1_5: 'gemini-1.5-pro-latest',
  FLASH_1_5: 'gemini-1.5-flash-latest', // Рекомендуется - быстрая и бесплатная
  FLASH_8B: 'gemini-1.5-flash-8b-latest', // Еще быстрее
};

interface GeminiRequest {
  contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
    safetyRatings: any[];
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiClient {
  private apiKey: string;
  private defaultModel: string;
  private timeout: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey || process.env.GOOGLE_GEMINI_API_KEY || '';
    this.defaultModel = config.model || GEMINI_MODELS.FLASH_1_5;
    this.timeout = config.timeout || 60000;

    if (!this.apiKey) {
      throw new Error('Google Gemini API key is required');
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
    const model = options?.model || this.defaultModel;

    // Gemini использует другой формат: user/model вместо user/assistant
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // System message добавляем как первое user сообщение
    const systemMessage = messages.find(m => m.role === 'system');
    if (systemMessage) {
      contents.unshift({
        role: 'user',
        parts: [{ text: `System: ${systemMessage.content}` }],
      });
    }

    const requestBody: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens || 8192,
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
      ],
    };

    try {
      const response = await retryWithBackoff(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          try {
            const url = `${GEMINI_API_URL}/${model}:generateContent?key=${this.apiKey}`;

            const res = await fetch(url, {
              method: 'POST',
              headers: {
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
                  'gemini',
                  new Error('Rate limit exceeded'),
                  true
                );
              }

              throw new AIProviderError(
                'gemini',
                new Error(errorData.error?.message || `HTTP ${res.status}`),
                res.status >= 500
              );
            }

            return await res.json() as GeminiResponse;
          } finally {
            clearTimeout(timeoutId);
          }
        },
        undefined,
        (attempt, error) => {
          console.log(`Gemini retry attempt ${attempt}:`, error.message);
        }
      );

      const candidate = response.candidates?.[0];
      if (!candidate) {
        throw new Error('No response from Gemini');
      }

      return {
        content: candidate.content.parts[0]?.text || '',
        model,
        provider: 'gemini',
        usage: {
          prompt_tokens: response.usageMetadata.promptTokenCount,
          completion_tokens: response.usageMetadata.candidatesTokenCount,
          total_tokens: response.usageMetadata.totalTokenCount,
        },
        finish_reason: candidate.finishReason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;
      throw new AIProviderError('gemini', error as Error);
    }
  }
}

// Export convenience functions
let defaultClient: GeminiClient | null = null;

function getClient(): GeminiClient {
  if (!defaultClient) {
    defaultClient = new GeminiClient({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
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
