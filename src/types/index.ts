export interface FiiData {
  ticker: string
  name: string
  reference_date: string
  close_price: number
  book_value_per_share: number
  pvp: number
  dividend_yield_ttm: number
  net_asset_value: number
  shares_outstanding: number
  total_shareholders: number
  segment: string
  management_type: string
  administrator: string
  administrator_cnpj: string
  mandate: string
  inception_date: string
  duration_type: string
  target_investors: string
  website: string
  email: string
  fund_type: string
  property_count: number
  total_area_sqm: number
  vacancy_pct: number
  delinquency_pct: number
  leased_pct: number
  top_properties: string[]
  property_reference_date: string
}

export interface FiiHolding {
  id: string
  nome: string
  qnt: number
  total: number
  percentual: number
  totalFiis: number
  tipo: string
  precoAtual?: number
}
