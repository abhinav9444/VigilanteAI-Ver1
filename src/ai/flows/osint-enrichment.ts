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
import { getVirusTotalInfo } from '../tools/osint-tools';

export const OsintEnrichmentInputSchema = z.object({
  url: z.string().describe('The URL to enrich with OSINT data.'),
});
export type OsintEnrichmentInput = z.infer<typeof OsintEnrichmentInputSchema>;

// Schema for VirusTotal Information, moved here to avoid export issues.
const virusTotalInfoSchema = z.object({
  last_analysis_stats: z.object({
    harmless: z.number(),
    malicious: z.number(),
    suspicious: z.number(),
    undetected: z.number(),
    timeout: z.number(),
  }),
  reputation: z.number(),
  last_modification_date: z.number(),
  whois: z.string().optional(),
});


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
  },
  async (input) => {
    
    try {
        const virusTotalData = await getVirusTotalInfo({ domain: new URL(input.url).hostname });
        return {
          virusTotal: virusTotalData,
        };
    } catch (error) {
        console.error("Failed to run OSINT enrichment flow", error);
        // Return an empty object or partial data if a tool fails
        return {};
    }
  }
);
