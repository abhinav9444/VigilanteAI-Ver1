import { notFound } from 'next/navigation';
import { getScanById } from '@/lib/mock-data';
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

export default async function ScanPage({ params }: { params: { id: string } }) {
  const scan = await getScanById(params.id);

  if (!scan) {
    notFound();
  }

  const criticalCount = scan.vulnerabilities.filter(
    (v) => v.severity === 'Critical'
  ).length;
  const highCount = scan.vulnerabilities.filter(
    (v) => v.severity === 'High'
  ).length;
  const mediumCount = scan.vulnerabilities.filter(
    (v) => v.severity === 'Medium'
  ).length;
  const lowCount = scan.vulnerabilities.filter(
    (v) => v.severity === 'Low'
  ).length;

  const severityCounts = {
    Critical: criticalCount,
    High: highCount,
    Medium: mediumCount,
    Low: lowCount,
  };

  const totalVulnerabilities = scan.vulnerabilities.length;

  return (
    <div id="report-content" className="space-y-6">
      <ReportHeader scan={scan} />
      
      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVulnerabilities}</div>
          </CardContent>
        </Card>
        {Object.entries(severityCounts).map(([severity, count]) => (
           <Card key={severity}>
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
        <TabsList>
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
              {scan.vulnerabilities.length > 0 ? (
                <VulnerabilityDetails
                  vulnerabilities={scan.vulnerabilities}
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
