
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useAuth, useUser } from '@/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/firebase', () => ({
  useAuth: jest.fn(),
  useUser: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: false });
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});
    (signInWithPopup as jest.Mock).mockResolvedValue({});
    jest.clearAllMocks();
  });

  it('should render the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should handle email/password login', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password');
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle Google login', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Login with Google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display an error message on failed login', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
