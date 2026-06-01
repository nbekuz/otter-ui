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

export interface ApiPomodoroSettings {
  duration_minutes: number
  show_on_lock_screen: boolean
  timer_end_sound: string
  work_sound: string
}

export interface ApiAppSettings {
  language: string
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
