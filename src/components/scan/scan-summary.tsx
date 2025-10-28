'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Vulnerability } from '@/lib/definitions';
import { summarizeScanResults } from '@/ai/flows/summarize-scan-results';
import { useEffect, useState, useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type ScanSummaryProps = {
  scan: Scan;
};

const chartConfig = {
  vulnerabilities: {
    label: 'Vulnerabilities',
  },
  Critical: {
    label: 'Critical',
    color: 'hsl(var(--chart-1))',
    icon: ShieldAlert,
  },
  High: {
    label: 'High',
    color: 'hsl(var(--chart-2))',
    icon: ShieldAlert,
  },
  Medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-3))',
    icon: ShieldHalf,
  },
  Low: {
    label: 'Low',
    color: 'hsl(var(--chart-4))',
    icon: ShieldCheck,
  },
} satisfies ChartConfig;

export function ScanSummary({ scan }: ScanSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const vulnerabilities = scan.vulnerabilities || [];

  useEffect(() => {
    async function getSummary() {
      if (vulnerabilities.length > 0) {
        setIsLoading(true);
        try {
          const scanOutput = JSON.stringify(vulnerabilities);
          const result = await summarizeScanResults({ scanOutput });
          setSummary(result.summary);
        } catch (error) {
          console.error('Failed to get AI summary:', error);
          setSummary('Could not load AI-powered summary.');
        }
        setIsLoading(false);
      } else {
        setSummary('No vulnerabilities found in this scan.');
        setIsLoading(false);
      }
    }
    getSummary();
  }, [vulnerabilities]);

  const severityCounts = useMemo(() => {
    return vulnerabilities.reduce((acc, vuln) => {
      const severity = vuln.assessedSeverity || vuln.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<Vulnerability['severity'], number>);
  }, [vulnerabilities]);

  const chartData = Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
    fill: `var(--color-${name})`,
  })).sort((a, b) => { // Consistent order
    const order = ['Critical', 'High', 'Medium', 'Low'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>AI-Powered Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{summary}</p>
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Severity Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {vulnerabilities.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <ShieldCheck className="w-12 h-12 mb-4 text-green-500" />
                <p className="font-semibold">No Vulnerabilities Found</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
