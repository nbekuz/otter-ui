import { addMinutesToTime } from '~/utils/time'

/** Синхронизация «Время срока» ↔ «Начало»; при смене срока — конец +1 ч. */
export function useTaskTimeSync(form: {
  dueTime: string
  durationStart: string
  durationEnd: string
}) {
  let syncing = false

  watch(() => form.dueTime, (val) => {
    if (syncing || !val) return
    syncing = true
    form.durationStart = val
    form.durationEnd = addMinutesToTime(val, 60)
    syncing = false
  })

  watch(() => form.durationStart, (val) => {
    if (syncing) return
    syncing = true
    if (val) {
      form.dueTime = val
      if (!form.durationEnd || form.durationEnd === form.dueTime) {
        form.durationEnd = addMinutesToTime(val, 60)
      }
    }
    syncing = false
  })
}
