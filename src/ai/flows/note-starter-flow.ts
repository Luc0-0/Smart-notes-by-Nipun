
'use server';
/**
 * @fileOverview A flow for generating a structured note from a prompt.
 *
 * - generateNoteStarter - A function that takes a prompt and returns a title and content.
 * - GenerateNoteStarterInput - The input type for the generateNoteStarter function.
 * - GenerateNoteStarterOutput - The return type for the generateNoteStarter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateNoteStarterInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for the note to be generated.'),
});
export type GenerateNoteStarterInput = z.infer<typeof GenerateNoteStarterInputSchema>;

const GenerateNoteStarterOutputSchema = z.object({
  title: z.string().describe('A concise, descriptive title for the generated note.'),
  content: z.string().describe('The full, markdown-formatted content of the generated note.'),
});
export type GenerateNoteStarterOutput = z.infer<typeof GenerateNoteStarterOutputSchema>;

export async function generateNoteStarter(
  input: GenerateNoteStarterInput
): Promise<GenerateNoteStarterOutput> {
  return generateNoteStarterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNoteStarterPrompt',
  input: { schema: GenerateNoteStarterInputSchema },
  output: { schema: GenerateNoteStarterOutputSchema },
  prompt: `You are an expert at creating structured and comprehensive notes and documents. A user wants to create a new note.

Based on their prompt, generate a well-structured, markdown-formatted note that serves as a great starting point.

The note should have a clear title and a body with relevant sections, headings, bullet points, and placeholders where the user can fill in more details.

User Prompt:
{{{prompt}}}
`,
});

const generateNoteStarterFlow = ai.defineFlow(
  {
    name: 'generateNoteStarterFlow',
    inputSchema: GenerateNoteStarterInputSchema,
    outputSchema: GenerateNoteStarterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
