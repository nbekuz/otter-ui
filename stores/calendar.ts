import { defineStore } from 'pinia'
import dayjs from 'dayjs'

export type CalendarViewType = 'day' | 'week' | 'month' | 'year'

export const useCalendarStore = defineStore('calendar', () => {
  const currentDate = ref(dayjs().format('YYYY-MM-DD'))
  const viewType = ref<CalendarViewType>('day')
  const collapsedEarlyHours = ref(true)  // 00:00–06:00 collapsed
  const collapsedLateHours = ref(true)   // 21:00–00:00 collapsed

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
    goNext,
    goPrev,
    goToday,
    setDate,
    setView,
    toggleEarlyHours,
    toggleLateHours,
  }
})
