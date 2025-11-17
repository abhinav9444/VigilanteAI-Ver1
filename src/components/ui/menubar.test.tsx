
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from './menubar';
import React from 'react';

// Mock the Radix UI Menubar component to render its children immediately
jest.mock('@radix-ui/react-menubar', () => {
  const MenubarPrimitive = jest.requireActual('@radix-ui/react-menubar');
  return {
    ...MenubarPrimitive,
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Menu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Menubar', () => {
  it('should render the content', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    // With the mock, the content is always visible
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
