
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

// Mock the Radix UI Avatar component to render a simple img element
jest.mock('@radix-ui/react-avatar', () => {
  const React = require('react');
  const AvatarPrimitive = jest.requireActual('@radix-ui/react-avatar');
  return {
    ...AvatarPrimitive,
    Image: React.forwardRef(({ src, alt, ...props }: { src: string, alt: string }, ref: React.Ref<HTMLImageElement>) => (
      <img src={src} alt={alt} ref={ref} {...props} />
    )),
  };
});

describe('Avatar', () => {
  it('should render the fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AV')).toBeInTheDocument();
  });

  it('should render the image', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="Avatar" />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(image).toHaveAttribute('alt', 'Avatar');
  });
});
