import type { Timestamp } from 'firebase/firestore';

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
