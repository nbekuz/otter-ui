import { addMinutesToTime } from '~/utils/time'

/** End time = Start + 1 hour, clamped to 23:59 (no next-day rollover). */
export function defaultDurationEnd(start: string): string {
  return addMinutesToTime(start, 60)
}

/** True when end matches the auto Start+1h default for this start. */
export function isDefaultDurationEnd(start: string, end: string): boolean {
  if (!start?.trim() || !end?.trim()) return false
  return end === defaultDurationEnd(start)
}

/** Синхронизация «Время срока» ↔ «Начало»; конец = начало + 1 ч, пока пользователь не правил «Конец». */
export function useTaskTimeSync(form: {
  dueTime: string
  durationStart: string
  durationEnd: string
}) {
  let syncing = false
  let paused = false
  let endManuallyEdited = false

  function pauseSync() {
    paused = true
  }

  function resumeSync() {
    paused = false
  }

  /** Call when the user edits «Конец» (not when sync sets it). */
  function markEndEdited() {
    endManuallyEdited = true
  }

  function resetEndEdited() {
    endManuallyEdited = false
  }

  /**
   * After loading a task/form: treat a non-default end as manually set
   * so changing Start/Due keeps the saved end.
   */
  function adoptLoadedDuration(start: string, end: string) {
    if (start?.trim() && end?.trim() && !isDefaultDurationEnd(start, end)) {
      endManuallyEdited = true
    } else {
      endManuallyEdited = false
    }
  }

  function applyEndFromStart(start: string) {
    if (!endManuallyEdited) {
      form.durationEnd = defaultDurationEnd(start)
    }
  }

  watch(() => form.dueTime, (val) => {
    if (paused || syncing || !val) return
    syncing = true
    form.durationStart = val
    applyEndFromStart(val)
    syncing = false
  })

  watch(() => form.durationStart, (val) => {
    if (paused || syncing) return
    syncing = true
    if (val) {
      form.dueTime = val
      applyEndFromStart(val)
    }
    syncing = false
  })

  return {
    pauseSync,
    resumeSync,
    markEndEdited,
    resetEndEdited,
    adoptLoadedDuration,
  }
}
