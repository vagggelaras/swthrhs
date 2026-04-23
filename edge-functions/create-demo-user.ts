// Supabase Edge Function: create-demo-user
// Πώς να το φτιάξεις:
//   Supabase Dashboard → Edge Functions → New Function → όνομα: "create-demo-user" → paste αυτό

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALL_TABS = ['Providers', 'Plans', 'Ανά Κατηγορία', 'Πελάτες', 'Settings', 'Status Settings', 'App Settings']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, display_name, role, allowed_tabs, demo_session_id } = await req.json()

    if (!email || !password || !display_name || !demo_session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Έλεγχος ότι το demo session είναι έγκυρο
    const { data: sessionData, error: sessionError } = await supabase
      .from('demo_sessions')
      .select('expires_at')
      .eq('id', demo_session_id)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !sessionData) {
      return new Response(
        JSON.stringify({ error: 'Μη έγκυρο ή expired demo session' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Max 5 temp χρήστες ανά demo session
    const { count } = await supabase
      .from('staff')
      .select('*', { count: 'exact', head: true })
      .eq('demo_session_id', demo_session_id)

    if ((count ?? 0) >= 5) {
      return new Response(
        JSON.stringify({ error: 'Μέγιστος αριθμός demo χρηστών (5) για αυτό το session' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Εκκαθάριση expired demo auth users (lazy cleanup)
    const { data: expiredStaff } = await supabase
      .from('staff')
      .select('user_id')
      .not('demo_session_id', 'is', null)
      .lt('expires_at', new Date().toISOString())

    if (expiredStaff?.length) {
      await Promise.allSettled(
        expiredStaff.map(s => supabase.auth.admin.deleteUser(s.user_id))
      )
    }

    // Δημιουργία auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name,
        demo_session_id,
        demo_expires_at: sessionData.expires_at,
      },
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = authData.user.id
    const tabs = role === 'admin' ? ALL_TABS : (allowed_tabs || [])

    // Δημιουργία staff record με demo tags
    const { error: staffError } = await supabase
      .from('staff')
      .insert({
        user_id: userId,
        display_name,
        role,
        allowed_tabs: tabs,
        demo_session_id,
        expires_at: sessionData.expires_at,
      })

    if (staffError) {
      await supabase.auth.admin.deleteUser(userId)
      return new Response(
        JSON.stringify({ error: 'Αποτυχία δημιουργίας staff record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
