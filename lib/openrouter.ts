const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface GenerateOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
}

export async function generateWithOpenRouter({
  prompt,
  systemPrompt,
  model = 'openrouter/auto',
}: GenerateOptions): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://job-search-copilot.vercel.app',
        'X-Title': 'Job Search Copilot',
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenRouter response');
    }

    return content;
  } catch (error) {
    console.error('OpenRouter error:', error);
    throw error;
  }
}
