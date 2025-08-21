'use server';
/**
 * @fileOverview A flow for generating tags from text.
 *
 * - generateTags - A function that takes text and returns a list of relevant tags.
 * - GenerateTagsInput - The input type for the generateTags function.
 * - GenerateTagsOutput - The return type for the generateTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateTagsInputSchema = z.object({
  text: z.string().describe('The text to generate tags from.'),
});
export type GenerateTagsInput = z.infer<typeof GenerateTagsInputSchema>;

const GenerateTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe(
      'A list of 1-3 relevant, single-word tags, in lowercase, based on the text.'
    ),
});
export type GenerateTagsOutput = z.infer<typeof GenerateTagsOutputSchema>;

export async function generateTags(
  input: GenerateTagsInput
): Promise<GenerateTagsOutput> {
  return generateTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTagsPrompt',
  input: { schema: GenerateTagsInputSchema },
  output: { schema: GenerateTagsOutputSchema },
  prompt: `You are an expert at analyzing text and identifying its core themes.
  
Please generate a list of 1 to 3 relevant, single-word, lowercase tags for the following content.

Text:
{{{text}}}
`,
});

const generateTagsFlow = ai.defineFlow(
  {
    name: 'generateTagsFlow',
    inputSchema: GenerateTagsInputSchema,
    outputSchema: GenerateTagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
