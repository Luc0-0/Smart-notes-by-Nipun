'use server';
/**
 * @fileOverview A flow for generating a note outline.
 *
 * - generateOutline - A function that takes a title and returns an outline.
 * - GenerateOutlineInput - The input type for the generateOutline function.
 * - GenerateOutlineOutput - The return type for the generateOutline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateOutlineInputSchema = z.object({
  title: z.string().describe('The title of the note to generate an outline for.'),
});
export type GenerateOutlineInput = z.infer<typeof GenerateOutlineInputSchema>;

const GenerateOutlineOutputSchema = z.object({
  outline: z.string().describe('The generated markdown outline.'),
});
export type GenerateOutlineOutput = z.infer<typeof GenerateOutlineOutputSchema>;

export async function generateOutline(
  input: GenerateOutlineInput
): Promise<GenerateOutlineOutput> {
  return generateOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutlinePrompt',
  input: { schema: GenerateOutlineInputSchema },
  output: { schema: GenerateOutlineOutputSchema },
  prompt: `You are an expert at creating structured outlines for notes and documents.
  
Please generate a markdown-formatted outline for the following topic. Include a main heading and several sub-points.

Topic:
{{{title}}}
`,
});

const generateOutlineFlow = ai.defineFlow(
  {
    name: 'generateOutlineFlow',
    inputSchema: GenerateOutlineInputSchema,
    outputSchema: GenerateOutlineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
