import { StreamingTextResponse, streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const config = {
  runtime: 'edge',
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
