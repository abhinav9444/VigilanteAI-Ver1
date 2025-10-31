
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';

// Mock the providers
jest.mock('@/firebase', () => ({
  FirebaseClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="firebase-provider">{children}</div>,
}));
jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

describe('RootLayout', () => {
  it('should render its children and providers', () => {
    render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>,
      { container: document.body }
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByTestId('firebase-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });
});
