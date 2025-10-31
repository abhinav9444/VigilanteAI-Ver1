
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './page';
import { useAuth, useFirestore, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/firebase', () => ({
  useAuth: jest.fn(),
  useFirestore: jest.fn(),
  useUser: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupPage', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({});
    (useFirestore as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: false });
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: {} });
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: {
        providerData: [{ providerId: 'google.com' }],
      },
    });
    jest.clearAllMocks();
  });

  it('should render the signup form', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should handle email/password signup', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password');
      expect(updateProfile).toHaveBeenCalledWith({}, { displayName: 'Test User' });
      expect(setDoc).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle Google signup', async () => {
    render(<SignupPage />);
    fireEvent.click(screen.getByRole('button', { name: /Sign up with Google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display an error message on failed signup', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Email already in use'));
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
  });
});
