
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('should render a scroll area with its children', () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>
    );

    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });
});
