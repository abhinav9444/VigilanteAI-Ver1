import { notFound } from 'next/navigation';
import { getScanById } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  ShieldCheck,
  Clock,
  Download,
} from 'lucide-react';
import { ScanSummary } from '@/components/scan/scan-summary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VulnerabilityDetails } from '@/components/scan/vulnerability-details';
import { AiAssistant } from '@/components/scan/ai-assistant';
import { Button } from '@/components/ui/button';
import { Vulnerability } from '@/lib/definitions';
import { Separator } from '@/components/ui/separator';

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight truncate max-w-xl">
            Scan Report for {scan.url}
          </h1>
          <p className="text-muted-foreground">
            Generated on {new Date(scan.completedAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
      </div>
      
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
    </div>
  );
}
