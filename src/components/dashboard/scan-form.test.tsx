
import { render, screen } from '@testing-library/react';
import { ScanForm } from './scan-form';

// Mock dependencies to avoid errors during smoke test
jest.mock('@/firebase', () => ({
  useUser: jest.fn(() => ({ user: { uid: 'test-user' } })),
  useFirestore: jest.fn(() => ({})),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('ScanForm', () => {
  it('should render the form without crashing', () => {
    render(<ScanForm />);
    expect(screen.getByLabelText('Website URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Scan/i })).toBeInTheDocument();
  });
});
