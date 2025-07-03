'use server';
/**
 * @fileOverview Generates a photorealistic portrait of a person.
 *
 * - generatePersonImage - A function that generates an image of a person based on details.
 * - GeneratePersonImageInput - The input type for the generatePersonImage function.
 * - GeneratePersonImageOutput - The return type for the generatePersonImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonImageInputSchema = z.object({
  age: z.number().describe('The age of the person.'),
  gender: z.string().describe('The gender of the person (e.g., Male, Female).'),
  wearsSpectacles: z.boolean().describe('Whether the person wears spectacles.'),
});
export type GeneratePersonImageInput = z.infer<typeof GeneratePersonImageInputSchema>;

const GeneratePersonImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GeneratePersonImageOutput = z.infer<typeof GeneratePersonImageOutputSchema>;

export async function generatePersonImage(
  input: GeneratePersonImageInput
): Promise<GeneratePersonImageOutput> {
  return generatePersonImageFlow(input);
}

const generatePersonImageFlow = ai.defineFlow(
  {
    name: 'generatePersonImageFlow',
    inputSchema: GeneratePersonImageInputSchema,
    outputSchema: GeneratePersonImageOutputSchema,
  },
  async ({ age, gender, wearsSpectacles }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a photorealistic, passport-style, forward-facing color portrait of a ${age}-year-old Indian ${gender.toLowerCase()}. ${
        wearsSpectacles ? 'The person is wearing spectacles.' : 'The person is not wearing spectacles.'
      } The background should be neutral gray. The expression should be neutral.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
