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
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Scan } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="lg:col-span-4">
        <ScanForm />
      </div>
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                A summary of your most recent scans.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
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
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium truncate max-w-48">
                      {scan.url}
                    </TableCell>
                    <TableCell className="text-center">
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
                    <TableCell className="text-right">
                      {new Date(scan.createdAt).toLocaleDateString()}
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
  );
}
