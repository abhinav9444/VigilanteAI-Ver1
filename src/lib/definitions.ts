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
export const virusTotalToolOutputSchema = z.object({
  last_analysis_stats: z.object({
    harmless: z.number(),
    malicious: z.number(),
    suspicious: z.number(),
    undetected: z.number(),
    timeout: z.number(),
  }),
  reputation: z.number(),
  last_modification_date: z.number(),
});

// Schema for WHOIS Information
const whoisInfoSchema = z.object({
    domainName: z.string().optional(),
    registrarName: z.string().optional(),
    createdDate: z.string().optional(),
    expiresDate: z.string().optional(),
    updatedDate: z.string().optional(),
    registrant: z.object({
        name: z.string().optional(),
        organization: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
    nameServers: z.object({
        hostNames: z.array(z.string()).optional(),
    }).optional(),
    error: z.string().optional(),
}).optional();

// Schema for Shodan Host Data
export const ShodanDataSchema = z.object({
  ip_str: z.string().optional(),
  org: z.string().optional(),
  os: z.string().nullable().optional(),
  ports: z.array(z.number()).optional(),
  hostnames: z.array(z.string()).optional(),
  vulns: z.array(z.string()).optional(),
  error: z.string().optional(),
}).nullable();
export type ShodanData = z.infer<typeof ShodanDataSchema>;


export const OsintEnrichmentOutputSchema = z.object({
    virusTotal: virusTotalToolOutputSchema.optional().describe('VirusTotal analysis results.'),
    whois: whoisInfoSchema.optional().describe('WHOIS information.'),
    shodan: ShodanDataSchema.optional().describe('Shodan host lookup results.'),
});
export type OsintEnrichmentOutput = z.infer<typeof OsintEnrichmentOutputSchema>;
