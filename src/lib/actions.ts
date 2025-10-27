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

  try {
    const newScan = await createScan(url);
    
    // This is a simplified simulation. In a real app, you'd use a background job queue.
    await updateScanStatus(newScan.id, 'Scanning');
    revalidatePath('/dashboard');
    revalidatePath('/history');

    // Simulate the scan steps
    for (const step of SCAN_STEPS) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    await updateScanStatus(newScan.id, 'Completed');
    revalidatePath('/history');
    
  } catch (error) {
    console.error(error);
    return { ...prevState, status: 'error', error: 'Failed to start scan.' };
  }
  
  // This is not ideal for server actions, but for simulation it works.
  // In a real app, the client would poll for status and redirect.
  // We are redirecting from the server action upon completion of the long-running task.
  const latestScan = await createScan(url); // We re-create it just to get the ID back to the client for the redirect. It's a hack for this simulation.
  redirect(`/scan/${latestScan.id}`);
}
