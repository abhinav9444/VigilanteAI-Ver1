
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog';

describe('Dialog', () => {
  it('should show and hide content on trigger click', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogFooter>
            <DialogClose asChild>
              <button>Close</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open');

    // Content should not be in the document initially
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();

    // Click the trigger to show the content
    fireEvent.click(trigger);
    expect(await screen.findByText('Dialog Content')).toBeVisible();

    // Find all elements with the text "Close" and click the one that is a button
    const closeButtons = screen.getAllByText('Close');
    const closeButton = closeButtons.find(button => button.tagName === 'BUTTON');
    fireEvent.click(closeButton!);

    // The element is removed from the DOM, so we check for that
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });
});
