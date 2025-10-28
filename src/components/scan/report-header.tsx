
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
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

const formatDate = (timestamp: Timestamp | string | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') return new Date(timestamp).toLocaleString();
    return timestamp.toDate().toLocaleString();
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
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let currentY = 0;

        // --- Title Page ---
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.text('VigilanteAI', pageWidth / 2, 40, { align: 'center' });

        pdf.setFontSize(16);
        pdf.text('Vulnerability Scan Report', pageWidth / 2, 50, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Target URL: ${scan.url}`, pageWidth / 2, 70, { align: 'center' });
        pdf.text(`Date: ${formatDate(scan.completedAt)}`, pageWidth / 2, 80, { align: 'center' });
        
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
        if (scan.vulnerabilities.length > 0) {
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
                currentY = 62;
                pdf.text(splitDescription, margin, currentY);
                currentY += (splitDescription.length * 5); // Estimate new Y

                pdf.setFont('helvetica', 'bold');
                pdf.text('Remediation:', margin, currentY + 10);
                pdf.setFont('helvetica', 'normal');
                const splitRemediation = pdf.splitTextToSize(vuln.remediation, pageWidth - margin * 2);
                pdf.text(splitRemediation, margin, currentY + 17);
            });
        }
        
        // --- Legal Disclaimer Page ---
        pdf.addPage();
        currentY = 30;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('LEGAL DISCLAIMER & NOTICE', margin, currentY);
        currentY += 15;

        const addSection = (title: string, text: string | string[], isBold = false) => {
            if (currentY > pageHeight - margin * 2) {
                pdf.addPage();
                currentY = 30;
            }
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text(title, margin, currentY);
            currentY += 7;

            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
            pdf.setFontSize(10);
            const splitText = pdf.splitTextToSize(text, pageWidth - margin * 2);
            pdf.text(splitText, margin, currentY);
            currentY += (splitText.length * 5) + 5;
        }

        const addList = (items: string[], isFirstItemBold = false) => {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            items.forEach((item, index) => {
                if (currentY > pageHeight - margin * 2) {
                    pdf.addPage();
                    currentY = 30;
                }
                if (index === 1 && isFirstItemBold) { // Make the second item bold
                    pdf.setFont('helvetica', 'bold');
                }
                const splitItem = pdf.splitTextToSize(item, pageWidth - margin * 2 - 5);
                pdf.text(`•`, margin, currentY);
                pdf.text(splitItem, margin + 5, currentY);
                currentY += (splitItem.length * 5) + 2;
                if (index === 1 && isFirstItemBold) {
                    pdf.setFont('helvetica', 'normal'); // Reset font
                }
            });
            currentY += 5;
        }

        addSection('Disclaimer', 'VigilanteAI is a cybersecurity research and educational tool designed to assist users in identifying potential vulnerabilities on systems they own or have explicit authorization to test. It is intended solely for lawful and ethical use in compliance with applicable cybersecurity and data protection laws.');

        addSection('Notice of Authorized Use', 'By using VigilanteAI, you acknowledge and agree that:');
        currentY -= 5;
        addList([
            'You will only scan systems, websites, or networks that you personally own or for which you have explicit, written consent from the owner.',
            'You understand that unauthorized vulnerability scanning, penetration testing, or exploitation of third-party systems may violate laws such as the Indian IT Act 2000, the Computer Misuse Act, or other regional cybersecurity regulations.',
            'The developers, contributors, and maintainers of VigilanteAI assume no liability for misuse, damages, or legal consequences arising from unauthorized or unethical use of this software.'
        ], true);
        
        pdf.setFontSize(10);
        const purposeText = 'This tool should be used for defensive and educational cybersecurity purposes only, such as:';
        const splitPurpose = pdf.splitTextToSize(purposeText, pageWidth - margin * 2);
        pdf.text(splitPurpose, margin, currentY);
        currentY += (splitPurpose.length * 5) + 5;
        addList(['Security auditing of authorized assets', 'Academic research and learning', 'Internal organization security assessments']);

        addSection('Warning', 'Engaging in unauthorized scanning or data probing activities on systems without permission is illegal and may lead to civil or criminal penalties. Always obtain proper authorization before running any scan.');
        addSection('Ethical Usage', 'VigilanteAI supports responsible disclosure practices. If vulnerabilities are discovered, users are encouraged to notify affected parties responsibly and in good faith.');

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
          Generated on {formatDate(scan.completedAt)}
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

    