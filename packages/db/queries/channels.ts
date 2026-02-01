// Channel queries with Supabase
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Channel, ChannelSlug } from '@promohub/types'

// Database row type (snake_case)
interface ChannelRow {
  id: string
  name: string
  slug: string
  logo_url: string | null
  color: string
  is_active: boolean
  created_at: string
}

// Convert database row to Channel type
function toChannel(row: ChannelRow): Channel {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url ?? undefined,
    color: row.color,
    isActive: row.is_active,
    createdAt: row.created_at,
  }
}

// Get all channels
export async function getChannels(
  supabase: SupabaseClient,
  options?: { activeOnly?: boolean }
): Promise<{ data: Channel[]; error: Error | null }> {
  let query = supabase
    .from('channels')
    .select('*')
    .order('name', { ascending: true })

  if (options?.activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return { data: [], error }
  }

  return {
    data: (data as ChannelRow[]).map(toChannel),
    error: null,
  }
}

// Get a channel by ID
export async function getChannelById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Channel | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toChannel(data as ChannelRow),
    error: null,
  }
}

// Get a channel by slug
export async function getChannelBySlug(
  supabase: SupabaseClient,
  slug: ChannelSlug
): Promise<{ data: Channel | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toChannel(data as ChannelRow),
    error: null,
  }
}

// Get multiple channels by IDs
export async function getChannelsByIds(
  supabase: SupabaseClient,
  ids: string[]
): Promise<{ data: Channel[]; error: Error | null }> {
  if (ids.length === 0) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .in('id', ids)

  if (error) {
    return { data: [], error }
  }

  return {
    data: (data as ChannelRow[]).map(toChannel),
    error: null,
  }
}

// Get channel ID to name/color mapping (useful for calendar views)
export async function getChannelMap(
  supabase: SupabaseClient
): Promise<{ data: Map<string, { name: string; color: string; slug: string }>; error: Error | null }> {
  const { data, error } = await supabase
    .from('channels')
    .select('id, name, color, slug')

  if (error) {
    return { data: new Map(), error }
  }

  const channelMap = new Map<string, { name: string; color: string; slug: string }>()
  for (const channel of data) {
    channelMap.set(channel.id, {
      name: channel.name,
      color: channel.color,
      slug: channel.slug,
    })
  }

  return { data: channelMap, error: null }
}
