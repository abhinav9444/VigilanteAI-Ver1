'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Scan } from '@/lib/definitions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Skeleton } from '../ui/skeleton';
import { VigilanteAiLogo } from '../logo';
import { summarizeScanResults } from '@/ai/flows/summarize-scan-results';

// Extend jsPDF with autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

type UserProfile = {
  name?: string;
  reportHeader?: string;
};

// Helper function for adding footers to PDF
const addFooters = (pdf: jsPDF) => {
    const pageCount = pdf.getNumberOfPages();
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
            `© ${new Date().getFullYear()} VigilanteAI. All rights reserved.`,
            pdf.internal.pageSize.width / 2,
            pdf.internal.pageSize.height - 10,
            { align: 'center' }
        );
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pdf.internal.pageSize.width - 20,
            pdf.internal.pageSize.height - 10
        );
    }
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
    if (!profile) return;

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;

        // --- Title Page ---
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.text('VigilanteAI', pageWidth / 2, 40, { align: 'center' });

        pdf.setFontSize(16);
        pdf.text('Vulnerability Scan Report', pageWidth / 2, 50, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Target URL: ${scan.url}`, pageWidth / 2, 70, { align: 'center' });
        pdf.text(`Date: ${new Date(scan.completedAt!).toLocaleString()}`, pageWidth / 2, 80, { align: 'center' });
        
        pdf.setLineWidth(0.5);
        pdf.line(margin, 100, pageWidth - margin, 100);

        pdf.setFont('helvetica', 'bold');
        pdf.text('Report Prepared For:', pageWidth / 2, 120, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.text(profile.name || 'N/A', pageWidth / 2, 130, { align: 'center' });
        if(profile.reportHeader) {
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(profile.reportHeader, pageWidth / 2, 135, { align: 'center' });
        }

        // --- Summary Page ---
        pdf.addPage();
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('1. Executive Summary', margin, 30);
        
        // Fetch AI summary
        const summaryResult = await summarizeScanResults({ scanOutput: JSON.stringify(scan.vulnerabilities) });
        const summaryText = summaryResult.summary;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        const splitSummary = pdf.splitTextToSize(summaryText, pageWidth - margin * 2);
        pdf.text(splitSummary, margin, 45);

        // --- Vulnerabilities Section ---
        pdf.addPage();
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('2. Vulnerability Details', margin, 30);

        const tableColumn = ["Severity", "Vulnerability", "CWE"];
        const tableRows: (string[])[] = [];

        scan.vulnerabilities.forEach(vuln => {
            const vulnData = [
                vuln.severity,
                vuln.name,
                vuln.cwe,
            ];
            tableRows.push(vulnData);
        });

        pdf.autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [30, 144, 255] } // Saturated blue
        });

        // --- Detailed Vulnerability Pages ---
        scan.vulnerabilities.forEach((vuln, index) => {
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${index + 1}. ${vuln.name}`, margin, 30);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Severity:', margin, 45);
            pdf.setFont('helvetica', 'normal');
            pdf.text(vuln.severity, margin + 25, 45);

            pdf.setFont('helvetica', 'bold');
            pdf.text('Description:', margin, 55);
            pdf.setFont('helvetica', 'normal');
            const splitDescription = pdf.splitTextToSize(vuln.description, pageWidth - margin * 2);
            pdf.text(splitDescription, margin, 62);
            
            let currentY = 62 + (splitDescription.length * 5); // Estimate new Y

            pdf.setFont('helvetica', 'bold');
            pdf.text('Remediation:', margin, currentY + 10);
            pdf.setFont('helvetica', 'normal');
            const splitRemediation = pdf.splitTextToSize(vuln.remediation, pageWidth - margin * 2);
            pdf.text(splitRemediation, margin, currentY + 17);
        });


        // Add footers to all pages
        addFooters(pdf);

        pdf.save(`VigilanteAI-Report-${scan.url.replace(/https?:\/\//, '')}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setIsLoading(false);
    }
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
