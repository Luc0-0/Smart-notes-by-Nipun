'use server';
/**
 * @fileOverview A flow for rewriting text.
 *
 * - rewriteText - A function that takes text and returns a rewritten version.
 * - RewriteTextInput - The input type for the rewriteText function.
 * - RewriteTextOutput - The return type for the rewriteText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RewriteTextInputSchema = z.object({
  text: z.string().describe('The text to rewrite.'),
});
export type RewriteTextInput = z.infer<typeof RewriteTextInputSchema>;

const RewriteTextOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten version of the text.'),
});
export type RewriteTextOutput = z.infer<typeof RewriteTextOutputSchema>;

export async function rewriteText(
  input: RewriteTextInput
): Promise<RewriteTextOutput> {
  return rewriteTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteTextPrompt',
  input: { schema: RewriteTextInputSchema },
  output: { schema: RewriteTextOutputSchema },
  prompt: `You are an expert copy editor. Please rewrite the following text to improve its clarity, conciseness, and overall quality.

Text:
{{{text}}}
`,
});

const rewriteTextFlow = ai.defineFlow(
  {
    name: 'rewriteTextFlow',
    inputSchema: RewriteTextInputSchema,
    outputSchema: RewriteTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
