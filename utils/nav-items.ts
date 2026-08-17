export const APP_NAV_CATALOG = [
  { id: 'tasks', to: '/app', label: 'Задачи' },
  { id: 'calendar', to: '/app/calendar', label: 'Календарь' },
  { id: 'matrix', to: '/app/matrix', label: 'Матрица' },
  { id: 'pomodoro', to: '/app/pomodoro', label: 'Помодоро' },
  { id: 'profile', to: '/app/profile', label: 'Профиль' },
  { id: 'settings', to: '/app/settings', label: 'Настройки' },
] as const

export type AppNavItemId = (typeof APP_NAV_CATALOG)[number]['id']
export type AppNavItem = (typeof APP_NAV_CATALOG)[number]

/** Fixed catalog order — visual order is applied via CSS `order`, never DOM reorder. */
export const SIDEBAR_NAV_IDS: AppNavItemId[] = [
  'tasks',
  'calendar',
  'matrix',
  'pomodoro',
  'settings',
]

export const BOTTOM_NAV_IDS: AppNavItemId[] = [
  'tasks',
  'calendar',
  'matrix',
  'pomodoro',
  'settings',
]

function isLegacyBottomNavWithoutPremium(items: string[]) {
  return items.length === 2
    && items.includes('tasks')
    && items.includes('settings')
    && !items.includes('calendar')
}

/** Expands legacy server defaults (`tasks` + `settings` only) to full menu. */
export function resolveBottomNavItems(items: string[] | undefined): string[] {
  if (!items?.length) return [...BOTTOM_NAV_IDS]
  const normalized = normalizeBottomNavItems([...items])
  if (isLegacyBottomNavWithoutPremium(normalized)) {
    return normalizeBottomNavItems([...BOTTOM_NAV_IDS])
  }
  return normalized
}

export function normalizeBottomNavItems(items: string[]) {
  const seen = new Set<string>()
  const result: string[] = []
  for (const id of items) {
    if (!id || id === 'profile' || seen.has(id)) continue
    seen.add(id)
    result.push(id)
  }
  if (!seen.has('settings')) result.push('settings')
  return result
}

/**
 * Resolve active nav id from route path only.
 * More specific paths are checked before shorter prefixes.
 */
export function resolveActiveNavId(path: string): AppNavItemId | null {
  const current = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/'

  if (current === '/app/settings' || current.startsWith('/app/settings/')) return 'settings'
  if (current === '/app/calendar' || current.startsWith('/app/calendar/')) return 'calendar'
  if (current === '/app/matrix' || current.startsWith('/app/matrix/')) return 'matrix'
  if (current === '/app/pomodoro' || current.startsWith('/app/pomodoro/')) return 'pomodoro'
  if (current === '/app/profile' || current.startsWith('/app/profile/')) return 'profile'
  if (current === '/app') return 'tasks'

  return null
}

/** @deprecated Prefer resolveActiveNavId + equality check. */
export function isNavItemActive(item: Pick<AppNavItem, 'id' | 'to'>, path: string): boolean {
  return resolveActiveNavId(path) === item.id
}

/** Map nav id → CSS order index from user preference list. */
export function buildNavOrderMap(order: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  order.forEach((id, index) => {
    if (!(id in map)) map[id] = index
  })
  return map
}

export function orderNavItems(order: string[], options?: { includeProfile?: boolean }): AppNavItem[] {
  const byId = new Map(APP_NAV_CATALOG.map(item => [item.id, item]))
  const includeProfile = options?.includeProfile !== false
  const seen = new Set<string>()
  const items: AppNavItem[] = []

  for (const id of order) {
    const item = byId.get(id as AppNavItemId)
    if (!item || seen.has(item.id)) continue
    seen.add(item.id)
    items.push(item)
  }

  if (includeProfile && !seen.has('profile')) {
    const profile = byId.get('profile')
    if (profile) {
      const settingsIdx = items.findIndex(i => i.id === 'settings')
      if (settingsIdx === -1) items.push(profile)
      else items.splice(settingsIdx, 0, profile)
      seen.add('profile')
    }
  }

  if (!seen.has('settings')) {
    const settings = byId.get('settings')
    if (settings) items.push(settings)
  }

  return items
}
