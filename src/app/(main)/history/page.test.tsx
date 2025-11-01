
import { render, screen } from '@testing-library/react';
import HistoryPage from './page';
import { useCollection, useFirestore, useUser } from '@/firebase';

// Mock dependencies from '@/firebase'
jest.mock('@/firebase', () => ({
  useCollection: jest.fn(),
  useFirestore: jest.fn(),
  useUser: jest.fn(),
  // useMemoFirebase is mocked to just execute the callback immediately
  useMemoFirebase: jest.fn((callback) => callback()),
}));

// Mock dependencies from 'firebase/firestore' to prevent actual SDK calls
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    fromDate: (date) => date,
  },
}));

// Mock the Skeleton component for simplicity
jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton-loader"></div>,
}));

const mockScans = [
  { id: '1', url: 'https://example.com', status: 'Completed', createdAt: { toDate: () => new Date() }, vulnerabilities: [] },
  { id: '2', url: 'https://test.com', status: 'Scanning', createdAt: { toDate: () => new Date() }, vulnerabilities: [] },
];

describe('HistoryPage', () => {
  beforeEach(() => {
    // Reset mocks and provide default mock implementations for each test
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: { uid: 'test-uid' } });
    (useFirestore as jest.Mock).mockReturnValue({}); // This can be an empty object as `collection` is now mocked
  });

  it('should render the loading state', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: true, data: null });
    render(<HistoryPage />);
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(5);
  });

  it('should render the history table with data', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: false, data: mockScans });
    render(<HistoryPage />);
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  it('should render the empty state when there are no scans', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: false, data: [] });
    render(<HistoryPage />);
    expect(screen.getByText('No scans yet')).toBeInTheDocument();
  });
});
