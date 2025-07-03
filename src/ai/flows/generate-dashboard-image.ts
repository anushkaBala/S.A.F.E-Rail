'use server';
/**
 * @fileOverview Generates an image for the dashboard.
 *
 * - generateDashboardImage - A function that generates an image of a train station.
 * - GenerateDashboardImageOutput - The return type for the generateDashboardImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDashboardImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateDashboardImageOutput = z.infer<typeof GenerateDashboardImageOutputSchema>;

export async function generateDashboardImage(): Promise<GenerateDashboardImageOutput> {
  return generateDashboardImageFlow();
}

const generateDashboardImageFlow = ai.defineFlow(
  {
    name: 'generateDashboardImageFlow',
    inputSchema: z.void(),
    outputSchema: GenerateDashboardImageOutputSchema,
  },
  async () => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt:
        'A photorealistic, vibrant, wide-angle shot of a bustling Indian train station platform, in the style of a high-quality travel photograph. The scene should be full of people, with a classic Indian train visible. The lighting should be warm and atmospheric, evoking a sense of travel and adventure.',
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
