
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { assessVulnerability } from '@/ai/flows/assess-vulnerability';
import { summarizeScanResults } from '@/ai/flows/summarize-scan-results';
import type { Vulnerability } from '@/lib/definitions';

const SCAN_LOGS = [
  'Target confirmed. Initializing scanners...',
  'Checking for open ports (Nmap)...',
  'Analyzing web server configuration...',
  'Scanning for SQL injection vectors...',
  'Probing for Cross-Site Scripting (XSS)...',
  'Checking for insecure headers...',
  'Analyzing robots.txt and sitemap.xml...',
  'Compiling results...',
  'Running AI-powered vulnerability generation...',
  'Running AI-powered severity assessment...',
  'Scan complete. Redirecting...',
];

// This simulates the raw output you might get from a tool like ZAP or Nikto
const SIMULATED_RAW_SCAN_OUTPUT = `
{
  "site": "https://example.com",
  "alerts": [
    {
      "pluginid": "10021",
      "alert": "X-Content-Type-Options Header Missing",
      "name": "X-Content-Type-Options Header Missing",
      "risk": "Low",
      "description": "The X-Content-Type-Options header is not set. This could allow an attacker to perform MIME-sniffing attacks.",
      "solution": "Ensure that the X-Content-Type-Options header is set to 'nosniff' for all responses."
    },
    {
      "pluginid": "40012",
      "alert": "Cross-Domain JavaScript Source File Inclusion",
      "name": "Cross-Domain JavaScript Source File Inclusion",
      "risk": "Medium",
      "description": "The page includes a script from a third-party domain. This could expose the site to security risks if the third-party domain is compromised.",
      "solution": "Host all JavaScript files on the same domain as the application."
    },
    {
      "pluginid": "90022",
      "alert": "Application Error Disclosure",
      "name": "Application Error Disclosure",
      "risk": "Medium",
      "description": "The application may be leaking error messages or stack traces. This can reveal sensitive information about the application's internals.",
      "solution": "Configure the application to show generic error pages instead of detailed error messages."
    }
  ]
}
`;


export function ScanForm() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (isScanning) {
      setProgress(0);
      setLogs([]);
      let currentProgress = 0;
      let logIndex = 0;

      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 10;
        setProgress(Math.min(currentProgress, 100));
      }, 800);

      const logInterval = setInterval(() => {
        if (logIndex < SCAN_LOGS.length) {
          setLogs((prev) => [...prev, SCAN_LOGS[logIndex]]);
          logIndex++;
        }
      }, 1500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(logInterval);
      };
    }
  }, [isScanning]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = urlRef.current?.value;

    if (!user) {
      setError('You must be logged in to start a scan.');
      return;
    }
    if (!url) {
      setError('URL is required');
      return;
    }
     if (!consentGiven) {
      setError('You must agree to the terms before starting a scan.');
      return;
    }

    setError(null);
    setIsScanning(true);

    try {
      const scanTimestamp = serverTimestamp();
      // 1. Create a new scan document in Firestore
      const scansCollection = collection(firestore, 'users', user.uid, 'scans');
      const scanDocRef = await addDoc(scansCollection, {
        url: url,
        status: 'Scanning',
        createdAt: scanTimestamp,
        vulnerabilities: [],
        chainOfCustody: {
          userId: user.uid,
          userIp: '127.0.0.1', // MOCKED: In a real app, get this from the request
          userAgent: navigator.userAgent,
          timestamp: scanTimestamp,
        },
      });

      // 2. Simulate the scan process and use AI to generate vulnerabilities
      const totalScanDelay = 13000;
      const scanSteps = SCAN_LOGS.length - 3; // a few steps before AI generation
      const delayPerScanStep = totalScanDelay / scanSteps;

      for (let i = 0; i < scanSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, delayPerScanStep));
      }
      
      const summaryResult = await summarizeScanResults({ scanOutput: SIMULATED_RAW_SCAN_OUTPUT });
      // The summary in this case is expected to be a JSON array of vulnerabilities
      const foundVulnerabilities: Omit<Vulnerability, 'id'>[] = JSON.parse(summaryResult.summary);


      // 3. Run AI severity assessment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const assessedVulnerabilities = await Promise.all(
        foundVulnerabilities.map(async (vuln, index): Promise<Vulnerability> => {
          try {
            const assessment = await assessVulnerability({
              vulnerability: JSON.stringify(vuln),
              context: `The vulnerability was found on the ${url} website.`
            });
            return {
              ...vuln,
              id: `vuln-${scanDocRef.id}-${index}`,
              assessedSeverity: assessment.assessedSeverity,
              assessmentJustification: assessment.assessmentJustification,
            };
          } catch (e) {
            console.error("Could not assess vulnerability", e);
            // If AI assessment fails, return the original vulnerability
            return { ...vuln, id: `vuln-${scanDocRef.id}-${index}`};
          }
        })
      );
      
      // 4. Update the document with the final results
      await updateDoc(doc(firestore, 'users', user.uid, 'scans', scanDocRef.id), {
        status: 'Completed',
        completedAt: serverTimestamp(),
        vulnerabilities: assessedVulnerabilities,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 5. Redirect to the results page
      router.push(`/scan/${scanDocRef.id}`);

    } catch (err: any) {
      setError('Failed to start scan. Please try again.');
      console.error(err);
      setIsScanning(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Scan</CardTitle>
        <CardDescription>
          Enter a URL to start a new vulnerability scan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="url"
                name="url"
                ref={urlRef}
                placeholder="https://example.com"
                required
                disabled={isScanning}
                className="flex-grow"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isScanning || !user || !consentGiven}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(checked as boolean)} disabled={isScanning} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have authorization to scan this website and accept the terms of use.
              </label>
            </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </form>
        {isScanning && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Scan in progress...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            <Card className="bg-muted/50 font-code">
              <CardContent className="p-4">
                <ScrollArea className="h-48">
                  <div className="text-sm">
                    {logs.map((log, index) => (
                       <p key={index} className="animate-in fade-in flex items-center gap-2">
                        {(log.includes('AI-powered') || log.includes('generation')) && <Sparkles className="h-4 w-4 text-primary" />}
                        <span>{`> ${log}`}</span>
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
