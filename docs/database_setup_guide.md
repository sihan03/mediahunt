# Supabase Database Setup Guide

Follow these steps to set up your Supabase database tables for MediaHunt:

1. Log in to your Supabase account and go to your project
2. Navigate to the SQL Editor in the left sidebar
3. Create a new query
4. Copy and paste the content from `scripts/setup_database.sql` into the SQL editor
5. Execute the query by clicking "Run"

The script will create three tables:
- `media`: Stores all media sources
- `user_votes`: Tracks user votes on media items
- `user_profiles`: Stores user profile information

Note: For this version, Row Level Security (RLS) is disabled. In a production environment, you should enable and configure RLS policies for better security.

## Manual Testing

After setting up the tables, you can verify they were created correctly:

1. Go to the Table Editor in Supabase
2. You should see the three new tables: `media`, `user_votes`, and `user_profiles`
3. You can also run the following SQL query to check the structure:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

This should list all your tables in the public schema. 