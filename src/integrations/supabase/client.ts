
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://lltcnxoqwmnfuyobkwvj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdGNueG9xd21uZnV5b2Jrd3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTYzMDYsImV4cCI6MjA2NTAzMjMwNn0.yumfQ4ha328-xn0HSoD9u1FEScbZsiOVtXGwatWVI_4'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
