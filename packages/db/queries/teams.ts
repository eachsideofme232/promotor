// Team queries with Supabase
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Team, TeamMember, TeamRole } from '@promohub/types'

// Database row types (snake_case)
interface TeamRow {
  id: string
  name: string
  slug: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

interface TeamMemberRow {
  id: string
  team_id: string
  user_id: string
  role: TeamRole
  created_at: string
}

// Convert database row to Team type
function toTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Convert database row to TeamMember type
function toTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  }
}

// Get all teams for the current user
export async function getUserTeams(
  supabase: SupabaseClient
): Promise<{ data: Team[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return { data: [], error }
  }

  return {
    data: (data as TeamRow[]).map(toTeam),
    error: null,
  }
}

// Get a single team by ID
export async function getTeamById(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ data: Team | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toTeam(data as TeamRow),
    error: null,
  }
}

// Get a team by slug
export async function getTeamBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ data: Team | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toTeam(data as TeamRow),
    error: null,
  }
}

// Create a new team (and add current user as owner)
export interface CreateTeamInput {
  name: string
  slug: string
  logoUrl?: string
}

export async function createTeam(
  supabase: SupabaseClient,
  input: CreateTeamInput
): Promise<{ data: Team | null; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  // Insert team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: input.name,
      slug: input.slug,
      logo_url: input.logoUrl ?? null,
    })
    .select()
    .single()

  if (teamError) {
    return { data: null, error: teamError }
  }

  // Add current user as owner
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: userData.user.id,
      role: 'owner',
    })

  if (memberError) {
    // Rollback team creation
    await supabase.from('teams').delete().eq('id', team.id)
    return { data: null, error: memberError }
  }

  return {
    data: toTeam(team as TeamRow),
    error: null,
  }
}

// Update a team
export interface UpdateTeamInput {
  name?: string
  slug?: string
  logoUrl?: string
}

export async function updateTeam(
  supabase: SupabaseClient,
  teamId: string,
  updates: UpdateTeamInput
): Promise<{ data: Team | null; error: Error | null }> {
  const updateData: Record<string, unknown> = {}

  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.slug !== undefined) updateData.slug = updates.slug
  if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl

  const { data, error } = await supabase
    .from('teams')
    .update(updateData)
    .eq('id', teamId)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toTeam(data as TeamRow),
    error: null,
  }
}

// Get team members
export async function getTeamMembers(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ data: TeamMember[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true })

  if (error) {
    return { data: [], error }
  }

  return {
    data: (data as TeamMemberRow[]).map(toTeamMember),
    error: null,
  }
}

// Add a member to a team
export async function addTeamMember(
  supabase: SupabaseClient,
  teamId: string,
  userId: string,
  role: TeamRole = 'member'
): Promise<{ data: TeamMember | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toTeamMember(data as TeamMemberRow),
    error: null,
  }
}

// Update a member's role
export async function updateTeamMemberRole(
  supabase: SupabaseClient,
  memberId: string,
  role: TeamRole
): Promise<{ data: TeamMember | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('id', memberId)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toTeamMember(data as TeamMemberRow),
    error: null,
  }
}

// Remove a member from a team
export async function removeTeamMember(
  supabase: SupabaseClient,
  memberId: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)

  return {
    success: !error,
    error: error ?? null,
  }
}

// Get current user's role in a team
export async function getUserRoleInTeam(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ role: TeamRole | null; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    return { role: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userData.user.id)
    .single()

  if (error) {
    return { role: null, error }
  }

  return {
    role: data?.role as TeamRole,
    error: null,
  }
}
