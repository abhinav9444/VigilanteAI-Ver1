'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { File } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Scan } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';


export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const scansQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'scans'),
        orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: scans, isLoading } = useCollection<Scan>(scansQuery);
  
  const formatDate = (timestamp: Timestamp | string | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') return new Date(timestamp).toLocaleString();
    return timestamp.toDate().toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan History</CardTitle>
        <CardDescription>
          A complete log of all vulnerability scans performed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        ) : scans && scans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium truncate max-w-60">
                    {scan.url}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        scan.status === 'Completed'
                          ? 'default'
                          : scan.status === 'Failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={cn(
                        'capitalize',
                        scan.status === 'Completed' &&
                          'bg-green-600/20 text-green-700 border-green-600/20 hover:bg-green-600/30 dark:bg-green-400/10 dark:text-green-400 dark:border-green-400/20'
                      )}
                    >
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{scan.vulnerabilities?.length || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(scan.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/scan/${scan.id}`}>View Report</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <File className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-2xl font-bold tracking-tight">
              No scans yet
            </h3>
            <p className="text-muted-foreground">
              Start your first scan to see the results here.
            </p>
            <Button asChild>
              <Link href="/dashboard">Start New Scan</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
