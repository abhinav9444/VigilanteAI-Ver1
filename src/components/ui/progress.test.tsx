
import { render, screen } from '@testing-library/react';
import { Progress } from './progress';

describe('Progress', () => {
  it('should render a progress bar with the correct value', () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();

    const indicator = progress.firstChild as HTMLElement;
    expect(indicator).toHaveStyle('transform: translateX(-50%)');
  });

  it('should render a progress bar with a value of 0 if no value is provided', () => {
    render(<Progress />);
    const progress = screen.getByRole('progressbar');
    const indicator = progress.firstChild as HTMLElement;
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });
});
