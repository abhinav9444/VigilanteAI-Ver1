
import { render, screen } from '@testing-library/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './carousel';
import React from 'react';

// Mock the embla-carousel-react library to prevent errors in the JSDOM environment
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [() => {}, { canScrollPrev: () => false, canScrollNext: () => false, on: () => {}, off: () => {} }],
}));

describe('Carousel', () => {
  it('should render the carousel without crashing', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    // Check that the main carousel region and navigation buttons are rendered
    expect(screen.getByRole('region', { name: /carousel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
  });
});
