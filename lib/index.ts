// Re-export all functionality from lib

// Auth exports
export * from './auth';

// Database exports - using the grouped exports to avoid name conflicts
import * as DatabaseOperations from './database';
export { DatabaseOperations };

// Supabase exports
export * from './supabase';

// Type exports
export * from './types';

// Utility exports
export * from './utils'; 