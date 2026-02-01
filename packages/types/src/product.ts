// Product types

export interface Product {
  id: string
  teamId: string
  name: string
  sku: string
  barcode?: string
  category?: string
  brand?: string
  basePrice: number
  costPrice?: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductInput {
  name: string
  sku: string
  barcode?: string
  category?: string
  brand?: string
  basePrice: number
  costPrice?: number
  teamId: string
  imageUrl?: string
  isActive?: boolean
}

export interface UpdateProductInput {
  name?: string
  sku?: string
  barcode?: string
  category?: string
  brand?: string
  basePrice?: number
  costPrice?: number
  imageUrl?: string
  isActive?: boolean
}

export interface ProductFilters {
  teamId: string
  search?: string
  category?: string
  brand?: string
  isActive?: boolean
}

// Product-Promotion relationship (N:M)
export interface PromotionProduct {
  id: string
  promotionId: string
  productId: string
  discountedPrice?: number
  specialOffer?: string
  createdAt: string
}
