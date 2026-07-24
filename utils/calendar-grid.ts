import dayjs from 'dayjs'

export type CalendarMonthCell = {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

export type CalendarYearDayCell = {
  day: number | null
  date: string | null
  isToday: boolean
}

export type CalendarYearMonth = {
  index: number
  name: string
  cells: CalendarYearDayCell[]
}

const YEAR_MONTH_NAMES = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
] as const

/** Mon-first month grid with leading/trailing padding to complete weeks. */
export function buildMonthCells(
  anchorDate: string,
  todayStr: string,
): CalendarMonthCell[] {
  const d = dayjs(anchorDate)
  const startOfMonth = d.startOf('month')
  const endOfMonth = d.endOf('month')
  const startDow = (startOfMonth.day() + 6) % 7 // Mon = 0

  const cells: CalendarMonthCell[] = []
  for (let i = 0; i < startDow; i++) {
    const day = startOfMonth.subtract(startDow - i, 'day')
    cells.push({
      date: day.format('YYYY-MM-DD'),
      day: day.date(),
      isCurrentMonth: false,
      isToday: day.format('YYYY-MM-DD') === todayStr,
    })
  }
  for (let i = 1; i <= endOfMonth.date(); i++) {
    const day = d.date(i)
    const date = day.format('YYYY-MM-DD')
    cells.push({
      date,
      day: i,
      isCurrentMonth: true,
      isToday: date === todayStr,
    })
  }
  while (cells.length % 7 !== 0) {
    const last = dayjs(cells[cells.length - 1]!.date).add(1, 'day')
    const date = last.format('YYYY-MM-DD')
    cells.push({
      date,
      day: last.date(),
      isCurrentMonth: false,
      isToday: date === todayStr,
    })
  }
  return cells
}

/** Always 6 weeks (42 cells) so year mini-months share a stable height. */
export function buildYearMonthCells(
  year: number,
  monthIndex: number,
  todayStr: string,
): CalendarYearDayCell[] {
  const m = dayjs().year(year).month(monthIndex)
  const startOfMonth = m.startOf('month')
  const startDow = (startOfMonth.day() + 6) % 7
  const cells: CalendarYearDayCell[] = []

  for (let j = 0; j < startDow; j++) {
    cells.push({ day: null, date: null, isToday: false })
  }
  for (let j = 1; j <= m.daysInMonth(); j++) {
    const d = m.date(j)
    const date = d.format('YYYY-MM-DD')
    cells.push({ day: j, date, isToday: date === todayStr })
  }
  while (cells.length < 42) {
    cells.push({ day: null, date: null, isToday: false })
  }
  return cells.slice(0, 42)
}

export function buildYearMonths(
  year: number,
  todayStr: string,
): CalendarYearMonth[] {
  return Array.from({ length: 12 }, (_, i) => ({
    index: i,
    name: YEAR_MONTH_NAMES[i]!,
    cells: buildYearMonthCells(year, i, todayStr),
  }))
}
