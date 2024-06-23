"use server"

import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, runFlow } from '@genkit-ai/flow';

import * as z from 'zod';
import { ollama } from 'genkitx-ollama';

configureGenkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma:2b' }],
      serverAddress: 'http://localhost:11434',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: 'ollama/gemma:2b',
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  }
);

export async function callMenuSuggestionFlow() {
  const flowResponse = await runFlow(menuSuggestionFlow, 'banana');
  console.log(flowResponse);
}
