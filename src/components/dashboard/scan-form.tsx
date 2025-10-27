'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { startScan, ScanState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useRef } from 'react';

const initialState: ScanState = {
  scanId: null,
  url: null,
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
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
  );
}

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
  const [state, formAction] = useFormState(startScan, initialState);
  const { pending } = useFormStatus();
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (pending) {
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
  }, [pending]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>New Scan</CardTitle>
        <CardDescription>
          Enter a URL to start a new vulnerability scan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="url"
              name="url"
              placeholder="https://example.com"
              required
              disabled={pending}
              className="flex-grow"
            />
            <SubmitButton />
            </div>
          </div>
          {state.error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{state.error}</p>
            </div>
          )}
        </form>
        {pending && (
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
