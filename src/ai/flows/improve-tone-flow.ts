'use server';
/**
 * @fileOverview A flow for improving the tone of text.
 *
 * - improveTone - A function that takes text and a desired tone, and returns the rewritten text.
 * - ImproveToneInput - The input type for the improveTone function.
 * - ImproveToneOutput - The return type for the improveTone function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImproveToneInputSchema = z.object({
  text: z.string().describe('The text to rewrite.'),
  tone: z
    .string()
    .describe('The desired tone for the rewritten text (e.g., professional, casual, confident).'),
});
export type ImproveToneInput = z.infer<typeof ImproveToneInputSchema>;

const ImproveToneOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten version of the text in the specified tone.'),
});
export type ImproveToneOutput = z.infer<typeof ImproveToneOutputSchema>;

export async function improveTone(
  input: ImproveToneInput
): Promise<ImproveToneOutput> {
  return improveToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTonePrompt',
  input: { schema: ImproveToneInputSchema },
  output: { schema: ImproveToneOutputSchema },
  prompt: `You are an expert copy editor. Please rewrite the following text to adopt a more {{{tone}}} tone.

Text:
{{{text}}}
`,
});

const improveToneFlow = ai.defineFlow(
  {
    name: 'improveToneFlow',
    inputSchema: ImproveToneInputSchema,
    outputSchema: ImproveToneOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
