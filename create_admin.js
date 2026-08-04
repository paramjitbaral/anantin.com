import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
    console.log("Creating Admin User...")
    const { data, error } = await supabase.auth.signUp({
        email: 'paramjitbaral44@gmail.com',
        password: 'Swaraj@0405',
    })

    if (error) {
        console.error("Error creating admin:", error.message)
    } else {
        console.log("Admin User successfully created in Supabase Auth!")
        console.log("Note: Depending on your Supabase settings, you may need to confirm the email, or you can disable 'Confirm email' in Supabase Auth settings.")
    }
}

createAdmin()
