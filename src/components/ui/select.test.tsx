
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './select';
import React from 'react';

// Mock the Radix UI Select component to render its children immediately
jest.mock('@radix-ui/react-select', () => {
  const SelectPrimitive = jest.requireActual('@radix-ui/react-select');
  return {
    ...SelectPrimitive,
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Item: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Value: ({ placeholder }: { placeholder: string }) => <div>{placeholder}</div>,
    ScrollUpButton: () => <div />,
    ScrollDownButton: () => <div />,
  };
});

describe('Select', () => {
  it.skip('should render the content', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    // With the mock, the content is always visible
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });
});
