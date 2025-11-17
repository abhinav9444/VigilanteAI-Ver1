
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserNav } from './user-nav';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { User } from 'firebase/auth';
import React from 'react';

// Mock dependencies
jest.mock('@/firebase', () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock icons
jest.mock('lucide-react', () => ({
  Moon: () => 'MoonIcon',
  Sun: () => 'SunIcon',
  Monitor: () => 'MonitorIcon',
}));

// Mock the entire dropdown menu component to simplify testing
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    // If asChild is true, render the child directly. Otherwise, wrap in a div.
    return asChild ? <>{children}</> : <div data-testid="dropdown-trigger">{children}</div>;
  },
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, asChild, ...props }: { children: React.ReactNode, asChild?: boolean, onClick?: () => void }) => {
    // If asChild is true, render the child directly. Otherwise, wrap in a div.
    return asChild ? <>{children}</> : <div role="menuitem" {...props}>{children}</div>;
  },
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}));


describe('UserNav', () => {
  const mockRouterPush = jest.fn();
  const mockSetTheme = jest.fn();

  const mockUser = {
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/avatar.png',
  } as User;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useTheme as jest.Mock).mockReturnValue({ setTheme: mockSetTheme });
    (useAuth as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  it('should render the loading skeleton when user is loading', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: true });
    render(<UserNav />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('should render the login button when user is not logged in', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: false });
    render(<UserNav />);
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render the user avatar and dropdown content when user is logged in', () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isUserLoading: false });
    render(<UserNav />);
    // Since the content is always visible with our mock, we can check for it directly
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /log out/i })).toBeInTheDocument();
  });

  it('should handle logout when the logout button is clicked', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, isUserLoading: false });
    render(<UserNav />);

    // Click the logout button
    fireEvent.click(screen.getByRole('menuitem', { name: /log out/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should call setTheme when a theme option is clicked', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: false });
    render(<UserNav />);

    // The theme options are always visible due to the mock
    fireEvent.click(screen.getByRole('menuitem', { name: /dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByRole('menuitem', { name: /light/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    fireEvent.click(screen.getByRole('menuitem', { name: /system/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
