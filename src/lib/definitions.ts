import type { Timestamp } from 'firebase/firestore';

export type Vulnerability = {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cwe: string;
  remediation: string;
  evidence: string;
};

export type Scan = {
  id: string;
  url: string;
  status: 'Queued' | 'Scanning' | 'Completed' | 'Failed';
  createdAt: Timestamp | string;
  completedAt?: Timestamp | string;
  vulnerabilities: Vulnerability[];
  summary?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};
