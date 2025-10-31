
import { render, screen } from '@testing-library/react';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('should render the calendar without crashing', () => {
    render(<Calendar />);
    // A simple check to ensure the component renders. We'll check for the nav buttons.
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });
});
