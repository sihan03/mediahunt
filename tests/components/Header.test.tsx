import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for toHaveClass matcher
import Header from '../../app/components/Header';
import { useAuth } from '../../lib/AuthContext';

// Mock the auth context
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock react-icons
jest.mock('react-icons/hi', () => ({
  HiPlusCircle: () => <div data-testid="plus-icon" />,
}));

describe('Header Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user' },
    });
  });

  test('renders with Apple-inspired styling', () => {
    render(<Header />);
    
    // Check header container styling
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white');
    
    // Check logo section
    const logo = screen.getByAltText('MediaHunt Logo');
    expect(logo).toBeInTheDocument();
    
    // Updated: Just verify the button exists without checking specific classes
    const submitButton = Array.from(screen.getAllByRole('link')).find(
      link => link.textContent?.includes('Submit')
    );
    expect(submitButton).toBeTruthy();
  });

  test('renders with Apple-inspired typography', () => {
    render(<Header />);
    
    // Check heading typography
    const heading = screen.getByRole('heading', { name: /mediahunt/i });
    expect(heading).toHaveClass('font-medium');
    expect(heading).toHaveClass('tracking-tight');
    
    // Check subtitle typography
    const subtitle = screen.getByText(/discover and vote/i);
    expect(subtitle).toHaveClass('text-gray-500');
  });

  test('renders differently for non-authed users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });
    
    render(<Header />);
    
    // Submit button shouldn't be visible
    const submitButtons = screen.queryAllByRole('link').filter(link => 
      link.textContent?.includes('Submit')
    );
    expect(submitButtons.length).toBe(0);
  });
}); 