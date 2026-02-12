'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered suggestions for product listings.
 *
 * - aiListingAssistantSuggestion - A function that handles the AI listing assistant suggestion process.
 * - AIListingAssistantSuggestionInput - The input type for the aiListingAssistantSuggestion function.
 * - AIListingAssistantSuggestionOutput - The return type for the aiListingAssistantSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the AI Listing Assistant Suggestion
const AIListingAssistantSuggestionInputSchema = z.object({
  title: z.string().describe('The title of the product listing.'),
  description: z.string().describe('A detailed description of the product.'),
  photoDataUris: z
    .array(
      z
        .string()
        .describe(
          "A photo of an item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        )
    )
    .min(1, 'At least one photo is required.')
    .max(3, 'Maximum of three photos allowed.')
    .describe('An array of one to three images of the product.'),
});
export type AIListingAssistantSuggestionInput = z.infer<
  typeof AIListingAssistantSuggestionInputSchema
>;

// Output Schema for the AI Listing Assistant Suggestion
const AIListingAssistantSuggestionOutputSchema = z.object({
  suggestedCategory: z
    .enum([
      'Books',
      'Electronics',
      'Furniture',
      'Cycles',
      'Lab Equipment',
      'Hostel Essentials',
      'Daily Use Items',
      'Others',
    ])
    .describe('Suggested category for the product listing.'),
  suggestedPrice: z.number().describe('Optimal selling price in USD for the item.'),
  reasoning: z
    .string()
    .describe('An explanation for the suggested category and price, considering the campus marketplace context.'),
});
export type AIListingAssistantSuggestionOutput = z.infer<
  typeof AIListingAssistantSuggestionOutputSchema
>;

export async function aiListingAssistantSuggestion(
  input: AIListingAssistantSuggestionInput
): Promise<AIListingAssistantSuggestionOutput> {
  return aiListingAssistantSuggestionFlow(input);
}

const suggestListingDetailsPrompt = ai.definePrompt({
  name: 'suggestListingDetailsPrompt',
  input: {schema: AIListingAssistantSuggestionInputSchema},
  output: {schema: AIListingAssistantSuggestionOutputSchema},
  prompt: `You are an expert AI assistant for a campus marketplace named CampusCycle. Your task is to analyze product details and images to suggest an optimal selling price and an appropriate category.
The marketplace is for college students to buy and sell second-hand items. Consider factors like item condition, typical student budgets, and demand within a university setting.

Available categories are:
- Books
- Electronics
- Furniture
- Cycles
- Lab Equipment
- Hostel Essentials
- Daily Use Items
- Others

Product Title: {{{title}}}
Product Description: {{{description}}}

{{#each photoDataUris}}
{{media url=this}}
{{/each}}

Based on the provided information, suggest the most appropriate category and an optimal selling price for this item on a college campus marketplace. Also provide a brief reasoning for your suggestions.`,
});

const aiListingAssistantSuggestionFlow = ai.defineFlow(
  {
    name: 'aiListingAssistantSuggestionFlow',
    inputSchema: AIListingAssistantSuggestionInputSchema,
    outputSchema: AIListingAssistantSuggestionOutputSchema,
  },
  async input => {
    const {output} = await suggestListingDetailsPrompt(input);
    if (!output) {
      throw new Error('No output received from the AI model.');
    }
    return output;
  }
);
