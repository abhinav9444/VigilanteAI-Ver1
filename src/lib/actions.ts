'use server';

import { createScan, updateScanStatus } from './mock-data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const SCAN_STEPS = [
  { message: 'Target confirmed. Initializing scanners...', delay: 1000 },
  { message: 'Checking for open ports (Nmap)...', delay: 2000 },
  { message: 'Analyzing web server configuration...', delay: 1500 },
  { message: 'Scanning for SQL injection vectors...', delay: 3000 },
  { message: 'Probing for Cross-Site Scripting (XSS)...', delay: 2500 },
  { message: 'Checking for insecure headers...', delay: 1000 },
  { message: 'Analyzing robots.txt and sitemap.xml...', delay: 1000 },
  { message: 'Compiling results...', delay: 1500 },
];

export type ScanState = {
  scanId: string | null;
  status: 'idle' | 'scanning' | 'completed' | 'error';
  url: string | null;
  message?: string;
  error?: string;
};

export async function startScan(
  prevState: ScanState,
  formData: FormData
): Promise<ScanState> {
  const url = formData.get('url') as string;
  if (!url) {
    return { ...prevState, error: 'URL is required' };
  }

  let scanId: string;

  try {
    // 1. Create the scan and get its ID
    const newScan = await createScan(url);
    scanId = newScan.id;
    
    // 2. This is a simplified simulation. In a real app, you'd use a background job queue.
    await updateScanStatus(newScan.id, 'Scanning');
    
    // 3. Revalidate paths so the UI can show the "Scanning" status
    revalidatePath('/dashboard');
    revalidatePath('/history');

    // 4. Simulate the scan steps
    for (const step of SCAN_STEPS) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    // 5. Mark the scan as complete
    await updateScanStatus(newScan.id, 'Completed');
    
    // 6. Revalidate the history page again with the final status
    revalidatePath('/history');
    
  } catch (error) {
    console.error(error);
    return { ...prevState, status: 'error', error: 'Failed to start scan.' };
  }
  
  // 7. Redirect to the completed scan's page.
  // This happens after all the steps above are finished.
  redirect(`/scan/${scanId}`);
}
