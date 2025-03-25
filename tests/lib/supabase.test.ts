import { supabase } from '../../lib/supabase/client';

// Mock the Supabase client creation
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }))
}));

describe('Supabase Client', () => {
  test('supabase client should be defined', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
}); 