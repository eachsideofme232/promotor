// Product queries with Supabase
import type { SupabaseClient } from '@supabase/supabase-js'

// Product type
export interface Product {
  id: string
  teamId: string
  name: string
  sku?: string
  barcode?: string
  brand?: string
  category?: string
  description?: string
  imageUrl?: string
  basePrice?: number
  costPrice?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Database row type (snake_case)
interface ProductRow {
  id: string
  team_id: string
  name: string
  sku: string | null
  barcode: string | null
  brand: string | null
  category: string | null
  description: string | null
  image_url: string | null
  base_price: number | null
  cost_price: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Convert database row to Product type
function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    teamId: row.team_id,
    name: row.name,
    sku: row.sku ?? undefined,
    barcode: row.barcode ?? undefined,
    brand: row.brand ?? undefined,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    basePrice: row.base_price ?? undefined,
    costPrice: row.cost_price ?? undefined,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface GetProductsParams {
  teamId: string
  brand?: string
  category?: string
  activeOnly?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface GetProductsResult {
  data: Product[]
  count: number
  error: Error | null
}

// Get products for a team
export async function getProducts(
  supabase: SupabaseClient,
  params: GetProductsParams
): Promise<GetProductsResult> {
  const { teamId, brand, category, activeOnly, search, page = 1, limit = 50 } = params
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('team_id', teamId)
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1)

  if (brand) {
    query = query.eq('brand', brand)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return { data: [], count: 0, error }
  }

  return {
    data: (data as ProductRow[]).map(toProduct),
    count: count ?? 0,
    error: null,
  }
}

// Get a single product by ID
export async function getProductById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Product | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toProduct(data as ProductRow),
    error: null,
  }
}

// Create a new product
export interface CreateProductInput {
  teamId: string
  name: string
  sku?: string
  barcode?: string
  brand?: string
  category?: string
  description?: string
  imageUrl?: string
  basePrice?: number
  costPrice?: number
}

export async function createProduct(
  supabase: SupabaseClient,
  input: CreateProductInput
): Promise<{ data: Product | null; error: Error | null }> {
  const insertData = {
    team_id: input.teamId,
    name: input.name,
    sku: input.sku ?? null,
    barcode: input.barcode ?? null,
    brand: input.brand ?? null,
    category: input.category ?? null,
    description: input.description ?? null,
    image_url: input.imageUrl ?? null,
    base_price: input.basePrice ?? null,
    cost_price: input.costPrice ?? null,
  }

  const { data, error } = await supabase
    .from('products')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toProduct(data as ProductRow),
    error: null,
  }
}

// Update a product
export interface UpdateProductInput {
  name?: string
  sku?: string
  barcode?: string
  brand?: string
  category?: string
  description?: string
  imageUrl?: string
  basePrice?: number
  costPrice?: number
  isActive?: boolean
}

export async function updateProduct(
  supabase: SupabaseClient,
  id: string,
  updates: UpdateProductInput
): Promise<{ data: Product | null; error: Error | null }> {
  const updateData: Record<string, unknown> = {}

  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.sku !== undefined) updateData.sku = updates.sku
  if (updates.barcode !== undefined) updateData.barcode = updates.barcode
  if (updates.brand !== undefined) updateData.brand = updates.brand
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
  if (updates.basePrice !== undefined) updateData.base_price = updates.basePrice
  if (updates.costPrice !== undefined) updateData.cost_price = updates.costPrice
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return {
    data: toProduct(data as ProductRow),
    error: null,
  }
}

// Delete a product
export async function deleteProduct(
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  return {
    success: !error,
    error: error ?? null,
  }
}

// Get products for a promotion
export async function getPromotionProducts(
  supabase: SupabaseClient,
  promotionId: string
): Promise<{ data: Product[]; error: Error | null }> {
  // First get product IDs from promo_products
  const { data: promoProducts, error: promoError } = await supabase
    .from('promo_products')
    .select('product_id')
    .eq('promotion_id', promotionId)

  if (promoError) {
    return { data: [], error: promoError }
  }

  if (!promoProducts || promoProducts.length === 0) {
    return { data: [], error: null }
  }

  // Then fetch the products
  const productIds = promoProducts.map(pp => pp.product_id)
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)

  if (error) {
    return { data: [], error }
  }

  return {
    data: (data as ProductRow[]).map(toProduct),
    error: null,
  }
}

// Add products to a promotion
export async function addProductsToPromotion(
  supabase: SupabaseClient,
  promotionId: string,
  productIds: string[]
): Promise<{ success: boolean; error: Error | null }> {
  const insertData = productIds.map(productId => ({
    promotion_id: promotionId,
    product_id: productId,
  }))

  const { error } = await supabase
    .from('promo_products')
    .insert(insertData)

  return {
    success: !error,
    error: error ?? null,
  }
}

// Remove products from a promotion
export async function removeProductsFromPromotion(
  supabase: SupabaseClient,
  promotionId: string,
  productIds: string[]
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from('promo_products')
    .delete()
    .eq('promotion_id', promotionId)
    .in('product_id', productIds)

  return {
    success: !error,
    error: error ?? null,
  }
}

// Get unique brands for a team (for filters)
export async function getProductBrands(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ data: string[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .eq('team_id', teamId)
    .not('brand', 'is', null)

  if (error) {
    return { data: [], error }
  }

  const brands = [...new Set((data || []).map(row => row.brand).filter(Boolean))]
  return { data: brands as string[], error: null }
}

// Get unique categories for a team (for filters)
export async function getProductCategories(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ data: string[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('team_id', teamId)
    .not('category', 'is', null)

  if (error) {
    return { data: [], error }
  }

  const categories = [...new Set((data || []).map(row => row.category).filter(Boolean))]
  return { data: categories as string[], error: null }
}
