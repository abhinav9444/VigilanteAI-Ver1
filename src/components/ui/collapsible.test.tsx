
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './collapsible';

describe('Collapsible', () => {
  it('should show and hide content on trigger click', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Open</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByText('Open');

    // Content should not be in the document initially
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    // Click the trigger to show the content
    fireEvent.click(trigger);
    expect(screen.getByText('Content')).toBeVisible();

    // Click the trigger again to hide the content
    fireEvent.click(trigger);
    // The element is removed from the DOM, so we check for that
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
