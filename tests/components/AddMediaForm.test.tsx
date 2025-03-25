import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddMediaForm from '../../app/components/AddMediaForm';
import { useAuth } from '../../lib/AuthContext';
import { addMediaItem } from '../../lib/database';

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the auth context
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the database functions
jest.mock('../../lib/database', () => ({
  addMediaItem: jest.fn(),
}));

describe('AddMediaForm Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user' },
    });
  });

  test('renders the form with Apple-inspired styling', () => {
    render(<AddMediaForm />);
    
    // Check for styled container
    const formContainer = screen.getByRole('form', { name: /add media/i }).closest('div');
    expect(formContainer).toHaveClass('bg-white');
    expect(formContainer).toHaveClass('rounded-xl');
    expect(formContainer).toHaveClass('shadow-sm');
    
    // Check input styling
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('transition-all');
      expect(input).toHaveClass('duration-200');
    });
    
    // Check button styling
    const submitButton = screen.getByRole('button', { name: /add media source/i });
    expect(submitButton).toHaveClass('bg-gradient-to-r');
    expect(submitButton).toHaveClass('hover:scale-[1.01]');
    expect(submitButton).toHaveClass('transition-all');
  });

  test('shows loading state with Apple-like styling when submitting', async () => {
    (addMediaItem as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AddMediaForm />);
    
    // Fill out the form using more specific selectors
    fireEvent.change(screen.getByLabelText(/title \*/i), { target: { value: 'Test Title' } });
    
    // Use specific ID for URL field to avoid ambiguity
    const urlInput = document.getElementById('url');
    fireEvent.change(urlInput!, { target: { value: 'https://test.com' } });
    
    fireEvent.change(screen.getByLabelText(/description \*/i), { target: { value: 'Test description' } });
    
    // Use querySelector to get the select element by ID
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    fireEvent.change(categorySelect, { target: { value: 'news' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /add media source/i }));
    
    // Check loading state
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    const loadingButton = screen.getByRole('button', { name: /adding/i });
    expect(loadingButton).toHaveClass('bg-gradient-to-r');
    expect(loadingButton).toHaveClass('disabled:opacity-75');
  });

  test('non-authed users see a styled message', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });
    
    render(<AddMediaForm />);
    
    const message = screen.getByText(/you must be signed in/i);
    const container = message.closest('div');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('rounded-xl');
    expect(container).toHaveClass('shadow-sm');
  });
}); 