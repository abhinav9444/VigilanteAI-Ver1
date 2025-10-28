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
  scanOutput: z.string().describe('Raw JSON output from a web vulnerability scan.'),
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
  prompt: `You are an AI-powered security analyst. Your task is to analyze the output of a web vulnerability scan and provide a summary of the findings as a JSON array.

  Convert the raw scan alerts into a structured JSON array of vulnerability objects. Each object must contain the following fields: 'name', 'description', 'severity' (one of 'Critical', 'High', 'Medium', 'Low'), 'cwe', and 'remediation'.

  Here is the scan output:
  {{{scanOutput}}}
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
