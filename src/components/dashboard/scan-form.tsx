'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createScan, updateScanStatus } from '@/lib/mock-data';

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
            setLogs(prev => [...prev, SCAN_LOGS[logIndex]]);
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

    if (!url) {
      setError('URL is required');
      return;
    }

    setError(null);
    setIsScanning(true);

    try {
        const newScan = await createScan(url);
        await updateScanStatus(newScan.id, 'Scanning');

        // Simulate scan steps
        const SCAN_STEPS = [
            { message: 'Target confirmed. Initializing scanners...', delay: 1000 },
            { message: 'Checking for open ports (Nmap)...', delay: 2000 },
            { message: 'Analyzing web server configuration...', delay: 1500 },
            { message: 'Scanning for SQL injection vectors...', delay: 3000 },
            { message: 'Probing for Cross-Site Scripting (XSS)...', delay: 2500 },
            { message: 'Checking for insecure headers...', delay: 1000 },
            { message: 'Analyzing robots.txt and sitemap.xml...', delay: 1000 },
            { message: 'Compiling results...', delay: 1500 },
        ];
        
        for (const step of SCAN_STEPS) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        await updateScanStatus(newScan.id, 'Completed');
        
        router.push(`/scan/${newScan.id}`);

    } catch (err) {
        setError('Failed to start scan.');
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
            <Button type="submit" className="w-full sm:w-auto" disabled={isScanning}>
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
                <Card className="h-48 bg-muted/50 font-code">
                    <CardContent className="p-4">
                        <div className="h-full overflow-y-auto text-sm">
                            {logs.map((log, index) => (
                                <p key={index} className="animate-in fade-in">{`> ${log}`}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
