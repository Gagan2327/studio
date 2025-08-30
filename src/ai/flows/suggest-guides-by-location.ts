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
  ratePerHour: z.number().describe('The rate per hour charged by the guide.'),
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
Each guide should have a photoUrl, name, rating, ratePerHour, tags and description.
`,
});

const suggestGuidesByLocationFlow = ai.defineFlow(
  {
    name: 'suggestGuidesByLocationFlow',
    inputSchema: SuggestGuidesByLocationInputSchema,
    outputSchema: SuggestGuidesByLocationOutputSchema,
  },
  async input => {
    const location = input.location.toLowerCase().trim();
    if (location === 'roorkee') {
      return {
        guides: [
          {
            guideId: '1',
            name: 'Aarav Sharma',
            photoUrl: 'https://picsum.photos/300/300?random=1',
            rating: 4.8,
            ratePerHour: 25,
            tags: ['History', 'Architecture', 'IIT Roorkee'],
            description: 'Enthusiastic history buff and architecture lover, showing you the gems of IIT Roorkee and the city\'s past.',
          },
          {
            guideId: '2',
            name: 'Priya Singh',
            photoUrl: 'https://picsum.photos/300/300?random=2',
            rating: 4.9,
            ratePerHour: 30,
            tags: ['Foodie', 'Local Cuisine', 'Street Food'],
            description: 'Join me on a culinary journey through Roorkee\'s best street food and local eateries.',
          },
          {
            guideId: '3',
            name: 'Rohan Gupta',
            photoUrl: 'https://picsum.photos/300/300?random=3',
            rating: 4.7,
            ratePerHour: 20,
            tags: ['Adventure', 'Nature', 'Ganges Canal'],
            description: 'Explorer and nature enthusiast. Let\'s discover the natural beauty around Roorkee and the Upper Ganges Canal.',
          },
          {
            guideId: '4',
            name: 'Meera Chauhan',
            photoUrl: 'https://picsum.photos/300/300?random=4',
            rating: 4.8,
            ratePerHour: 28,
            tags: ['Spiritual', 'Temples', 'Yoga'],
            description: 'Find peace and spiritual solace. I specialize in tours of local temples and serene yoga spots.',
          },
        ],
      };
    } else if (location === 'dehradun') {
        return {
            guides: [
                {
                    guideId: '5',
                    name: 'Kavya Joshi',
                    photoUrl: 'https://picsum.photos/300/300?random=5',
                    rating: 4.9,
                    ratePerHour: 35,
                    tags: ['Sightseeing', 'Mussoorie', 'Cafes'],
                    description: 'Your friendly guide to the Queen of Hills, Mussoorie, and the coziest cafes in Dehradun.',
                },
                {
                    guideId: '6',
                    name: 'Arjun Negi',
                    photoUrl: 'https://picsum.photos/300/300?random=6',
                    rating: 4.8,
                    ratePerHour: 30,
                    tags: ['Trekking', 'Robber\'s Cave', 'Nature'],
                    description: 'Adventure awaits! I lead exciting treks and tours to places like Robber\'s Cave.',
                },
                {
                    guideId: '7',
                    name: 'Ishaan Verma',
                    photoUrl: 'https://picsum.photos/300/300?random=7',
                    rating: 4.7,
                    ratePerHour: 28,
                    tags: ['Forest Research Institute', 'History', 'Museums'],
                    description: 'Let\'s dive into the rich history of Dehradun, with special tours of the Forest Research Institute.',
                },
                {
                    guideId: '8',
                    name: 'Diya Bhandari',
                    photoUrl: 'https://picsum.photos/300/300?random=8',
                    rating: 4.9,
                    ratePerHour: 32,
                    tags: ['Shopping', 'Local Markets', 'Food'],
                    description: 'I\'ll help you find the best souvenirs and street food at Paltan Bazaar and other local hotspots.',
                },
            ]
        }
    } else if (location === 'haridwar') {
        return {
            guides: [
                 {
                    guideId: '9',
                    name: 'Aditi Sharma',
                    photoUrl: 'https://picsum.photos/300/300?random=9',
                    rating: 4.9,
                    ratePerHour: 40,
                    tags: ['Spiritual', 'Ganga Aarti', 'Temples'],
                    description: 'Experience the divine Ganga Aarti at Har Ki Pauri and explore ancient temples with a local expert.',
                },
                {
                    guideId: '10',
                    name: 'Rishi Trivedi',
                    photoUrl: 'https://picsum.photos/300/300?random=10',
                    rating: 4.8,
                    ratePerHour: 35,
                    tags: ['Yoga', 'Ashrams', 'Meditation'],
                    description: 'Discover tranquility and learn yoga at renowned ashrams along the banks of the Ganges.',
                },
                {
                    guideId: '11',
                    name: 'Anika Desai',
                    photoUrl: 'https://picsum.photos/300/300?random=11',
                    rating: 4.7,
                    ratePerHour: 30,
                    tags: ['Foodie', 'Street Food', 'Sweets'],
                    description: 'A culinary tour of Haridwar, from spicy chaat to delicious local sweets. Your taste buds will thank you!',
                },
                {
                    guideId: '12',
                    name: 'Nikhil Bharadwaj',
                    photoUrl: 'https://picsum.photos/300/300?random=12',
                    rating: 4.8,
                    ratePerHour: 38,
                    tags: ['Mansa Devi Temple', 'Cable Car', 'Sightseeing'],
                    description: 'Join me for a panoramic view of Haridwar from the Mansa Devi Temple, accessible by a thrilling cable car ride.',
                }
            ]
        }
    }

    const {output} = await prompt(input);
    return output!;
  }
);
