
import { render, screen } from '@testing-library/react';
import { TechLogos } from './tech-logos';

describe('TechLogos', () => {
  // Test each logo component to ensure it renders
  Object.entries(TechLogos).forEach(([name, LogoComponent]) => {
    it(`should render the ${name} logo`, () => {
      render(<LogoComponent data-testid={`${name}-logo`} />);
      expect(screen.getByTestId(`${name}-logo`)).toBeInTheDocument();
    });
  });
});
