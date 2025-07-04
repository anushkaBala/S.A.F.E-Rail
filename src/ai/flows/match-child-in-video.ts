// src/ai/flows/match-child-in-video.ts
'use server';
/**
 * @fileOverview Finds a specific child in a video by matching their photo.
 *
 * - matchChildInVideo - A function that handles the video analysis and child matching process.
 * - MatchChildInVideoInput - The input type for the matchChildInVideo function.
 * - MatchChildInVideoOutput - The return type for the matchChildInVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchChildInVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The video footage to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  childPhotoDataUri: z
    .string()
    .describe(
      "A photo of the child to find in the video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The location where the video was recorded.'),
});
export type MatchChildInVideoInput = z.infer<typeof MatchChildInVideoInputSchema>;

const MatchChildInVideoOutputSchema = z.object({
  isMatchFound: z.boolean().describe('Whether a match for the child was found in the video.'),
  matchConfidence: z
    .number()
    .describe(
      'The confidence score of the match, from 0 to 1. Only populated if a match is found.'
    )
    .optional(),
  isAlone: z
    .boolean()
    .describe('Whether the child appears to be alone in the video footage where they are matched.')
    .optional(),
  location: z.string().describe('The location of the CCTV camera where the match was found.'),
});
export type MatchChildInVideoOutput = z.infer<typeof MatchChildInVideoOutputSchema>;

export async function matchChildInVideo(
  input: MatchChildInVideoInput
): Promise<MatchChildInVideoOutput> {
  return matchChildInVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchChildInVideoPrompt',
  input: {schema: MatchChildInVideoInputSchema},
  output: {schema: MatchChildInVideoOutputSchema},
  prompt: `You are an advanced AI security expert specializing in video analysis and facial recognition.
Your task is to determine if a specific child appears in a given video footage.

You are provided with two media inputs:
1.  A video to analyze: {{media url=videoDataUri}}
2.  A photo of the child to search for: {{media url=childPhotoDataUri}}

Instructions:
- Carefully analyze the entire video footage.
- Compare the faces detected in the video with the face in the provided child's photo.
- If you find a clear match, set 'isMatchFound' to true.
- If a match is found, provide a confidence score for the match in 'matchConfidence'.
- If a match is found, determine if the child appears to be alone and set the 'isAlone' field.
- If no match is found, set 'isMatchFound' to false and leave the other fields empty.
- The location of the footage is {{{location}}}. Include this in your output.
`,
});

const matchChildInVideoFlow = ai.defineFlow(
  {
    name: 'matchChildInVideoFlow',
    inputSchema: MatchChildInVideoInputSchema,
    outputSchema: MatchChildInVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
