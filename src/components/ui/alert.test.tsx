
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './alert';

describe('Alert', () => {
  it('should render an alert with the default variant', () => {
    render(<Alert>Alert content</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('bg-background');
  });

  it('should render an alert with the destructive variant', () => {
    render(<Alert variant="destructive">Alert content</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/50');
  });

  it('should render an alert with a title and description', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>
    );
    const title = screen.getByText('Alert Title');
    const description = screen.getByText('Alert Description');
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
