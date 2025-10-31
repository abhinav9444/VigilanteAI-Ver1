
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ScanForm } from './scan-form';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { assessVulnerability } from '@/ai/flows/assess-vulnerability';
import { summarizeScanResults } from '@/ai/flows/summarize-scan-results';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import React from 'react';

// --- Mocks ---
jest.mock('@/firebase', () => ({
  useUser: jest.fn(),
  useFirestore: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));
jest.mock('@/ai/flows/assess-vulnerability', () => ({
  assessVulnerability: jest.fn(),
}));
jest.mock('@/ai/flows/summarize-scan-results', () => ({
  summarizeScanResults: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/ui/checkbox', () => {
  const React = require('react');
  return {
    Checkbox: React.forwardRef(({ onCheckedChange, ...props }: { onCheckedChange: (checked: boolean) => void }, ref: React.Ref<HTMLInputElement>) => (
      <input type="checkbox" ref={ref} onChange={(e) => onCheckedChange(e.target.checked)} {...props} />
    )),
  };
});
// --- End Mocks ---

describe('ScanForm', () => {
  const mockRouterPush = jest.fn();
  const mockUser = { uid: 'test-user' } as User;

  // Use fake timers to control setInterval and setTimeout
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // Reset mocks before each test
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useFirestore as jest.Mock).mockReturnValue({});
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (addDoc as jest.Mock).mockResolvedValue({ id: 'test-scan-id' });
    (summarizeScanResults as jest.Mock).mockResolvedValue({ summary: '[]' });
    (assessVulnerability as jest.Mock).mockResolvedValue({});
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  it('should render the form correctly', () => {
    render(<ScanForm />);
    expect(screen.getByLabelText('Website URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Scan/i })).toBeInTheDocument();
  });

  it.skip('should show an error if URL is missing', async () => {
    render(<ScanForm />);
    fireEvent.click(screen.getByLabelText(/I have authorization/i));
    fireEvent.click(screen.getByRole('button', { name: /Start Scan/i }));
    // Use findByText to wait for the error message
    expect(await screen.findByText('URL is required')).toBeInTheDocument();
  });

  it.skip('should show an error if consent is not given', async () => {
    render(<ScanForm />);
    fireEvent.change(screen.getByLabelText('Website URL'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Scan/i }));
    // Use findByText to wait for the error message
    expect(await screen.findByText('You must agree to the terms before starting a scan.')).toBeInTheDocument();
  });

  it.skip('should start the scan process on valid submission', async () => {
    render(<ScanForm />);

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Website URL'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByLabelText(/I have authorization/i));
    fireEvent.click(screen.getByRole('button', { name: /Start Scan/i }));

    // Check for initial scanning UI
    expect(screen.getByRole('button', { name: /Scanning.../i })).toBeInTheDocument();

    // Use act to flush all pending timers and microtasks
    await act(async () => {
      // This will execute all setIntervals and setTimeouts
      jest.runAllTimers();
      // Allow promises inside handleSubmit to resolve
      await Promise.resolve();
    });

    // Final check for mock calls
    await waitFor(() => {
      expect(summarizeScanResults).toHaveBeenCalledWith({ targetUrl: 'https://example.com' });
      expect(mockRouterPush).toHaveBeenCalledWith('/scan/test-scan-id');
    });
  });
});
