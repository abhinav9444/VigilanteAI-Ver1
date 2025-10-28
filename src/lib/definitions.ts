import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export type ChainOfCustody = {
  userId: string;
  userIp: string; // Note: In a real app, handle this securely and respect privacy.
  userAgent: string;
  timestamp: Timestamp | string;
};

export type Vulnerability = {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cwe?: string;
  remediation: string;
  evidence?: string;
  assessedSeverity?: 'Critical' | 'High' | 'Medium' | 'Low';
  assessmentJustification?: string;
};

export type Scan = {
  id: string;
  url: string;
  status: 'Queued' | 'Scanning' | 'Completed' | 'Failed';
  createdAt: Timestamp | string;
  completedAt?: Timestamp | string;
  vulnerabilities: Vulnerability[];
  summary?: string;
  chainOfCustody?: ChainOfCustody;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

// OSINT Enrichment Schemas
export const OsintEnrichmentInputSchema = z.object({
  url: z.string().describe('The URL to enrich with OSINT data.'),
});
export type OsintEnrichmentInput = z.infer<typeof OsintEnrichmentInputSchema>;

// Schema for VirusTotal Information
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
