'use server';
/**
 * @fileOverview Summarizes web vulnerability scan results using AI.
 *
 * - summarizeScanResults - A function that summarizes the scan results.
 * - SummarizeScanResultsInput - The input type for the summarizeScanResults function.
 * - SummarizeScanResultsOutput - The return type for the summarizeScanResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeScanResultsInputSchema = z.object({
  targetUrl: z.string().describe('The URL of the website that was scanned.'),
});
export type SummarizeScanResultsInput = z.infer<typeof SummarizeScanResultsInputSchema>;

const SummarizeScanResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the scan results, formatted as a JSON array of vulnerability objects. Each object should include name, description, severity, cwe, and remediation.'),
});
export type SummarizeScanResultsOutput = z.infer<typeof SummarizeScanResultsOutputSchema>;

export async function summarizeScanResults(input: SummarizeScanResultsInput): Promise<SummarizeScanResultsOutput> {
  return summarizeScanResultsFlow(input);
}

const summarizeScanResultsPrompt = ai.definePrompt({
  name: 'summarizeScanResultsPrompt',
  input: {schema: SummarizeScanResultsInputSchema},
  output: {schema: SummarizeScanResultsOutputSchema},
  prompt: `You are an AI-powered security analyst. Your task is to generate a list of 3 to 5 common, hypothetical web vulnerabilities for a given target URL.

  The target is: {{{targetUrl}}}

  Generate a plausible, but not real, set of findings. The output must be a JSON array of vulnerability objects. Each object must contain the following fields: 'name', 'description', 'severity' (one of 'Critical', 'High', 'Medium', 'Low'), 'cwe', and 'remediation'.

  For example, for a generic corporate website, you might include things like 'Cross-Site Scripting (XSS) in search bar' or 'Outdated Server Software'.
  `,
});

const summarizeScanResultsFlow = ai.defineFlow(
  {
    name: 'summarizeScanResultsFlow',
    inputSchema: SummarizeScanResultsInputSchema,
    outputSchema: SummarizeScanResultsOutputSchema,
  },
  async input => {
    const {output} = await summarizeScanResultsPrompt(input);
    return output!;
  }
);
