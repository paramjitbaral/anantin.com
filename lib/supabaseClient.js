import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseConfigError = new Error('Supabase environment variables are missing')

const createNoopQuery = () => ({
	select: () => createNoopQuery(),
	eq: () => createNoopQuery(),
	single: async () => ({ data: null, error: supabaseConfigError }),
	insert: async () => ({ data: null, error: supabaseConfigError }),
})

const createNoopStorageBucket = () => ({
	upload: async () => ({ data: null, error: supabaseConfigError }),
	getPublicUrl: () => ({ data: { publicUrl: '' } }),
})

const createNoopSupabaseClient = () => ({
	auth: {
		signInWithPassword: async () => ({ data: null, error: supabaseConfigError }),
		signUp: async () => ({ data: null, error: supabaseConfigError }),
		signOut: async () => ({ error: null }),
	},
	from: () => createNoopQuery(),
	storage: {
		from: () => createNoopStorageBucket(),
	},
})

export const supabase = supabaseUrl && supabaseAnonKey
	? createClient(supabaseUrl, supabaseAnonKey)
	: createNoopSupabaseClient()
