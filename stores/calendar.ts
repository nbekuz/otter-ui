import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { CalendarDefaultView } from '~/data/mockData'

export type CalendarViewType = CalendarDefaultView

function resolveDefaultView(value: string | undefined): CalendarViewType {
  if (value === 'day' || value === 'week' || value === 'month' || value === 'year') {
    return value
  }
  return 'day'
}

export const useCalendarStore = defineStore('calendar', () => {
  const settingsStore = useSettingsStore()
  const currentDate = ref(dayjs().format('YYYY-MM-DD'))
  const viewType = ref<CalendarViewType>(
    resolveDefaultView(settingsStore.appSettings.calendarDefaultView),
  )
  /** 00:00–06:00 collapsed by default; auto-expands when early tasks exist. */
  const collapsedEarlyHours = ref(
    settingsStore.appSettings.calendarCollapseEarlyHours !== false,
  )
  /** 22:00–00:00 collapsed by default; auto-expands when late tasks exist. */
  const collapsedLateHours = ref(
    settingsStore.appSettings.calendarCollapseLateHours !== false,
  )

  /** Apply appearance defaults from Settings → Вид (without forcing mid-session). */
  function applyViewDefaultsFromSettings() {
    viewType.value = resolveDefaultView(settingsStore.appSettings.calendarDefaultView)
    collapsedEarlyHours.value = settingsStore.appSettings.calendarCollapseEarlyHours !== false
    collapsedLateHours.value = settingsStore.appSettings.calendarCollapseLateHours !== false
  }

  const displayLabel = computed(() => {
    const d = dayjs(currentDate.value)
    switch (viewType.value) {
      case 'day':
        return d.format('D MMMM YYYY')
      case 'week': {
        const start = d.startOf('week')
        const end = d.endOf('week')
        if (start.month() === end.month()) {
          return `${start.format('D')}–${end.format('D MMMM YYYY')}`
        }
        return `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`
      }
      case 'month':
        return d.format('MMMM YYYY')
      case 'year':
        return d.format('YYYY')
    }
  })

  function goNext() {
    const d = dayjs(currentDate.value)
    switch (viewType.value) {
      case 'day': currentDate.value = d.add(1, 'day').format('YYYY-MM-DD'); break
      case 'week': currentDate.value = d.add(1, 'week').format('YYYY-MM-DD'); break
      case 'month': currentDate.value = d.add(1, 'month').format('YYYY-MM-DD'); break
      case 'year': currentDate.value = d.add(1, 'year').format('YYYY-MM-DD'); break
    }
  }

  function goPrev() {
    const d = dayjs(currentDate.value)
    switch (viewType.value) {
      case 'day': currentDate.value = d.subtract(1, 'day').format('YYYY-MM-DD'); break
      case 'week': currentDate.value = d.subtract(1, 'week').format('YYYY-MM-DD'); break
      case 'month': currentDate.value = d.subtract(1, 'month').format('YYYY-MM-DD'); break
      case 'year': currentDate.value = d.subtract(1, 'year').format('YYYY-MM-DD'); break
    }
  }

  function goToday() {
    currentDate.value = dayjs().format('YYYY-MM-DD')
  }

  function setDate(date: string) {
    currentDate.value = date
  }

  function setView(view: CalendarViewType) {
    viewType.value = view
  }

  function toggleEarlyHours() {
    collapsedEarlyHours.value = !collapsedEarlyHours.value
  }

  function toggleLateHours() {
    collapsedLateHours.value = !collapsedLateHours.value
  }

  return {
    currentDate,
    viewType,
    displayLabel,
    collapsedEarlyHours,
    collapsedLateHours,
    applyViewDefaultsFromSettings,
    goNext,
    goPrev,
    goToday,
    setDate,
    setView,
    toggleEarlyHours,
    toggleLateHours,
  }
})
