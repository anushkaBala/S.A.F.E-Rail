'use server';
/**
 * @fileOverview Identifies a child from an uploaded image using facial recognition.
 *
 * - identifyChildFromUpload - A function that handles the child identification process.
 * - IdentifyChildFromUploadInput - The input type for the identifyChildFromUpload function.
 * - IdentifyChildFromUploadOutput - The return type for the identifyChildFromUpload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyChildFromUploadInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a child, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  age: z.number().optional().describe('The estimated age of the child.'),
  gender: z.string().optional().describe('The estimated gender of the child.'),
  wearsSpectacles: z.boolean().optional().describe('Whether the child is wearing spectacles.'),
});
export type IdentifyChildFromUploadInput = z.infer<typeof IdentifyChildFromUploadInputSchema>;

const IdentifyChildFromUploadOutputSchema = z.object({
  isChildIdentified: z.boolean().describe('Whether or not the input is a child.'),
  confidenceScore: z.number().describe('The confidence score of the identification.'),
  childDetails: z
    .object({
      name: z.string().describe('The name of the identified child.').optional(),
      age: z.number().describe('The age of the identified child.').optional(),
      guardianContact: z.string().describe('The contact information of the guardian.').optional(),
    })
    .optional(),
});

export type IdentifyChildFromUploadOutput = z.infer<typeof IdentifyChildFromUploadOutputSchema>;

export async function identifyChildFromUpload(
  input: IdentifyChildFromUploadInput
): Promise<IdentifyChildFromUploadOutput> {
  return identifyChildFromUploadFlow(input);
}

const identifyChildFromUploadPrompt = ai.definePrompt({
  name: 'identifyChildFromUploadPrompt',
  input: {schema: IdentifyChildFromUploadInputSchema},
  output: {schema: IdentifyChildFromUploadOutputSchema},
  prompt: `You are an expert in facial recognition and child identification.

You will receive an image of a person and determine if it is a child. If it is a child, you will attempt to identify the child and provide a confidence score for the identification.

Use the provided details to improve the accuracy of the identification.
{{#if age}}Estimated Age: {{{age}}}{{/if}}
{{#if gender}}Gender: {{{gender}}}{{/if}}
{{#if wearsSpectacles}}Wears Spectacles: Yes{{/if}}

Analyze the following image:

{{media url=photoDataUri}}

Return a JSON object with the following format:
{
  "isChildIdentified": true/false,
  "confidenceScore": number between 0 and 1,
  "childDetails": {
    "name": "Child's Name",
    "age": Child's Age,
    "guardianContact": "Guardian's Contact Information"
  }
}

If the person in the image is not a child, return:
{
  "isChildIdentified": false,
  "confidenceScore": 0
}
`,
});

const identifyChildFromUploadFlow = ai.defineFlow(
  {name: 'identifyChildFromUploadFlow', inputSchema: IdentifyChildFromUploadInputSchema, outputSchema: IdentifyChildFromUploadOutputSchema},
  async input => {
    const {output} = await identifyChildFromUploadPrompt(input);
    return output!;
  }
);
