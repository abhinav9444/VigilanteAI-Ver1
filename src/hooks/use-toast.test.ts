
import { act, renderHook } from '@testing-library/react';
import { useToast, reducer } from './use-toast';

describe('useToast', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts[0].title).toBe('Test Toast');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId;
    act(() => {
      const { id } = result.current.toast({ title: 'Test Toast' });
      toastId = id;
    });

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });
});

describe('toast reducer', () => {
  it('should add a toast', () => {
    const initialState = { toasts: [] };
    const action = {
      type: 'ADD_TOAST' as const,
      toast: { id: '1', title: 'Test', open: true, onOpenChange: () => {} },
    };
    const state = reducer(initialState, action);
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].title).toBe('Test');
  });

  it('should update a toast', () => {
    const initialState = {
      toasts: [{ id: '1', title: 'Test', open: true, onOpenChange: () => {} }],
    };
    const action = {
      type: 'UPDATE_TOAST' as const,
      toast: { id: '1', title: 'Updated Test' },
    };
    const state = reducer(initialState, action);
    expect(state.toasts[0].title).toBe('Updated Test');
  });

  it('should dismiss a toast', () => {
    const initialState = {
      toasts: [{ id: '1', title: 'Test', open: true, onOpenChange: () => {} }],
    };
    const action = { type: 'DISMISS_TOAST' as const, toastId: '1' };
    const state = reducer(initialState, action);
    expect(state.toasts[0].open).toBe(false);
  });

  it('should remove a toast', () => {
    const initialState = {
      toasts: [{ id: '1', title: 'Test', open: true, onOpenChange: () => {} }],
    };
    const action = { type: 'REMOVE_TOAST' as const, toastId: '1' };
    const state = reducer(initialState, action);
    expect(state.toasts).toHaveLength(0);
  });
});
