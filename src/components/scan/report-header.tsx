'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Scan } from '@/lib/definitions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { Skeleton } from '../ui/skeleton';
import { VigilanteAiLogo } from '../logo';

type UserProfile = {
  name?: string;
  reportHeader?: string;
};

export function ReportHeader({ scan }: { scan: Scan }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfile({
            name: user.displayName || `${userData.firstName} ${userData.lastName}`,
            reportHeader: userData.reportHeader,
          });
        } else {
            setProfile({ name: user.displayName || 'User' });
        }
      }
    }
    fetchUserProfile();
  }, [user, firestore]);

  const handleExportPdf = async () => {
    setIsLoading(true);
    const reportElement = document.getElementById('report-content');
    if (!reportElement) {
        setIsLoading(false);
        return;
    };

    const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const height = pdfWidth / ratio;
    
    let position = 0;
    let pageHeight = pdf.internal.pageSize.height;
    let remainingHeight = imgHeight * pdfWidth / imgWidth;

    while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, height);
        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
            pdf.addPage();
            position = -pdfHeight;
        }
    }

    pdf.save(`VigilanteAI-Report-${scan.url.replace(/https?:\/\//, '')}.pdf`);
    setIsLoading(false);
  };

  const handleExportCsv = () => {
    setIsLoading(true);
    const csvData = scan.vulnerabilities.map(v => ({
        ID: v.id,
        Name: v.name,
        Severity: v.severity,
        Description: v.description,
        CWE: v.cwe,
        Evidence: v.evidence,
        Remediation: v.remediation,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `VigilanteAI-Report-${scan.url.replace(/https?:\/\//, '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="flex-grow">
        <div className='flex items-center gap-2 mb-2 text-sm text-muted-foreground'>
            <VigilanteAiLogo className='h-4 w-4' />
            <span>Vulnerability Scan Report</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight truncate max-w-xl">
          {scan.url}
        </h1>
        <p className="text-muted-foreground mt-1">
          Generated on {new Date(scan.completedAt!).toLocaleString()}
        </p>
         <div className="mt-4">
            {profile ? (
                <>
                    <p className="font-semibold">{profile.name}</p>
                    {profile.reportHeader && <p className="text-muted-foreground">{profile.reportHeader}</p>}
                </>
            ) : (
                <div className='space-y-2'>
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            )}
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <Button variant="outline" onClick={handleExportPdf} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportCsv} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export CSV
        </Button>
      </div>
    </div>
  );
}
