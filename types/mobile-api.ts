export type ApiPriority = 'low' | 'medium' | 'high' | 'critical'
export type ApiMatrixBlock =
  | 'urgent_important'
  | 'not_urgent_important'
  | 'urgent_not_important'
  | 'not_urgent_not_important'
export type ApiRepeatUnit = 'none' | 'day' | 'week' | 'month' | 'year'

export interface ApiTask {
  id: number
  title: string
  description: string | null
  due_at: string | null
  start_at: string | null
  end_at: string | null
  reminder_at: string | null
  reminder_offset_minutes?: number | null
  repeat_unit: ApiRepeatUnit
  repeat_interval: number
  priority: ApiPriority
  matrix_block: ApiMatrixBlock
  image: string | null
  is_completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ApiTaskGroup {
  key: 'overdue' | 'today' | 'tomorrow' | 'later' | 'no_deadline' | 'completed'
  title: string
  count: number
  tasks: ApiTask[]
}

export interface ApiPaginatedTasks {
  count: number
  next: string | null
  previous: string | null
  results: ApiTask[]
}

export interface ApiCalendarResponse {
  view: 'day' | 'week' | 'month' | 'year'
  date: string
  range_start: string
  range_end: string
  tasks: ApiTask[]
}

export interface ApiMatrixBlock {
  block: ApiMatrixBlock
  title: string
  allowed_priorities: ApiPriority[]
  date_filter: string
  count: number
  tasks: ApiTask[]
}

export interface ApiMatrixSetting {
  id: number
  block: ApiMatrixBlock
  title: string
  allowed_priorities: ApiPriority[]
  date_filter: string
}

export interface ApiSound {
  key: string
  category: 'timer_end' | 'work_background' | 'notification' | 'completion'
  title: string
  emoji: string
  audio_url: string | null
  sort_order: number
}

export interface ApiPomodoroSettings {
  duration_minutes: number
  short_break_minutes: number
  show_on_lock_screen: boolean
  timer_end_sound: string
  timer_end_sound_detail?: ApiSound
  work_sound: string
  work_sound_detail?: ApiSound
}

export interface ApiAppSettings {
  language: string
  timezone?: string | null
  show_overdue: boolean
  show_today: boolean
  show_tomorrow: boolean
  show_later: boolean
  show_no_deadline: boolean
  show_completed: boolean
  bottom_tabs: string[]
  notification_sound: string
  completion_sound: string
  vibration_enabled: boolean
  is_premium: boolean
  premium_activated_at: string | null
  premium_until?: string | null
}

export interface ApiHelpItem {
  question: string
  answer: string
}

export interface ApiHelpMessageResponse {
  id: number
  message: string
  screenshot: string | null
  created_at: string
}

export interface ApiPremiumFeature {
  key: string
  title: string
  is_premium: boolean
  is_enabled: boolean
}

export interface ApiTariff {
  code: string
  title: string
  description: string
  price: string
  currency: string
  duration_days: number
  promo_days: number
  is_recurring: boolean
  sort_order: number
}

export type ApiSubscriptionStatus =
  | 'none'
  | 'trial'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'

export interface ApiSubscription {
  status: ApiSubscriptionStatus
  tariff: ApiTariff | null
  promo_until: string | null
  premium_until: string | null
  recurring_enabled: boolean
  cancelled_at: string | null
  is_premium: boolean
  updated_at: string
}

export interface ApiPremiumCheckoutConsent {
  recurring_consent: boolean
  offer_version?: string
  consent_text?: string
}

export interface ApiPremiumPayment {
  invoice_id: number
  tariff: string
  amount: string
  currency: string
  kind: 'one_time' | 'initial' | 'recurring'
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  checkout_url: string
  paid_at: string | null
  created_at: string
}

export interface ApiPremiumCheckoutResponse {
  checkout_url: string
  provider: string
  payment?: ApiPremiumPayment
}

export type ApiPomodoroSessionState = 'idle' | 'running' | 'paused' | 'stopped' | 'completed'

export interface ApiPomodoroSession {
  id: number
  task: number | null
  duration_minutes: number
  state: ApiPomodoroSessionState
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export interface ApiLegalDocument {
  doc_type: string
  title: string
  content: string
  updated_at: string
}
