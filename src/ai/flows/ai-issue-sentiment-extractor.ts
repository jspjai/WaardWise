'use server';
/**
 * @fileOverview This file implements a Genkit flow for extracting key local issues, sentiment, and emerging trends
 * from free-text survey fields. It is designed to assist Super Admins in quickly understanding the qualitative
 * pulse of a ward and identifying actionable insights.
 *
 * - aiIssueSentimentExtractor - A function that triggers the AI analysis.
 * - AiIssueSentimentExtractorInput - The input type for the aiIssueSentimentExtractor function.
 * - AiIssueSentimentExtractorOutput - The return type for the aiIssueSentimentExtractor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiIssueSentimentExtractorInputSchema = z.object({
  top1LocalIssue: z.string().describe('The free-text entry for the top 1 local issue mentioned by a respondent.'),
  fieldObserverNotes: z.string().describe('Free-text observations and notes made by the field surveyor.'),
});
export type AiIssueSentimentExtractorInput = z.infer<typeof AiIssueSentimentExtractorInputSchema>;

const AiIssueSentimentExtractorOutputSchema = z.object({
  keyLocalIssues: z
    .array(z.string())
    .describe('A list of the most important local issues identified from the text.'),
  overallSentiment:
    z.enum(['Positive', 'Neutral', 'Negative']).describe('The overall sentiment expressed in the text.'),
  detailedSentiment:
    z.array(z.object({
      aspect: z.string().describe('The specific aspect or entity the sentiment is about.'),
      sentiment: z.enum(['Positive', 'Neutral', 'Negative']).describe('The sentiment towards this aspect.'),
    }))
    .describe('Detailed sentiment analysis for various aspects mentioned in the text.'),
  emergingTrends: z.array(z.string()).describe('Identified emerging trends or patterns from the text.'),
  summary: z.string().describe('A concise summary of the key findings from the analysis.'),
});
export type AiIssueSentimentExtractorOutput = z.infer<typeof AiIssueSentimentExtractorOutputSchema>;

export async function aiIssueSentimentExtractor(
  input: AiIssueSentimentExtractorInput
): Promise<AiIssueSentimentExtractorOutput> {
  return aiIssueSentimentExtractorFlow(input);
}

const aiIssueSentimentExtractorPrompt = ai.definePrompt({
  name: 'aiIssueSentimentExtractorPrompt',
  input: {schema: AiIssueSentimentExtractorInputSchema},
  output: {schema: AiIssueSentimentExtractorOutputSchema},
  config: {
    safetySettings: [
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH'},
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH'},
    ],
  },
  prompt: `You are an expert political analyst tasked with understanding the qualitative pulse of a ward. Your goal is to analyze free-text survey responses to identify key local issues, determine the overall sentiment, detail sentiment towards specific aspects, and detect emerging trends.

You must provide your analysis in a JSON object that strictly adheres to the following schema:
{{{output.schema}}}

Here are the free-text entries for analysis:

Top 1 Local Issue: {{{top1LocalIssue}}}

Field Observer Notes: {{{fieldObserverNotes}}}`,
});

const aiIssueSentimentExtractorFlow = ai.defineFlow(
  {
    name: 'aiIssueSentimentExtractorFlow',
    inputSchema: AiIssueSentimentExtractorInputSchema,
    outputSchema: AiIssueSentimentExtractorOutputSchema,
  },
  async input => {
    const {output} = await aiIssueSentimentExtractorPrompt(input);
    return output!;
  }
);
