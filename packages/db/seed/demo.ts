// Demo seed data for development and testing
// Use these constants for consistent test data across the app

// Fixed UUIDs for demo data (predictable for development)
export const DEMO_IDS = {
  // Team
  TEAM: 't1000000-0000-0000-0000-000000000001',

  // Channels
  CHANNELS: {
    OLIVEYOUNG: 'c1000000-0000-0000-0000-000000000001',
    COUPANG: 'c1000000-0000-0000-0000-000000000002',
    NAVER: 'c1000000-0000-0000-0000-000000000003',
    KAKAO: 'c1000000-0000-0000-0000-000000000004',
    MUSINSA: 'c1000000-0000-0000-0000-000000000005',
    SSG: 'c1000000-0000-0000-0000-000000000006',
    LOTTEON: 'c1000000-0000-0000-0000-000000000007',
    '11ST': 'c1000000-0000-0000-0000-000000000008',
  },

  // Products
  PRODUCTS: {
    TONER: 'p1000000-0000-0000-0000-000000000001',
    SERUM: 'p1000000-0000-0000-0000-000000000002',
    CREAM: 'p1000000-0000-0000-0000-000000000003',
    SUNSCREEN: 'p1000000-0000-0000-0000-000000000004',
    CLEANSER: 'p1000000-0000-0000-0000-000000000005',
    LIPTINT: 'p1000000-0000-0000-0000-000000000006',
    EYELINER: 'p1000000-0000-0000-0000-000000000007',
    MASCARA: 'p1000000-0000-0000-0000-000000000008',
  },

  // Templates
  TEMPLATES: {
    OLIVEYOUNG_MONTHLY: 'pt100000-0000-0000-0000-000000000001',
    COUPANG_ROCKET: 'pt100000-0000-0000-0000-000000000002',
    NAVER_LIVE: 'pt100000-0000-0000-0000-000000000003',
    KAKAO_GIFT: 'pt100000-0000-0000-0000-000000000004',
    BOGO: 'pt100000-0000-0000-0000-000000000005',
  },
} as const

// Demo team data
export const DEMO_TEAM = {
  id: DEMO_IDS.TEAM,
  name: '뷰티코리아',
  slug: 'beauty-korea',
  logoUrl: null,
}

// Demo products
export const DEMO_PRODUCTS = [
  {
    id: DEMO_IDS.PRODUCTS.TONER,
    teamId: DEMO_IDS.TEAM,
    name: '하이드레이팅 토너',
    sku: 'BK-TN-001',
    brand: '글로우랩',
    category: '스킨케어',
    basePrice: 28000,
  },
  {
    id: DEMO_IDS.PRODUCTS.SERUM,
    teamId: DEMO_IDS.TEAM,
    name: '비타민C 세럼',
    sku: 'BK-SR-001',
    brand: '글로우랩',
    category: '스킨케어',
    basePrice: 45000,
  },
  {
    id: DEMO_IDS.PRODUCTS.CREAM,
    teamId: DEMO_IDS.TEAM,
    name: '수분 크림',
    sku: 'BK-CR-001',
    brand: '글로우랩',
    category: '스킨케어',
    basePrice: 38000,
  },
  {
    id: DEMO_IDS.PRODUCTS.SUNSCREEN,
    teamId: DEMO_IDS.TEAM,
    name: '선크림 SPF50+',
    sku: 'BK-SN-001',
    brand: '글로우랩',
    category: '선케어',
    basePrice: 32000,
  },
  {
    id: DEMO_IDS.PRODUCTS.CLEANSER,
    teamId: DEMO_IDS.TEAM,
    name: '클렌징 폼',
    sku: 'BK-CL-001',
    brand: '글로우랩',
    category: '클렌저',
    basePrice: 18000,
  },
  {
    id: DEMO_IDS.PRODUCTS.LIPTINT,
    teamId: DEMO_IDS.TEAM,
    name: '립틴트 로즈',
    sku: 'BK-LT-001',
    brand: '컬러팝',
    category: '메이크업',
    basePrice: 15000,
  },
  {
    id: DEMO_IDS.PRODUCTS.EYELINER,
    teamId: DEMO_IDS.TEAM,
    name: '아이라이너',
    sku: 'BK-EL-001',
    brand: '컬러팝',
    category: '메이크업',
    basePrice: 12000,
  },
  {
    id: DEMO_IDS.PRODUCTS.MASCARA,
    teamId: DEMO_IDS.TEAM,
    name: '마스카라',
    sku: 'BK-MC-001',
    brand: '컬러팝',
    category: '메이크업',
    basePrice: 18000,
  },
]

