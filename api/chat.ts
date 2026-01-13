import type { VercelRequest, VercelResponse } from '@vercel/node';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are TANK AI, a helpful assistant for the vibeTank portfolio website.
You speak in a friendly, slightly military-themed tone.
Keep responses concise and helpful.
You can help with:
- Questions about the portfolio projects
- General coding questions
- Career advice for developers
- Fun conversations

Always be encouraging and supportive!`,
      messages,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream the response
    const reader = result.textStream;
    for await (const chunk of reader) {
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
