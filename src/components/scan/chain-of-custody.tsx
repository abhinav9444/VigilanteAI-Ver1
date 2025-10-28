'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Fingerprint, User, Globe, Clock } from 'lucide-react';
import type { ChainOfCustody } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="break-all text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ChainOfCustodyInfo({ coc }: { coc: ChainOfCustody }) {
  const formatDate = (timestamp: Timestamp | string | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') return new Date(timestamp).toLocaleString();
    return timestamp.toDate().toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint /> Chain of Custody
        </CardTitle>
        <CardDescription>
          This log provides traceability for the scan, suitable for forensic
          audits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={User} label="User ID" value={coc.userId} />
        <Separator />
        <InfoRow icon={Clock} label="Timestamp" value={formatDate(coc.timestamp)} />
        <Separator />
        <InfoRow icon={Globe} label="User IP" value={coc.userIp} />
        <Separator />
        <InfoRow
          icon={Fingerprint}
          label="User Agent"
          value={coc.userAgent}
        />
      </CardContent>
    </Card>
  );
}
