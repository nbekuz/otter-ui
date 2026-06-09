import type { Priority } from '~/data/mockData'

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#FF3B30',
  medium: '#FF9500',
  low: '#34C759',
  none: '#8E8E93',
}

export function priorityColor(priority: Priority) {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.none
}
