
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProfilePage from './page';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// Mock the firebase hooks and functions
jest.mock('@/firebase', () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
  useFirestore: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  updateProfile: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('@/firebase/non-blocking-updates', () => ({
  setDocumentNonBlocking: jest.fn(),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

// Mock UI components
jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton"></div>,
}));

describe('ProfilePage', () => {
  const mockUser = {
    uid: '123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/avatar.png',
  };
  const mockFirestore = {};
  const mockAuth = { currentUser: mockUser };
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: true });
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    (useFirestore as jest.Mock).mockReturnValue(mockFirestore);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ reportHeader: 'Security Analyst' }),
    });
    (setDocumentNonBlocking as jest.Mock).mockResolvedValue(undefined);
    (updateProfile as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders loading skeletons when user data is loading', () => {
    render(<ProfilePage />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders a message to log in when there is no user', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: false });
    render(<ProfilePage />);
    expect(screen.getByText('Please log in to view your profile.')).toBeInTheDocument();
  });

  it('fetches and displays user data when logged in', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isUserLoading: false });
    render(<ProfilePage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Test User');
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Report Header')).toHaveValue('Security Analyst');
    });
  });

  it('handles profile updates on form submission', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isUserLoading: false });
    render(<ProfilePage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated User' } });
    fireEvent.change(screen.getByLabelText('Report Header'), { target: { value: 'Lead Analyst' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(mockAuth.currentUser, { displayName: 'Updated User' });
      expect(setDocumentNonBlocking).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Profile Update In Progress',
        description: 'Your changes are being saved.',
      });
    });
  });

  it('calls the update functions on save', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isUserLoading: false });
    render(<ProfilePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    });

    const button = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated User' } });
    fireEvent.click(button);

    // Check that the update functions were called
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();
      expect(setDocumentNonBlocking).toHaveBeenCalled();
    });
  });
});
