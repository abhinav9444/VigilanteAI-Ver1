import { Scan, Vulnerability, User } from './definitions';

const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'vuln-001',
    name: 'SQL Injection',
    description:
      'A SQL injection vulnerability allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve. This might include data belonging to other users, or any other data that the application itself is able to access.',
    severity: 'High',
    cwe: 'CWE-89',
    remediation:
      'Use parameterized queries or prepared statements. Sanitize and validate all user input. Implement the principle of least privilege for database access.',
    evidence: 'The parameter `id` in `/api/products` seems to be vulnerable.',
  },
  {
    id: 'vuln-002',
    name: 'Cross-Site Scripting (XSS)',
    description:
      'Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.',
    severity: 'High',
    cwe: 'CWE-79',
    remediation:
      'Encode data on output. Use a Content Security Policy (CSP). Validate user input to prevent script injection.',
    evidence: 'A malicious script was executed from the search query parameter.',
  },
  {
    id: 'vuln-003',
    name: 'Insecure Security Headers',
    description:
      'The application is missing key security headers, which can expose it to various attacks like clickjacking, cross-site scripting, and information leakage.',
    severity: 'Medium',
    cwe: 'CWE-693',
    remediation:
      'Implement `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection` headers.',
    evidence:
      'Missing headers: Content-Security-Policy, Strict-Transport-Security.',
  },
  {
    id: 'vuln-004',
    name: 'Open Port - FTP (21)',
    description:
      'An open FTP port (21) was detected. FTP is an insecure protocol that transmits data, including credentials, in plaintext. This could allow an attacker to sniff credentials and gain unauthorized access.',
    severity: 'Medium',
    cwe: 'CWE-319',
    remediation:
      'If FTP is not required, close the port. If file transfer is needed, use a secure alternative like SFTP (SSH File Transfer Protocol) or FTPS (FTP over SSL/TLS).',
    evidence: 'Port 21 is open and responded to a connection request.',
  },
  {
    id: 'vuln-005',
    name: 'Software Version Disclosure',
    description:
      'The server is disclosing its software version (e.g., Apache/2.4.41). This information can help an attacker identify known vulnerabilities in that specific version.',
    severity: 'Low',
    cwe: 'CWE-200',
    remediation:
      'Configure the web server to suppress the `Server` header or to display a generic value.',
    evidence: 'Server header returned: `Server: Apache/2.4.41 (Ubuntu)`.',
  },
];

let MOCK_SCANS: Scan[] = [
  {
    id: 'scan-1',
    url: 'https://example-vulnerable.com',
    status: 'Completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    vulnerabilities: MOCK_VULNERABILITIES.slice(0, 3),
  },
  {
    id: 'scan-2',
    url: 'https://another-site.org',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
    vulnerabilities: MOCK_VULNERABILITIES.slice(2, 5),
  },
  {
    id: 'scan-3',
    url: 'https://my-app.dev',
    status: 'Failed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    vulnerabilities: [],
  },
];

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Drake',
  email: 'alex.drake@vigilante.ai',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

// Simulate API latency
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getAllScans(): Promise<Scan[]> {
  await apiDelay(500);
  return MOCK_SCANS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getScanById(id: string): Promise<Scan | undefined> {
  await apiDelay(500);
  return MOCK_SCANS.find(scan => scan.id === id);
}

export async function createScan(url: string): Promise<Scan> {
  await apiDelay(200);
  const newScan: Scan = {
    id: `scan-${Date.now()}`,
    url,
    status: 'Queued',
    createdAt: new Date().toISOString(),
    vulnerabilities: [],
  };
  MOCK_SCANS.unshift(newScan);
  return newScan;
}

export async function updateScanStatus(id: string, status: Scan['status']): Promise<Scan | undefined> {
    await apiDelay(100);
    const scanIndex = MOCK_SCANS.findIndex(scan => scan.id === id);
    if(scanIndex > -1) {
        MOCK_SCANS[scanIndex].status = status;
        if (status === 'Completed') {
            MOCK_SCANS[scanIndex].completedAt = new Date().toISOString();
            // Add random vulnerabilities for demo purposes
            MOCK_SCANS[scanIndex].vulnerabilities = MOCK_VULNERABILITIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * MOCK_VULNERABILITIES.length) + 1);
        }
        return MOCK_SCANS[scanIndex];
    }
    return undefined;
}
