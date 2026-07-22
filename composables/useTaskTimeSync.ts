import { addMinutesToTime } from '~/utils/time'

/** Синхронизация «Время срока» ↔ «Начало»; при смене срока — конец +1 ч. */
export function useTaskTimeSync(form: {
  dueTime: string
  durationStart: string
  durationEnd: string
}) {
  let syncing = false
  let paused = false

  function pauseSync() {
    paused = true
  }

  function resumeSync() {
    paused = false
  }

  watch(() => form.dueTime, (val) => {
    if (paused || syncing || !val) return
    syncing = true
    form.durationStart = val
    form.durationEnd = addMinutesToTime(val, 60)
    syncing = false
  })

  watch(() => form.durationStart, (val) => {
    if (paused || syncing) return
    syncing = true
    if (val) {
      form.dueTime = val
      // Always default End to Start + 1 hour.
      form.durationEnd = addMinutesToTime(val, 60)
    }
    syncing = false
  })

  return { pauseSync, resumeSync }
}
