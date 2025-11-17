
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from './popover';
import React from 'react';

// Mock the Radix UI Popover component to render its children immediately
jest.mock('@radix-ui/react-popover', () => {
  const PopoverPrimitive = jest.requireActual('@radix-ui/react-popover');
  return {
    ...PopoverPrimitive,
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Popover', () => {
  it('should render the content', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>
    );

    // With the mock, the content is always visible
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });
});
