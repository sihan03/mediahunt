import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddPage from '../../app/add/page';

// Mock the Header component
jest.mock('../../app/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header">Header</div>,
}));

// Mock the AddMediaForm component
jest.mock('../../app/components/AddMediaForm', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-form">AddMediaForm</div>,
}));

describe('AddPage Component', () => {
  test('renders with Apple-inspired styling', () => {
    render(<AddPage />);
    
    // Check main container styling
    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');
    expect(main).toHaveClass('bg-[#f5f5f7]');
    
    // Test the existence of a container without specific class checks
    const container = main.querySelector('div');
    expect(container).toBeTruthy();
    
    // Check heading styling
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-3xl');
    expect(heading).toHaveClass('font-medium');
    expect(heading).toHaveClass('tracking-tight');
    expect(heading).toHaveClass('text-center');
    
    // Check that the components are rendered
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
  });
}); 