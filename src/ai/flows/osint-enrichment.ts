'use server';
/**
 * @fileOverview Enriches a scan with OSINT data using various tools.
 * 
 * - enrichScanWithOsint - A function that takes a URL and returns OSINT data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getVirusTotalInfo } from '../tools/osint-tools';
import { OsintEnrichmentInputSchema, OsintEnrichmentOutput, OsintEnrichmentOutputSchema, OsintEnrichmentInput } from '@/lib/definitions';


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
