
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Globe,
  Server,
  ShieldQuestion,
  BookUser,
  Calendar,
  Contact,
  Building
} from 'lucide-react';
import { enrichScanWithOsint } from '@/ai/flows/osint-enrichment';
import { OsintEnrichmentOutput } from '@/lib/definitions';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

function InfoRow({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        {value && <p className="text-sm text-muted-foreground">{value}</p>}
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}

function OsintSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className='space-y-2'>
                    <Skeleton className="h-20 w-full" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export function OsintEnrichment({ url }: { url: string }) {
  const [data, setData] = useState<OsintEnrichmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await enrichScanWithOsint({ url });
        setData(result);
      } catch (err) {
        console.error('Failed to fetch OSINT data:', err);
        setError('Could not load threat intelligence data.');
      }
      setIsLoading(false);
    }
    fetchData();
  }, [url]);

  if (isLoading) {
    return <OsintSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h3 className="text-2xl font-bold tracking-tight">An Error Occurred</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const vtStats = data?.virusTotal?.last_analysis_stats;
  const totalEngines = vtStats ? Object.values(vtStats).reduce((a, b) => a + b, 0) : 0;
  const maliciousCount = vtStats?.malicious || 0;
  const lastModificationDate = data?.virusTotal?.last_modification_date
    ? new Date(data.virusTotal.last_modification_date * 1000).toLocaleDateString()
    : 'N/A';

  const whoisRecord = data?.whois;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldQuestion /> Threat Intelligence
          </CardTitle>
          <CardDescription>
            Data aggregated from third-party security vendors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {vtStats ? (
                <>
                <InfoRow icon={maliciousCount > 0 ? AlertTriangle : CheckCircle} label='VirusTotal Reputation'>
                    <div className='flex items-center gap-2'>
                    <span className={maliciousCount > 0 ? 'text-destructive' : 'text-green-500'}>
                        {maliciousCount} / {totalEngines} engines flagged this domain as malicious.
                    </span>
                    </div>
                </InfoRow>
                <Separator />
                 <InfoRow icon={Globe} label="Reputation Score" value={data.virusTotal?.reputation ?? 'N/A'} />
                 <Separator />
                <InfoRow icon={FileText} label="Last Modified" value={lastModificationDate} />
                </>
            ) : (
                <p className='text-sm text-muted-foreground'>No VirusTotal data available.</p>
            )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle className='flex items-center gap-2'><BookUser /> WHOIS Information</CardTitle>
            <CardDescription>Domain registration and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {whoisRecord ? (
                <>
                 <InfoRow icon={Server} label="Registrar" value={whoisRecord.registrarName || 'N/A'} />
                 <Separator />
                 <InfoRow icon={Calendar} label="Creation Date" value={whoisRecord.createdDate ? new Date(whoisRecord.createdDate).toLocaleDateString() : 'N/A'} />
                 <Separator />
                 <InfoRow icon={Calendar} label="Expiration Date" value={whoisRecord.expiresDate ? new Date(whoisRecord.expiresDate).toLocaleDateString() : 'N/A'} />
                 <Separator />
                 <InfoRow icon={Building} label="Registrant" value={whoisRecord.registrant?.organization || whoisRecord.registrant?.name || 'N/A'} />
                </>
            ): (
                 <p className='text-sm text-muted-foreground'>No WHOIS data available.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
