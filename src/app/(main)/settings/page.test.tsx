
import { render, screen } from '@testing-library/react';
import SettingsPage from './page';

describe('SettingsPage', () => {
  it('should render the settings page with notification options', () => {
    render(<SettingsPage />);

    // Check for main headings
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account and application settings.')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Check for notification options
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('AI Summary Digest')).toBeInTheDocument();

    // Check for switches
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBe(2);
    expect(switches[0]).toBeChecked();
    expect(switches[1]).not.toBeChecked();
  });
});
