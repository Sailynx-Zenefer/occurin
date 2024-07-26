import { createClient } from '@supabase/supabase-js'
import { Database } from "../../types/supabase";

const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL as string, 
    process.env.EXPO_PUBLIC_ANON_KEY as string
)

export default supabase