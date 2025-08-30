'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting local guides based on a location entered by a tourist.
 *
 * - suggestGuidesByLocation - An async function that takes a location as input and returns a list of suggested guides.
 * - SuggestGuidesByLocationInput - The input type for the suggestGuidesByLocation function.
 * - SuggestGuidesByLocationOutput - The output type for the suggestGuidesByLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const SuggestGuidesByLocationInputSchema = z.object({
  location: z.string().describe('The location for which to find guides.'),
});
export type SuggestGuidesByLocationInput = z.infer<typeof SuggestGuidesByLocationInputSchema>;

// Define the output schema for the flow
const GuideSchema = z.object({
  guideId: z.string().describe('Unique identifier for the guide.'),
  name: z.string().describe('Name of the guide.'),
  photoUrl: z.string().describe('URL of the guide\s photo.'),
  rating: z.number().describe('Rating of the guide (e.g., 4.5).'),
  tags: z.array(z.string()).describe('List of tags associated with the guide (e.g., "Shelter Available", "Locations", "Expert Type").'),
  description: z.string().describe('A short description of the guide.'),
});

const SuggestGuidesByLocationOutputSchema = z.object({
  guides: z.array(GuideSchema).describe('List of suggested guides for the location.'),
});

export type SuggestGuidesByLocationOutput = z.infer<typeof SuggestGuidesByLocationOutputSchema>;

// Define the flow function
export async function suggestGuidesByLocation(input: SuggestGuidesByLocationInput): Promise<SuggestGuidesByLocationOutput> {
  return suggestGuidesByLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGuidesByLocationPrompt',
  input: {schema: SuggestGuidesByLocationInputSchema},
  output: {schema: SuggestGuidesByLocationOutputSchema},
  prompt: `You are a travel expert. Given a location, suggest a list of local guides that would be suitable for a tourist.

Location: {{{location}}}

Format your response as a JSON object conforming to the SuggestGuidesByLocationOutputSchema schema.
Include a diverse range of guides with varying specializations and availability.
Each guide should have a photoUrl, name, rating, tags and description.
`,
});

const suggestGuidesByLocationFlow = ai.defineFlow(
  {
    name: 'suggestGuidesByLocationFlow',
    inputSchema: SuggestGuidesByLocationInputSchema,
    outputSchema: SuggestGuidesByLocationOutputSchema,
  },
  async input => {
    if (input.location.toLowerCase().trim() === 'roorkee') {
      return {
        guides: [
          {
            guideId: '1',
            name: 'Aarav Sharma',
            photoUrl: 'https://picsum.photos/300/300?random=1',
            rating: 4.8,
            tags: ['History', 'Architecture', 'IIT Roorkee'],
            description: 'Enthusiastic history buff and architecture lover, showing you the gems of IIT Roorkee and the city\'s past.',
          },
          {
            guideId: '2',
            name: 'Priya Singh',
            photoUrl: 'https://picsum.photos/300/300?random=2',
            rating: 4.9,
            tags: ['Foodie', 'Local Cuisine', 'Street Food'],
            description: 'Join me on a culinary journey through Roorkee\'s best street food and local eateries.',
          },
          {
            guideId: '3',
            name: 'Rohan Gupta',
            photoUrl: 'https://picsum.photos/300/300?random=3',
            rating: 4.7,
            tags: ['Adventure', 'Nature', 'Ganges Canal'],
            description: 'Explorer and nature enthusiast. Let\'s discover the natural beauty around Roorkee and the Upper Ganges Canal.',
          },
          {
            guideId: '4',
            name: 'Meera Chauhan',
            photoUrl: 'https://picsum.photos/300/300?random=4',
            rating: 4.8,
            tags: ['Spiritual', 'Temples', 'Yoga'],
            description: 'Find peace and spiritual solace. I specialize in tours of local temples and serene yoga spots.',
          },
        ],
      };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
