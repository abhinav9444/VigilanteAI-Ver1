
'use client';

import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { ScanSummary } from '@/components/scan/scan-summary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VulnerabilityDetails } from '@/components/scan/vulnerability-details';
import { AiAssistant } from '@/components/scan/ai-assistant';
import { Separator } from '@/components/ui/separator';
import { ReportHeader } from '@/components/scan/report-header';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Scan } from '@/lib/definitions';
import ScanLoading from './loading';
import { cn } from '@/lib/utils';

export default function ScanPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const scanRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid, 'scans', params.id);
  }, [user, firestore, params.id]);

  const { data: scan, isLoading, error } = useDoc<Scan>(scanRef);

  if (isLoading || (!scan && !error)) {
    return <ScanLoading />;
  }

  if (error || !scan) {
    notFound();
  }

  // Ensure vulnerabilities is an array
  const vulnerabilities = scan.vulnerabilities || [];

  const criticalCount = vulnerabilities.filter(
    (v) => (v.assessedSeverity || v.severity) === 'Critical'
  ).length;
  const highCount = vulnerabilities.filter(
    (v) => (v.assessedSeverity || v.severity) === 'High'
  ).length;
  const mediumCount = vulnerabilities.filter(
    (v) => (v.assessedSeverity || v.severity) === 'Medium'
  ).length;
  const lowCount = vulnerabilities.filter(
    (v) => (v.assessedSeverity || v.severity) === 'Low'
  ).length;

  const severityCounts = {
    Critical: criticalCount,
    High: highCount,
    Medium: mediumCount,
    Low: lowCount,
  };

  const totalVulnerabilities = vulnerabilities.length;

  const severityStyles: { [key: string]: string } = {
    Critical: 'hover:border-red-500/50 hover:bg-red-500/5',
    High: 'hover:border-orange-500/50 hover:bg-orange-500/5',
    Medium: 'hover:border-yellow-500/50 hover:bg-yellow-500/5',
    Low: 'hover:border-blue-500/50 hover:bg-blue-500/5',
  };


  return (
    <div id="report-content" className="space-y-6">
      <ReportHeader scan={scan} />
      
      <Separator />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card className="col-span-2 md:col-span-1 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVulnerabilities}</div>
          </CardContent>
        </Card>
        {Object.entries(severityCounts).map(([severity, count]) => (
           <Card key={severity} className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", severityStyles[severity])}>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{severity}</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{count}</div>
           </CardContent>
         </Card>
        ))}
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Vulnerability Details</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="space-y-4">
          <ScanSummary scan={scan} />
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Details</CardTitle>
              <CardDescription>
                A detailed breakdown of all vulnerabilities found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vulnerabilities.length > 0 ? (
                <VulnerabilityDetails
                  vulnerabilities={vulnerabilities}
                  scanOutput={JSON.stringify(scan, null, 2)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <ShieldCheck className="h-16 w-16 text-green-500" />
                    <h3 className="text-2xl font-bold tracking-tight">
                        No Vulnerabilities Found
                    </h3>
                    <p className="text-muted-foreground">
                        Congratulations! Your website appears to be secure based on this scan.
                    </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assistant">
          <AiAssistant scanDetails={JSON.stringify(scan, null, 2)} />
        </TabsContent>
      </Tabs>
      <footer className="py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} VigilanteAI. All rights reserved.
      </footer>
    </div>
  );
}
