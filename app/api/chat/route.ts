"use server"

import { NextResponse, NextRequest } from 'next/server'
import { generateStream } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { ollama } from 'genkitx-ollama';

const api_base = process.env.API_BASE || "http://localhost:11434";

configureGenkit({
  plugins: [
    ollama({
      models: [
        { name: 'gemma:2b' },
        { name: "qwen2:0.5b" }
      ],
      serverAddress: api_base,
    }),
  ]
});

export async function POST(req: NextRequest) {
  const req_data = await req.json();
  const message = req_data.message || "User message error.";

  const { stream } = await generateStream({
    prompt: `${message}`,
    model: `ollama/${req_data.modelId}`,
    config: {
      temperature: 1,
    },
  });

  const encoder = new TextEncoder();
  const streamResponse = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream()) {
		// @ts-ignore
		const text = chunk.text()
		console.log(text)
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
    cancel() {
      console.log('Stream cancelled by the client');
    },
  });

  return new Response(streamResponse, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