// Demo promo templates
export const DEMO_TEMPLATES = [
  {
    id: DEMO_IDS.TEMPLATES.OLIVEYOUNG_MONTHLY,
    teamId: DEMO_IDS.TEAM,
    channelId: DEMO_IDS.CHANNELS.OLIVEYOUNG,
    name: '올리브영 월간 세일',
    description: '매월 진행되는 올리브영 정기 할인 행사',
    discountType: 'percentage' as const,
    discountValue: '20',
    recurrenceType: 'monthly' as const,
    defaultDurationDays: 7,
  },
  {
    id: DEMO_IDS.TEMPLATES.COUPANG_ROCKET,
    teamId: DEMO_IDS.TEAM,
    channelId: DEMO_IDS.CHANNELS.COUPANG,
    name: '쿠팡 로켓배송 특가',
    description: '로켓배송 상품 특별 할인',
    discountType: 'percentage' as const,
    discountValue: '15',
    recurrenceType: null,
    defaultDurationDays: 5,
  },
  {
    id: DEMO_IDS.TEMPLATES.NAVER_LIVE,
    teamId: DEMO_IDS.TEAM,
    channelId: DEMO_IDS.CHANNELS.NAVER,
    name: '네이버 쇼핑라이브',
    description: '네이버 쇼핑라이브 방송 연계 프로모션',
    discountType: 'coupon' as const,
    discountValue: '5000원 쿠폰',
    recurrenceType: null,
    defaultDurationDays: 1,
  },
  {
    id: DEMO_IDS.TEMPLATES.KAKAO_GIFT,
    teamId: DEMO_IDS.TEAM,
    channelId: DEMO_IDS.CHANNELS.KAKAO,
    name: '카카오 선물하기 기획전',
    description: '카카오 선물하기 메인 노출 기획전',
    discountType: 'gift' as const,
    discountValue: '미니어처 증정',
    recurrenceType: 'monthly' as const,
    defaultDurationDays: 14,
  },
  {
    id: DEMO_IDS.TEMPLATES.BOGO,
    teamId: DEMO_IDS.TEAM,
    channelId: null,
    name: '1+1 행사',
    description: '1+1 프로모션 템플릿',
    discountType: 'bogo' as const,
    discountValue: '1+1',
    recurrenceType: null,
    defaultDurationDays: 3,
  },
]

// Helper to generate date strings relative to today
export function getRelativeDate(daysFromToday: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

// Generate sample promotions with dynamic dates
export function generateSamplePromotions() {
  return [
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.OLIVEYOUNG,
      templateId: DEMO_IDS.TEMPLATES.OLIVEYOUNG_MONTHLY,
      title: '올리브영 2월 뷰티페스타',
      description: '2월 정기 할인 행사 - 스킨케어 라인 20% 할인',
      status: 'active' as const,
      discountType: 'percentage' as const,
      discountValue: '20',
      startDate: getRelativeDate(-3),
      endDate: getRelativeDate(4),
      memo: '메인 배너 노출 확정',
    },
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.COUPANG,
      templateId: DEMO_IDS.TEMPLATES.COUPANG_ROCKET,
      title: '쿠팡 로켓배송 특가전',
      description: '로켓배송 상품 15% 특별 할인',
      status: 'planned' as const,
      discountType: 'percentage' as const,
      discountValue: '15',
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(12),
      memo: '로켓배송 전용 할인',
    },
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.NAVER,
      templateId: DEMO_IDS.TEMPLATES.NAVER_LIVE,
      title: '네이버 쇼핑라이브 특별 방송',
      description: '비타민C 세럼 런칭 기념 라이브 방송',
      status: 'planned' as const,
      discountType: 'coupon' as const,
      discountValue: '5000원 쿠폰',
      startDate: getRelativeDate(10),
      endDate: getRelativeDate(10),
      memo: '오후 8시 방송 예정',
    },
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.KAKAO,
      templateId: DEMO_IDS.TEMPLATES.KAKAO_GIFT,
      title: '카카오 발렌타인 기획전',
      description: '발렌타인 선물하기 기획전 참여',
      status: 'active' as const,
      discountType: 'gift' as const,
      discountValue: '미니 립틴트 증정',
      startDate: getRelativeDate(-7),
      endDate: getRelativeDate(7),
      memo: '발렌타인 시즌 메인 노출',
    },
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.MUSINSA,
      templateId: null,
      title: '무신사 뷰티위크',
      description: '무신사 뷰티 카테고리 프로모션',
      status: 'planned' as const,
      discountType: 'percentage' as const,
      discountValue: '25',
      startDate: getRelativeDate(14),
      endDate: getRelativeDate(21),
      memo: '뷰티 카테고리 메인 배너',
    },
    {
      teamId: DEMO_IDS.TEAM,
      channelId: DEMO_IDS.CHANNELS.SSG,
      templateId: null,
      title: 'SSG 타임세일',
      description: '선크림 타임세일 이벤트',
      status: 'planned' as const,
      discountType: 'percentage' as const,
      discountValue: '30',
      startDate: getRelativeDate(5),
      endDate: getRelativeDate(5),
      memo: '오전 10시 타임세일',
    },
  ]
}
