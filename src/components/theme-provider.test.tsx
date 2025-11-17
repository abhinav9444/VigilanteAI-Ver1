
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Mock the next-themes provider
jest.mock('next-themes', () => ({
  ThemeProvider: jest.fn(({ children }) => <div data-testid="next-themes-provider">{children}</div>),
}));

describe('ThemeProvider', () => {
  it('should render its children', () => {
    render(
      <ThemeProvider>
        <div>Child Content</div>
      </ThemeProvider>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should pass props to the NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div>Child Content</div>
      </ThemeProvider>
    );

    // Check that the mock component was called with the correct props
    expect(NextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'dark',
      }),
      {}
    );
  });
});
