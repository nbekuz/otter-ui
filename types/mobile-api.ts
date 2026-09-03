export type ApiPriority = 'low' | 'medium' | 'high' | 'critical'
export type ApiMatrixBlock =
  | 'urgent_important'
  | 'not_urgent_important'
  | 'urgent_not_important'
  | 'not_urgent_not_important'
export type ApiRepeatUnit = 'none' | 'day' | 'week' | 'month' | 'year'
export type ApiListKey =
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'later'
  | 'no_deadline'
  | 'completed'
export type ApiPlatform = 'android' | 'ios' | 'web'

export interface ApiAttachment {
  id: number
  file_url: string
  original_name: string
  content_type: string
  size: number
  created_at: string
}

export interface ApiTask {
  id: number
  title: string
  description: string | null
  due_at: string | null
  start_at: string | null
  end_at: string | null
  is_all_day?: boolean
  reminder_at: string | null
  reminder_offset_minutes?: number | null
  reminder_delivered_at?: string | null
  repeat_unit: ApiRepeatUnit
  repeat_interval: number
  /**
   * ISO weekdays 1=Mon … 7=Sun.
   * Always present: non-empty = custom weekly days; `[]` = plain weekly / N/A.
   */
  repeat_weekdays: number[]
  repeat_until?: string | null
  series_id?: string | null
  parent_task?: number | null
  priority: ApiPriority
  matrix_block: ApiMatrixBlock
  image: string | null
  image_url?: string | null
  attachments?: ApiAttachment[]
  is_completed: boolean
  completed_at: string | null
  list_key?: ApiListKey
  next_task?: ApiTask | null
  created_at: string
  updated_at: string
}

export interface ApiFcmDevice {
  id: number
  device_id: string
  name: string
  platform: ApiPlatform
  app_version: string
  is_active: boolean
  last_seen_at: string
  created_at: string
}

export interface ApiNotificationItem {
  id: number
  type: string
  title: string
  body: string
  data: Record<string, string>
  task: number | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface ApiNotificationsResponse {
  count: number
  next: string | null
  previous: string | null
  unread_count?: number
  results: ApiNotificationItem[]
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
  timezone?: string
  all_day_tasks?: ApiTask[]
  timed_tasks?: ApiTask[]
  tasks: ApiTask[]
}

export interface ApiMatrixBlock {
  block: ApiMatrixBlock
  title: string
  allowed_priorities: ApiPriority[]
  date_filter?: string
  date_filters?: string[]
  count: number
  tasks: ApiTask[]
}

export interface ApiMatrixSetting {
  id: number
  block: ApiMatrixBlock
  title: string
  allowed_priorities: ApiPriority[]
  date_filter?: string
  date_filters?: string[]
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
  rustore_product_id?: string | null
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
  /** `robokassa` | `rustore` | empty when none */
  provider?: string | null
  promo_used?: boolean
  /** Whether the user can still tap «Попробовать бесплатно». */
  trial_available?: boolean
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
  payment_url?: string
  checkout_params?: Record<string, string>
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
