import { ScanForm } from '@/components/dashboard/scan-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllScans } from '@/lib/mock-data';
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
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const recentScans = (await getAllScans()).slice(0, 5);

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
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/scan/${scan.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
