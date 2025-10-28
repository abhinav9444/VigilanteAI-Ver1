'use server';
/**
 * @fileOverview Enriches a scan with OSINT data using various tools.
 * 
 * - enrichScanWithOsint - A function that takes a URL and returns OSINT data.
 * - OsintEnrichmentInput - The input type for the enrichScanWithOsint function.
 * - OsintEnrichmentOutput - The return type for the enrichScanWithOsint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getVirusTotalInfo, virusTotalInfoSchema } from '../tools/osint-tools';

export const OsintEnrichmentInputSchema = z.object({
  url: z.string().describe('The URL to enrich with OSINT data.'),
});
export type OsintEnrichmentInput = z.infer<typeof OsintEnrichmentInputSchema>;

export const OsintEnrichmentOutputSchema = z.object({
    virusTotal: virusTotalInfoSchema.optional().describe('VirusTotal analysis results.'),
});
export type OsintEnrichmentOutput = z.infer<typeof OsintEnrichmentOutputSchema>;

export async function enrichScanWithOsint(input: OsintEnrichmentInput): Promise<OsintEnrichmentOutput> {
  return osintEnrichmentFlow(input);
}

const osintEnrichmentFlow = ai.defineFlow(
  {
    name: 'osintEnrichmentFlow',
    inputSchema: OsintEnrichmentInputSchema,
    outputSchema: OsintEnrichmentOutputSchema,
    tools: [getVirusTotalInfo],
  },
  async (input) => {
    
    const virusTotalData = await ai.runTool('getVirusTotalInfo', { domain: new URL(input.url).hostname });

    return {
      virusTotal: virusTotalData,
    };
  }
);
