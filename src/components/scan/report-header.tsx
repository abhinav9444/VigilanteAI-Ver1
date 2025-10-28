'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Scan, OsintEnrichmentOutput } from '@/lib/definitions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Skeleton } from '../ui/skeleton';
import { VigilanteAiLogo } from '../logo';
import { getScanSummary } from '@/ai/flows/get-scan-summary';
import { enrichScanWithOsint } from '@/ai/flows/osint-enrichment';
import { generateAttackStory, GenerateAttackStoryOutput } from '@/ai/flows/generate-attack-story';

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
    const pageCount = pdf.internal.pageSize.getHeight() > 840 ? pdf.internal.pages.length - 1 : pdf.internal.pages.length;
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
    if (!profile) {
        setIsLoading(false);
        return;
    }

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        let currentY = 0;

        // --- Fetch all required data ---
        const [summaryResult, osintData, attackStory] = await Promise.all([
            getScanSummary({ scanDetails: JSON.stringify(scan) }),
            enrichScanWithOsint({ url: scan.url }),
            scan.vulnerabilities && scan.vulnerabilities.length > 0
                ? generateAttackStory({ scanDetails: JSON.stringify(scan) })
                : Promise.resolve(null),
        ]);


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

        const addSectionTitle = (title: string, y: number) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            pdf.text(title, margin, y);
            return y + 15;
        }

        // --- Summary Page ---
        pdf.addPage();
        currentY = addSectionTitle('1. Executive Summary', 30);
        
        const summaryText = summaryResult.summary;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        const splitSummary = pdf.splitTextToSize(summaryText, pageWidth - margin * 2);
        pdf.text(splitSummary, margin, currentY);
        currentY += splitSummary.length * 5 + 10;
        
        // --- Attack Path Simulation ---
        if(attackStory && attackStory.attackStory && attackStory.attackStory.length > 0) {
            pdf.addPage();
            currentY = addSectionTitle('2. Attack Path Simulation', 30);
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text("A plausible attack narrative generated by AI based on the findings.", margin, currentY - 10);

            pdf.setFontSize(12);
            attackStory.attackStory.forEach(step => {
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${step.step}. ${step.title}`, margin, currentY);
                currentY += 7;
                pdf.setFont('helvetica', 'normal');
                const splitDesc = pdf.splitTextToSize(step.description, pageWidth - margin * 2 - 5);
                pdf.text(splitDesc, margin + 5, currentY);
                currentY += splitDesc.length * 5 + 5;
            });
        }


        // --- OSINT Section ---
        pdf.addPage();
        currentY = addSectionTitle('3. OSINT Enrichment', 30);
        const addSubSection = (title: string) => {
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text(title, margin, currentY);
            currentY += 8;
        }
        const addInfoRow = (label: string, value: any) => {
             if (currentY > pdf.internal.pageSize.height - 20) {
                pdf.addPage();
                currentY = 30;
            }
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(label, margin, currentY);
            pdf.setFont('helvetica', 'normal');
            const val = value ? String(value) : 'N/A';
            const splitValue = pdf.splitTextToSize(val, pageWidth - margin * 2 - 40);
            pdf.text(splitValue, margin + 40, currentY);
            currentY += (splitValue.length * 5) + 2;
        }
        
        if(osintData.virusTotal) {
            addSubSection('VirusTotal Analysis');
            const stats = osintData.virusTotal.last_analysis_stats;
            const total = stats ? Object.values(stats).reduce((a,b) => a+b, 0) : 0;
            addInfoRow('Reputation:', `${stats.malicious} / ${total} engines flagged as malicious`);
            addInfoRow('Score:', osintData.virusTotal.reputation);
            currentY += 5;
        }
        if(osintData.whois) {
            addSubSection('WHOIS Information');
            addInfoRow('Registrar:', osintData.whois.registrarName);
            addInfoRow('Created On:', osintData.whois.createdDate ? new Date(osintData.whois.createdDate).toLocaleDateString() : 'N/A');
            addInfoRow('Expires On:', osintData.whois.expiresDate ? new Date(osintData.whois.expiresDate).toLocaleDateString() : 'N/A');
            currentY += 5;
        }
        if(osintData.shodan) {
             addSubSection('Shodan Host Lookup');
             addInfoRow('IP Address:', osintData.shodan.ip_str);
             addInfoRow('Organization:', osintData.shodan.org);
             addInfoRow('Open Ports:', osintData.shodan.ports?.join(', '));
             currentY += 5;
        }
        if(osintData.sslmale && osintData.sslmale.length > 0) {
            addSubSection('SSL Certificate Issuances');
             pdf.autoTable({
                startY: currentY,
                head: [['DNS Names', 'Issuer', 'Issued At']],
                body: osintData.sslmale.slice(0, 5).map(c => [
                    c.dns_names.join(', '), 
                    c.issuer.common_name, 
                    new Date(c.created_at).toLocaleDateString()
                ]),
                theme: 'grid',
                headStyles: { fillColor: [220, 220, 220], textColor: 20 },
                didDrawPage: (data) => { currentY = data.cursor?.y || currentY; }
            });
            currentY += 10;
        }


        // --- Vulnerabilities Section ---
        if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
            pdf.addPage();
            currentY = addSectionTitle('4. Vulnerability Details', 30);

            pdf.autoTable({
                startY: currentY,
                head: [["Severity", "Vulnerability", "CWE"]],
                body: scan.vulnerabilities.map(vuln => [
                    vuln.assessedSeverity || vuln.severity,
                    vuln.name,
                    vuln.cwe || 'N/A',
                ]),
                theme: 'striped',
                headStyles: { fillColor: [30, 144, 255] },
                didDrawPage: (data) => { currentY = data.cursor?.y || currentY; }
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
                pdf.text(vuln.assessedSeverity || vuln.severity, margin + 25, 45);

                currentY = 55;
                const addDetailSection = (title: string, text: string) => {
                     if (currentY > pdf.internal.pageSize.height - 40) {
                        pdf.addPage();
                        currentY = 30;
                    }
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(title, margin, currentY);
                    currentY += 7;
                    pdf.setFont('helvetica', 'normal');
                    const splitText = pdf.splitTextToSize(text, pageWidth - margin * 2);
                    pdf.text(splitText, margin, currentY);
                    currentY += (splitText.length * 5) + 5;
                };

                addDetailSection('Description:', vuln.description);
                if (vuln.assessmentJustification) {
                    addDetailSection('AI Assessment:', vuln.assessmentJustification);
                }
                addDetailSection('Remediation:', vuln.remediation);
            });
        }
        
        // --- Chain of Custody Page ---
        if (scan.chainOfCustody) {
            pdf.addPage();
            currentY = addSectionTitle('5. Chain of Custody', 30);
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text("This log provides traceability for the scan, suitable for forensic audits.", margin, currentY - 10);
            
            addInfoRow('User ID:', scan.chainOfCustody.userId);
            addInfoRow('User IP:', scan.chainOfCustody.userIp);
            addInfoRow('User Agent:', scan.chainOfCustody.userAgent);
            addInfoRow('Timestamp:', formatDate(scan.chainOfCustody.timestamp));
        }


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
    if (!scan.vulnerabilities) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    const csvData = scan.vulnerabilities.map(v => ({
        ID: v.id,
        Name: v.name,
        Severity: v.assessedSeverity || v.severity,
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
        <Button variant="outline" onClick={handleExportPdf} disabled={isLoading || !profile}>
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

    
