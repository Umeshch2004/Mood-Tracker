'use server';

/**
 * @fileOverview A mood trend analysis AI agent.
 *
 * - analyzeMoodTrends - A function that analyzes mood trends based on mood logs and notes.
 * - AnalyzeMoodTrendsInput - The input type for the analyzeMoodTrends function.
 * - AnalyzeMoodTrendsOutput - The return type for the analyzeMoodTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodTrendsInputSchema = z.object({
  moodLogs: z
    .array(
      z.object({
        mood: z.string(),
        note: z.string().optional(),
        timestamp: z.string(),
      })
    )
    .describe('An array of mood logs, each containing the mood, note, and timestamp.'),
});
export type AnalyzeMoodTrendsInput = z.infer<typeof AnalyzeMoodTrendsInputSchema>;

const AnalyzeMoodTrendsOutputSchema = z.object({
  trendSummary: z
    .string()
    .describe('A summary of the overall trends in the user\'s mood based on the mood logs and notes.'),
});
export type AnalyzeMoodTrendsOutput = z.infer<typeof AnalyzeMoodTrendsOutputSchema>;

export async function analyzeMoodTrends(input: AnalyzeMoodTrendsInput): Promise<AnalyzeMoodTrendsOutput> {
  return analyzeMoodTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodTrendsPrompt',
  input: {schema: AnalyzeMoodTrendsInputSchema},
  output: {schema: AnalyzeMoodTrendsOutputSchema},
  prompt: `You are a mood analysis expert. Analyze the following mood logs and notes to identify overall trends in the user's mood.\n\nMood Logs:\n{{#each moodLogs}}\n- Mood: {{this.mood}}, Note: {{this.note}}, Timestamp: {{this.timestamp}}\n{{/each}}\n\nBased on these logs, provide a concise summary of the user's mood trends.`,
});

const analyzeMoodTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMoodTrendsFlow',
    inputSchema: AnalyzeMoodTrendsInputSchema,
    outputSchema: AnalyzeMoodTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
