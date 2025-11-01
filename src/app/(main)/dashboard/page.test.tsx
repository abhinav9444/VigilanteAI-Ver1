
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';

// Mock child components and hooks to isolate DashboardPage
jest.mock('@/firebase', () => ({
  useUser: jest.fn(),
  useFirestore: jest.fn(),
  useCollection: jest.fn(),
  useMemoFirebase: jest.fn(() => null), // Return null to prevent query creation
}));

jest.mock('lucide-react', () => ({
  ArrowUpRight: () => <div>Arrow Icon</div>,
  AlertTriangle: () => <div>Alert Icon</div>,
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton-loader"></div>,
}));

// Mock the ScanForm component to prevent router errors
jest.mock('@/components/dashboard/scan-form', () => ({
  ScanForm: () => <div data-testid="scan-form-mock"></div>,
}));


describe('DashboardPage', () => {
  const mockUser = { uid: '123' };
  const mockScans = [
    { id: '1', url: 'https://example.com', status: 'Completed', createdAt: { toDate: () => new Date() } },
    { id: '2', url: 'https://test.com', status: 'Scanning', createdAt: { toDate: () => new Date() } },
  ];

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useFirestore as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: true, data: null });
    render(<DashboardPage />);
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(3);
    expect(screen.getByTestId('scan-form-mock')).toBeInTheDocument();
  });

  it('should render the recent scans table with data', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: false, data: mockScans });
    render(<DashboardPage />);
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
    expect(screen.getByTestId('scan-form-mock')).toBeInTheDocument();
  });

  it('should render the empty state when there are no scans', () => {
    (useCollection as jest.Mock).mockReturnValue({ isLoading: false, data: [] });
    render(<DashboardPage />);
    expect(screen.getByText('No recent scans found.')).toBeInTheDocument();
    expect(screen.getByTestId('scan-form-mock')).toBeInTheDocument();
  });
});
