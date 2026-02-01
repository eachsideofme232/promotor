// Database package entry point
// Export queries and seed utilities

// Query functions (all respect RLS for multi-tenant isolation)
export * from './queries'

// Seed data (for development and testing)
export * from './seed'
