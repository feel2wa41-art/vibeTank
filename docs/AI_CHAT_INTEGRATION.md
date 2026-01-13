# AI Chat Integration Guide

## Overview

vibeTank portfolio includes an AI-powered chat feature using Google's Gemini API with the Vercel AI SDK. This document covers the implementation details, configuration, and troubleshooting.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React Client  │────▶│  Vercel API      │────▶│  Google Gemini  │
│   (useChat)     │◀────│  (/api/chat)     │◀────│  API            │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                        │
   ai/react hook         Serverless Function      gemini-2.0-flash-lite
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Client SDK | `ai/react` | ^3.4 |
| Server SDK | `ai` | ^3.4 |
| Provider | `@ai-sdk/google` | ^0.0.x |
| Model | Gemini 2.0 Flash Lite | Stable |
| Runtime | Vercel Serverless | Node.js |

## Model Selection

### Available Models (2025)

| Model | Use Case | Rate Limit |
|-------|----------|------------|
| `gemini-3-pro-preview` | Complex reasoning | Limited |
| `gemini-3-flash-preview` | Balanced performance | Limited |
| `gemini-2.5-flash` | Production stable | Standard |
| `gemini-2.5-flash-lite` | Cost-effective | Higher |
| `gemini-2.0-flash-lite-001` | **Current choice** | Free tier friendly |

### Why `gemini-2.0-flash-lite-001`?

1. **Stability**: Uses `-001` suffix for stable version
2. **Free Tier**: 1,000 requests/day on free plan
3. **Speed**: Optimized for fast responses
4. **Cost**: Most economical for portfolio use case

## Implementation

### Server-Side API (`api/chat.ts`)

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Check API key
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

    // 3. Initialize Google AI provider
    const google = createGoogleGenerativeAI({ apiKey });

    // 4. Stream text generation
    const result = await streamText({
      model: google('gemini-2.0-flash-lite-001'),
      system: `Your system prompt here...`,
      messages,
    });

    // 5. Set streaming headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');

    // 6. Stream response in AI SDK format
    for await (const chunk of result.textStream) {
      res.write(`0:${JSON.stringify(chunk)}\n`);
    }
    res.end();
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

### Client-Side Component (`AiChat.tsx`)

```typescript
import { useChat } from 'ai/react';

export function AiChat({ isOpen, onClose }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  // Render chat UI with messages...
}
```

## Streaming Protocol

The AI SDK uses a specific data stream format for `useChat` compatibility:

```
0:"Hello"
0:" world"
0:"!"
```

Format: `0:${JSON.stringify(textChunk)}\n`

- `0:` - Indicates text content type
- JSON string - Properly escaped text chunk
- `\n` - Newline delimiter

### Required Headers

```typescript
res.setHeader('Content-Type', 'text/plain; charset=utf-8');
res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
```

## Configuration

### Environment Variables

```env
# Vercel Environment Variables
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

### Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add to Vercel project settings:
   - Go to Project Settings > Environment Variables
   - Add `GOOGLE_GENERATIVE_AI_API_KEY`
   - Deploy to apply changes

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## Rate Limits & Pricing

### Free Tier (Recommended for Portfolio)

| Metric | Limit |
|--------|-------|
| Requests per day | 1,000 |
| Requests per minute | 60 |
| Tokens per minute | 1,000,000 |

### Paid Tier

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| gemini-2.0-flash-lite | $0.075 | $0.30 |
| gemini-2.5-flash | $0.15 | $0.60 |

## Troubleshooting

### Common Errors

#### 1. Model Not Found (404)

```json
{"error": "models/gemini-xxx is not found for API version v1beta"}
```

**Solution**: Use a valid model name. Recommended: `gemini-2.0-flash-lite-001`

#### 2. API Key Not Configured

```json
{"error": "API key not configured"}
```

**Solution**: Add `GOOGLE_GENERATIVE_AI_API_KEY` to Vercel environment variables

#### 3. pipeDataStreamToResponse Not a Function

```json
{"error": "result.pipeDataStreamToResponse is not a function"}
```

**Solution**: Use manual streaming instead:
```typescript
for await (const chunk of result.textStream) {
  res.write(`0:${JSON.stringify(chunk)}\n`);
}
res.end();
```

#### 4. Streaming Not Working with useChat

**Symptoms**: Messages don't stream, appear all at once, or error occurs

**Solution**:
1. Ensure headers are set correctly
2. Use AI SDK data stream format (`0:text\n`)
3. Check `X-Vercel-AI-Data-Stream: v1` header

### Debug Checklist

- [ ] API key is set in Vercel environment variables
- [ ] Model name is valid and available
- [ ] Response headers include `X-Vercel-AI-Data-Stream: v1`
- [ ] Streaming format follows `0:${JSON.stringify(chunk)}\n`
- [ ] Vercel function logs show no errors

## Migration Notes

### From Deprecated Models

If you were using deprecated models, update to:

| Old Model | New Model |
|-----------|-----------|
| `gemini-pro` | `gemini-2.0-flash-lite-001` |
| `gemini-1.5-flash` | `gemini-2.5-flash` |
| `gemini-1.5-flash-latest` | `gemini-2.5-flash` |

### AI SDK Version Compatibility

- **v3.x**: Use `streamText` with manual streaming
- **v4.x+**: May support `pipeDataStreamToResponse` (check docs)

## Resources

- [Vercel AI SDK Documentation](https://ai-sdk.dev)
- [Google AI SDK Provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Google AI Studio](https://aistudio.google.com)

## Version History

| Date | Change |
|------|--------|
| 2025-01-13 | Initial implementation with gemini-2.0-flash-lite-001 |
| 2025-01-13 | Fixed streaming format for useChat compatibility |
