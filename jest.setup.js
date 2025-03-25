// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock the NextJS router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock next/navigation if used
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
}));

// Mock environment variables if needed
process.env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'example-anon-key',
}; 