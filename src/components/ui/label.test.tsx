
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('should render a label with its children', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
  });
});
