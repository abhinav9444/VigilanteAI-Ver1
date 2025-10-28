
'use client';

import { ScanForm } from '@/components/dashboard/scan-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Scan } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const scansQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'scans'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [user, firestore]);

  const { data: recentScans, isLoading } = useCollection<Scan>(scansQuery);
  
  const formatDate = (timestamp: Timestamp | string | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') return new Date(timestamp).toLocaleDateString();
    return timestamp.toDate().toLocaleDateString();
  };


  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="border-amber-500/50 text-amber-700 dark:text-yellow-500 dark:border-yellow-500/50 [&>svg]:text-amber-700 dark:[&>svg]:text-yellow-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
           VigilanteAI is for educational and authorized cybersecurity testing only. Do not scan systems without permission.
          </AlertDescription>
      </Alert>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ScanForm />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>
                  A summary of your most recent scans.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href="/history">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                   <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentScans && recentScans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentScans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-medium truncate max-w-32 sm:max-w-48">
                        {scan.url}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
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
                      <TableCell className="hidden md:table-cell text-right">
                        {formatDate(scan.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link href={`/scan/${scan.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                  No recent scans found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
