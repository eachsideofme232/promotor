// Calendar queries with Supabase
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Promotion, PromotionStatus } from '@promohub/types'

// Database row type (snake_case)
interface PromotionRow {
  id: string
  team_id: string
  channel_id: string
  template_id: string | null
  title: string
  description: string | null
  status: PromotionStatus
  discount_type: string
  discount_value: string
  start_date: string
  end_date: string
  memo: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

interface ChannelRow {
  id: string
  name: string
  slug: string
  color: string
}

// Calendar-specific promotion with channel info
export interface CalendarPromotion extends Promotion {
  channel: {
    id: string
    name: string
    slug: string
    color: string
  }
}

export interface GetCalendarPromotionsParams {
  teamId: string
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate: string   // ISO date string (YYYY-MM-DD)
  channelIds?: string[]
  status?: PromotionStatus[]
}

export interface GetCalendarPromotionsResult {
  data: CalendarPromotion[]
  error: Error | null
}

export async function getCalendarPromotions(
  supabase: SupabaseClient,
  params: GetCalendarPromotionsParams
): Promise<GetCalendarPromotionsResult> {
  const { teamId, startDate, endDate, channelIds, status } = params

  // Query promotions that overlap with the given date range
  // A promotion overlaps if: promo.start_date <= range.end AND promo.end_date >= range.start
  let query = supabase
    .from('promotions')
    .select(`
      *,
      channels:channel_id (
        id,
        name,
        slug,
        color
      )
    `)
    .eq('team_id', teamId)
    .lte('start_date', endDate)
    .gte('end_date', startDate)
    .order('start_date', { ascending: true })

  if (channelIds && channelIds.length > 0) {
    query = query.in('channel_id', channelIds)
  }

  if (status && status.length > 0) {
    query = query.in('status', status)
  }

  const { data, error } = await query

  if (error) {
    return { data: [], error }
  }

  const promotions: CalendarPromotion[] = (data || []).map((row: PromotionRow & { channels: ChannelRow }) => ({
    id: row.id,
    teamId: row.team_id,
    channelId: row.channel_id,
    templateId: row.template_id ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    discountType: row.discount_type as Promotion['discountType'],
    discountValue: row.discount_value,
    startDate: row.start_date,
    endDate: row.end_date,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? undefined,
    channel: row.channels,
  }))

  return { data: promotions, error: null }
}

// Group promotions by date for calendar view
export interface PromotionsByDate {
  [date: string]: CalendarPromotion[]
}

export async function getPromotionsByDate(
  supabase: SupabaseClient,
  params: GetCalendarPromotionsParams
): Promise<{ data: PromotionsByDate; error: Error | null }> {
  const result = await getCalendarPromotions(supabase, params)

  if (result.error) {
    return { data: {}, error: result.error }
  }

  // Group promotions by each day they span
  const byDate: PromotionsByDate = {}

  for (const promo of result.data) {
    const start = new Date(promo.startDate)
    const end = new Date(promo.endDate)
    const rangeStart = new Date(params.startDate)
    const rangeEnd = new Date(params.endDate)

    // Iterate through each day of the promotion within the query range
    const current = new Date(Math.max(start.getTime(), rangeStart.getTime()))
    const endDate = new Date(Math.min(end.getTime(), rangeEnd.getTime()))

    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0]
      if (!byDate[dateKey]) {
        byDate[dateKey] = []
      }
      byDate[dateKey].push(promo)
      current.setDate(current.getDate() + 1)
    }
  }

  return { data: byDate, error: null }
}

// Check for conflicting promotions (same channel, overlapping dates)
export interface ConflictCheckParams {
  teamId: string
  channelId: string
  startDate: string
  endDate: string
  excludePromotionId?: string // Exclude this promotion from conflict check (for updates)
}

export interface ConflictCheckResult {
  hasConflict: boolean
  conflicts: CalendarPromotion[]
  error: Error | null
}

export async function checkPromotionConflicts(
  supabase: SupabaseClient,
  params: ConflictCheckParams
): Promise<ConflictCheckResult> {
  const { teamId, channelId, startDate, endDate, excludePromotionId } = params

  let query = supabase
    .from('promotions')
    .select(`
      *,
      channels:channel_id (
        id,
        name,
        slug,
        color
      )
    `)
    .eq('team_id', teamId)
    .eq('channel_id', channelId)
    .lte('start_date', endDate)
    .gte('end_date', startDate)
    .neq('status', 'cancelled')

  if (excludePromotionId) {
    query = query.neq('id', excludePromotionId)
  }

  const { data, error } = await query

  if (error) {
    return { hasConflict: false, conflicts: [], error }
  }

  const conflicts: CalendarPromotion[] = (data || []).map((row: PromotionRow & { channels: ChannelRow }) => ({
    id: row.id,
    teamId: row.team_id,
    channelId: row.channel_id,
    templateId: row.template_id ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    discountType: row.discount_type as Promotion['discountType'],
    discountValue: row.discount_value,
    startDate: row.start_date,
    endDate: row.end_date,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? undefined,
    channel: row.channels,
  }))

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    error: null,
  }
}
