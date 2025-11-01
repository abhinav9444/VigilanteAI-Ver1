
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

describe('AboutPage', () => {
  it('should render the page without crashing', () => {
    render(<AboutPage />);
    expect(
      screen.getByRole('heading', { name: /About VigilanteAI/i })
    ).toBeInTheDocument();
  });
});
