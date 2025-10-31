
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

// Create a mock for matchMedia that allows us to control the listeners
const matchMediaMockFactory = () => {
  let listeners: ((event: { matches: boolean }) => void)[] = [];
  return {
    media: '',
    matches: window.innerWidth < 768,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn((event, listener) => {
      if (event === 'change') {
        listeners.push(listener);
      }
    }),
    removeEventListener: jest.fn((event, listener) => {
      if (event === 'change') {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }),
    dispatchEvent: jest.fn(),
    // Custom method to simulate the change event
    simulateChange: () => {
      // Update matches based on the current innerWidth, just like the real implementation
      const newMatches = window.innerWidth < 768;
      listeners.forEach(listener => listener({ matches: newMatches }));
    },
    clearListeners: () => {
      listeners = [];
    }
  };
};


describe('useIsMobile', () => {
  let matchMediaMock: ReturnType<typeof matchMediaMockFactory>;

  beforeEach(() => {
    matchMediaMock = matchMediaMockFactory();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => matchMediaMock),
    });
  });

  afterEach(() => {
    matchMediaMock.clearListeners();
  });

  it('should return false for desktop screen sizes on initial render', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile screen sizes on initial render', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should update when the screen size changes', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      // Change the window size to mobile
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
      // Simulate the change event
      matchMediaMock.simulateChange();
    });

    rerender();

    expect(result.current).toBe(true);
  });
});
