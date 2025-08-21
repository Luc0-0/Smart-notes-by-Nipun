'use server';
/**
 * @fileOverview A flow for extracting action items from text.
 *
 * - extractActionItems - A function that takes text and returns a list of action items.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractActionItemsInputSchema = z.object({
  text: z.string().describe('The text to extract action items from.'),
});
export type ExtractActionItemsInput = z.infer<
  typeof ExtractActionItemsInputSchema
>;

const ExtractActionItemsOutputSchema = z.object({
  actionItems: z
    .array(z.string())
    .describe('A list of action items extracted from the text.'),
});
export type ExtractActionItemsOutput = z.infer<
  typeof ExtractActionItemsOutputSchema
>;

export async function extractActionItems(
  input: ExtractActionItemsInput
): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: { schema: ExtractActionItemsInputSchema },
  output: { schema: ExtractActionItemsOutputSchema },
  prompt: `You are an expert at identifying actionable tasks and to-do items from text.
  
Please analyze the following content and extract a list of clear, concise action items.

Text:
{{{text}}}
`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
