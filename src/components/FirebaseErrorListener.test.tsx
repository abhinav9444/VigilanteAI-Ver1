
import React from 'react';
import { render } from '@testing-library/react';
import { FirebaseErrorListener } from './FirebaseErrorListener';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Mock the error emitter to control its behavior in tests
jest.mock('@/firebase/error-emitter', () => ({
  errorEmitter: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}));

// Mock the FirestorePermissionError to avoid side-effects from the real Firebase SDK
jest.mock('@/firebase/errors', () => ({
  FirestorePermissionError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FirestorePermissionError';
    }
  },
}));


describe('FirebaseErrorListener', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Suppress console.error output for tests that are expected to throw
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Clear mock calls before each test
    (errorEmitter.on as jest.Mock).mockClear();
    (errorEmitter.off as jest.Mock).mockClear();
  });

  afterEach(() => {
    // Restore original console.error function
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error when a permission-error event is received', () => {
    const testError = new FirestorePermissionError('Test permission error');

    // A helper component to trigger the error after the listener has mounted
    const TriggerErrorComponent = () => {
      React.useEffect(() => {
        // Get the event handler registered by FirebaseErrorListener
        const handleError = (errorEmitter.on as jest.Mock).mock.calls[0][1];
        // Simulate the error event
        handleError(testError);
      }, []);

      return <FirebaseErrorListener />;
    };

    // We expect the render function to throw the error that was emitted
    expect(() => render(<TriggerErrorComponent />)).toThrow(testError);
  });

  it('should subscribe to the error emitter on mount', () => {
    render(<FirebaseErrorListener />);
    expect(errorEmitter.on).toHaveBeenCalledWith('permission-error', expect.any(Function));
    expect(errorEmitter.on).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from the error emitter on unmount', () => {
    const { unmount } = render(<FirebaseErrorListener />);
    const handleError = (errorEmitter.on as jest.Mock).mock.calls[0][1];

    unmount();

    expect(errorEmitter.off).toHaveBeenCalledWith('permission-error', handleError);
    expect(errorEmitter.off).toHaveBeenCalledTimes(1);
  });
});
