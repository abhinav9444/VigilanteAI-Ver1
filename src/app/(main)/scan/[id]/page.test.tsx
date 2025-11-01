
import { render, screen } from '@testing-library/react';
import ScanPage from './page';

// Mock dependencies to avoid errors
jest.mock('@/firebase', () => ({
  useDoc: jest.fn(() => ({ data: null, isLoading: true, error: null })),
  useUser: jest.fn(() => ({ user: { uid: 'test-user' } })),
  useFirestore: jest.fn(() => ({})),
  useMemoFirebase: jest.fn(cb => cb()),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ id: 'test-id' }),
}));
jest.mock('./loading', () => () => <div data-testid="loading-spinner" />);

describe('ScanPage', () => {
  it('should exist', () => {
    expect(ScanPage).toBeDefined();
  });
});
