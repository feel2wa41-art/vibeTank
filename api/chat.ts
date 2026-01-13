import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StreamingTextResponse, streamText } from 'ai';
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
      model: google('gemini-2.0-flash-lite-001'),
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

    // Set headers for AI SDK streaming format
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');

    // Stream using AI SDK format for useChat compatibility
    for await (const chunk of result.textStream) {
      // AI SDK data stream format: 0:text\n
      res.write(`0:${JSON.stringify(chunk)}\n`);
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
