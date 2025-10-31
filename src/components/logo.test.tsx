
import { render, screen } from '@testing-library/react';
import { VigilanteAiLogo } from './logo';

describe('VigilanteAiLogo', () => {
  it('should render the logo', () => {
    render(<VigilanteAiLogo />);
    const logo = screen.getByTitle('VigilanteAI Logo');
    expect(logo).toBeInTheDocument();
  });
});
