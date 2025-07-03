// src/ai/flows/analyze-cctv-footage.ts
'use server';
/**
 * @fileOverview Analyzes CCTV footage to detect unaccompanied children.
 *
 * - analyzeCctvFootage - A function that analyzes CCTV footage and detects unaccompanied children.
 * - AnalyzeCctvFootageInput - The input type for the analyzeCctvFootage function.
 * - AnalyzeCctvFootageOutput - The return type for the analyzeCctvFootage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCctvFootageInputSchema = z.object({
  cctvFootageDataUri: z
    .string()
    .describe(
      "CCTV footage as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The location of the CCTV camera.'),
  timestamp: z.string().describe('The timestamp of the CCTV footage.'),
});
export type AnalyzeCctvFootageInput = z.infer<typeof AnalyzeCctvFootageInputSchema>;

const AnalyzeCctvFootageOutputSchema = z.object({
  unaccompaniedChildrenDetected: z
    .boolean()
    .describe('Whether unaccompanied children were detected in the footage.'),
  numberOfChildren: z.number().describe('The number of unaccompanied children detected.'),
  location: z.string().describe('The location where the children were detected.'),
  timestamp: z.string().describe('The timestamp of the footage.'),
  confidenceScore: z
    .number()
    .describe(
      'The confidence score of the detection, ranging from 0 to 1, with 1 being the most confident.'
    ),
  snapshotDataUri: z
    .string()
    .describe(
      'A snapshot of the CCTV footage where the children were detected, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    )
    .optional(),
});
export type AnalyzeCctvFootageOutput = z.infer<typeof AnalyzeCctvFootageOutputSchema>;

export async function analyzeCctvFootage(input: AnalyzeCctvFootageInput): Promise<AnalyzeCctvFootageOutput> {
  return analyzeCctvFootageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCctvFootagePrompt',
  input: {schema: AnalyzeCctvFootageInputSchema},
  output: {schema: AnalyzeCctvFootageOutputSchema},
  prompt: `You are an expert security analyst specializing in detecting unaccompanied children in CCTV footage.

You will use this information to determine if there are any unaccompanied children in the footage.
Specifically, look for children who appear to be alone, distressed, or in a potentially dangerous situation.

Analyze the following CCTV footage:

Location: {{{location}}}
Timestamp: {{{timestamp}}}
Footage: {{media url=cctvFootageDataUri}}

Consider factors such as the child's age, behavior, and surroundings to make your determination.

Set the unaccompaniedChildrenDetected output field to true if you detect unaccompanied children, and false otherwise.
Provide a confidence score (0-1) for your assessment in the confidenceScore field.
If unaccompaniedChildrenDetected is true, include a snapshot of the footage where the children are visible in the snapshotDataUri field.
`,
});

const analyzeCctvFootageFlow = ai.defineFlow(
  {
    name: 'analyzeCctvFootageFlow',
    inputSchema: AnalyzeCctvFootageInputSchema,
    outputSchema: AnalyzeCctvFootageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
