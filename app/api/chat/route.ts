"use server"

import { NextResponse, NextRequest } from 'next/server'
import { generateStream } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { ollama } from 'genkitx-ollama';
import {MODEL_MAP} from "@/lib/model-map";

export async function POST(req: NextRequest) {
  const req_data = await req.json();
  const message = req_data.message || "User message error.";
  
  const model_id = req_data.modelId as string;
  
  configureGenkit({
    plugins: [
      ollama({
        models: [
          { name: model_id },
        ],
        serverAddress: MODEL_MAP[model_id] || "http://localhost:11434",
      }),
    ]
  });

  const { stream } = await generateStream({
    prompt: `${message}`,
    model: `ollama/${model_id}`,
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
