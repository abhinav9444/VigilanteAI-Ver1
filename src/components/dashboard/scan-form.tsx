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
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { MOCK_VULNERABILITIES } from '@/lib/mock-data';

const SCAN_LOGS = [
  'Target confirmed. Initializing scanners...',
  'Checking for open ports (Nmap)...',
  'Analyzing web server configuration...',
  'Scanning for SQL injection vectors...',
  'Probing for Cross-Site Scripting (XSS)...',
  'Checking for insecure headers...',
  'Analyzing robots.txt and sitemap.xml...',
  'Compiling results...',
  'Scan complete. Redirecting...',
];

export function ScanForm() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
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

    setError(null);
    setIsScanning(true);

    try {
      // 1. Create a new scan document in Firestore
      const scansCollection = collection(firestore, 'users', user.uid, 'scans');
      const scanDocRef = await addDoc(scansCollection, {
        url: url,
        status: 'Scanning',
        createdAt: serverTimestamp(),
        vulnerabilities: [],
      });

      // 2. Simulate the scan process
      const totalDelay = 15000;
      const steps = SCAN_LOGS.length;
      const delayPerStep = totalDelay / steps;

      for (let i = 0; i < steps; i++) {
        await new Promise((resolve) => setTimeout(resolve, delayPerStep));
      }
      
      // 3. Update the document with the final results
      await updateDoc(doc(firestore, 'users', user.uid, 'scans', scanDocRef.id), {
        status: 'Completed',
        completedAt: serverTimestamp(),
        vulnerabilities: MOCK_VULNERABILITIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * MOCK_VULNERABILITIES.length) + 1),
      });


      // 4. Redirect to the results page
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
                disabled={isScanning || !user}
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
                      <p key={index} className="animate-in fade-in">{`> ${log}`}</p>
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
