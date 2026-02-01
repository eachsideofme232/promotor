// Promotion queries with Supabase
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Promotion,
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionStatus
} from '@promohub/types'

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

// Convert database row to Promotion type
function toPromotion(row: PromotionRow): Promotion {
  return {
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
  }
}

export interface GetPromotionsParams {
  teamId: string
  channelIds?: string[]
  status?: PromotionStatus
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetPromotionsResult {
  data: Promotion[]
  count: number
  error: Error | null
}

export async function getPromotions(
  supabase: SupabaseClient,
  params: GetPromotionsParams
): Promise<GetPromotionsResult> {
  const { teamId, channelIds, status, startDate, endDate, search, page = 1, limit = 20 } = params
  const offset = (page - 1) * limit

  let query = supabase
    .from('promotions')
    .select('*', { count: 'exact' })
    .eq('team_id', teamId)
    .order('start_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (channelIds && channelIds.length > 0) {
    query = query.in('channel_id', channelIds)
  }

  if (status) {
    query = query.eq('status', status)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('end_date', endDate)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return { data: [], count: 0, error }
  }

  return {
    data: (data as PromotionRow[]).map(toPromotion),
    count: count ?? 0,
    error: null,
  }
}

export async function getPromotionById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Promotion | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toPromotion(data as PromotionRow),
    error: null,
  }
}

export async function createPromotion(
  supabase: SupabaseClient,
  promotion: CreatePromotionInput
): Promise<{ data: Promotion | null; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser()

  const insertData = {
    team_id: promotion.teamId,
    channel_id: promotion.channelId,
    template_id: promotion.templateId ?? null,
    title: promotion.title,
    description: promotion.description ?? null,
    discount_type: promotion.discountType,
    discount_value: promotion.discountValue,
    start_date: promotion.startDate,
    end_date: promotion.endDate,
    memo: promotion.memo ?? null,
    created_by: userData?.user?.id ?? null,
  }

  const { data, error } = await supabase
    .from('promotions')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toPromotion(data as PromotionRow),
    error: null,
  }
}

export async function updatePromotion(
  supabase: SupabaseClient,
  id: string,
  updates: UpdatePromotionInput
): Promise<{ data: Promotion | null; error: Error | null }> {
  const updateData: Record<string, unknown> = {}

  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.discountType !== undefined) updateData.discount_type = updates.discountType
  if (updates.discountValue !== undefined) updateData.discount_value = updates.discountValue
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate
  if (updates.memo !== undefined) updateData.memo = updates.memo

  const { data, error } = await supabase
    .from('promotions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toPromotion(data as PromotionRow),
    error: null,
  }
}

export async function deletePromotion(
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)

  return {
    success: !error,
    error: error ?? null,
  }
}

// Get promotions with channel data joined
export async function getPromotionsWithChannel(
  supabase: SupabaseClient,
  params: GetPromotionsParams
): Promise<GetPromotionsResult & { channels?: Map<string, { name: string; color: string }> }> {
  const result = await getPromotions(supabase, params)

  if (result.error || result.data.length === 0) {
    return result
  }

  // Fetch channel data for the promotions
  const channelIds = [...new Set(result.data.map(p => p.channelId))]
  const { data: channels } = await supabase
    .from('channels')
    .select('id, name, color')
    .in('id', channelIds)

  const channelMap = new Map<string, { name: string; color: string }>()
  if (channels) {
    for (const ch of channels) {
      channelMap.set(ch.id, { name: ch.name, color: ch.color })
    }
  }

  return {
    ...result,
    channels: channelMap,
  }
}
