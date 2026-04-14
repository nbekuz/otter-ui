<template>
  <div class="page-container bg-sber-gray-light">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-white shadow-sm pt-14 pb-3 px-4">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-xl font-bold text-sber-black">{{ calendarStore.displayLabel }}</h1>
        <div class="flex items-center gap-2">
          <button class="text-xs font-semibold text-sber-green px-3 py-1.5 bg-sber-green-light rounded-xl"
                  @click="calendarStore.goToday()">
            Сегодня
          </button>
          <button class="w-8 h-8 flex items-center justify-center" @click="viewMenuOpen = !viewMenuOpen">
            <LayoutGrid class="w-5 h-5 text-sber-gray" />
          </button>
        </div>
      </div>

      <!-- View selector dropdown -->
      <Transition name="slide-down">
        <div v-if="viewMenuOpen"
             class="absolute top-full left-4 right-4 bg-white rounded-2xl shadow-modal z-30 p-2">
          <button v-for="v in viewTypes" :key="v.value"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  :class="calendarStore.viewType === v.value ? 'bg-sber-green-light text-sber-green' : 'text-sber-black'"
                  @click="setView(v.value)">
            <component :is="v.icon" class="w-4 h-4" />
            {{ v.label }}
          </button>
        </div>
      </Transition>

      <!-- Navigation -->
      <div class="flex items-center justify-between">
        <button class="w-9 h-9 bg-sber-gray-light rounded-xl flex items-center justify-center"
                @click="calendarStore.goPrev()">
          <ChevronLeft class="w-5 h-5 text-sber-black" />
        </button>

        <!-- Day view: week strip -->
        <div v-if="calendarStore.viewType === 'day'" class="flex gap-1">
          <button v-for="day in weekDays" :key="day.date"
                  class="w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all"
                  :class="day.date === calendarStore.currentDate
                    ? 'bg-sber-green text-white'
                    : day.isToday ? 'bg-sber-green-light text-sber-green' : 'text-sber-gray'"
                  @click="calendarStore.setDate(day.date)">
            <span class="text-[10px] font-medium">{{ day.dayName }}</span>
            <span class="text-sm font-bold">{{ day.dayNum }}</span>
          </button>
        </div>

        <!-- Month/Year views: month grid mini -->
        <div v-else class="text-sm font-semibold text-sber-black">
          {{ calendarStore.displayLabel }}
        </div>

        <button class="w-9 h-9 bg-sber-gray-light rounded-xl flex items-center justify-center"
                @click="calendarStore.goNext()">
          <ChevronRight class="w-5 h-5 text-sber-black" />
        </button>
      </div>
    </div>

    <!-- DAY VIEW -->
    <div v-if="calendarStore.viewType === 'day'" class="relative">
      <!-- Timeline -->
      <div class="flex">
        <div class="w-14 flex-shrink-0" />
        <div class="flex-1 relative">
          <!-- Current time indicator -->
          <div v-if="calendarStore.currentDate === todayStr"
               class="absolute left-0 right-0 flex items-center z-10"
               :style="{ top: `${currentTimePx}px` }">
            <div class="w-2 h-2 rounded-full bg-red-500 -ml-1" />
            <div class="flex-1 h-0.5 bg-red-500" />
          </div>
        </div>
      </div>

      <!-- Early hours toggle -->
      <div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"
           @click="calendarStore.toggleEarlyHours()">
        <div class="w-14 text-xs text-sber-gray text-right pr-3">00–06</div>
        <div class="flex-1 h-px bg-sber-gray-mid" />
        <component :is="calendarStore.collapsedEarlyHours ? ChevronDown : ChevronUp"
                   class="w-4 h-4 text-sber-gray ml-2" />
      </div>

      <Transition name="slide-down">
        <div v-if="!calendarStore.collapsedEarlyHours">
          <div v-for="h in earlyHours" :key="h" class="flex min-h-[50px]">
            <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
              {{ String(h).padStart(2, '0') }}:00
            </div>
            <div class="flex-1 border-t border-sber-gray-light relative">
              <div v-for="task in getHourTasks(h)" :key="task.id"
                   class="absolute left-1 right-1 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer"
                   :style="{ backgroundColor: getPriorityColor(task.priority) + '30', color: getPriorityColor(task.priority), top: '2px' }"
                   @click="selectedTaskId = task.id">
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main hours (06:00–21:00) -->
      <div v-for="h in mainHours" :key="h" class="flex min-h-[60px]">
        <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
          {{ String(h).padStart(2, '0') }}:00
        </div>
        <div class="flex-1 border-t border-sber-gray-light relative px-1">
          <div v-for="task in getHourTasks(h)" :key="task.id"
               class="rounded-xl px-3 py-2 mb-1 cursor-pointer transition-opacity active:opacity-70"
               :style="{ backgroundColor: getPriorityColor(task.priority) + '20', borderLeft: `3px solid ${getPriorityColor(task.priority)}` }"
               @click="selectedTaskId = task.id">
            <p class="text-xs font-semibold" :style="{ color: getPriorityColor(task.priority) }">
              {{ task.dueTime }} {{ task.duration ? `– ${task.duration.end}` : '' }}
            </p>
            <p class="text-xs text-sber-black font-medium truncate">{{ task.title }}</p>
          </div>
        </div>
      </div>

      <!-- Late hours toggle -->
      <div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"
           @click="calendarStore.toggleLateHours()">
        <div class="w-14 text-xs text-sber-gray text-right pr-3">21–00</div>
        <div class="flex-1 h-px bg-sber-gray-mid" />
        <component :is="calendarStore.collapsedLateHours ? ChevronDown : ChevronUp"
                   class="w-4 h-4 text-sber-gray ml-2" />
      </div>

      <Transition name="slide-down">
        <div v-if="!calendarStore.collapsedLateHours">
          <div v-for="h in lateHours" :key="h" class="flex min-h-[50px]">
            <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
              {{ String(h).padStart(2, '0') }}:00
            </div>
            <div class="flex-1 border-t border-sber-gray-light relative" />
          </div>
        </div>
      </Transition>
    </div>

    <!-- WEEK VIEW -->
    <div v-else-if="calendarStore.viewType === 'week'" class="p-4">
      <!-- Week header -->
      <div class="flex gap-1 mb-3">
        <div class="w-8" />
        <div v-for="day in weekViewDays" :key="day.date" class="flex-1 text-center">
          <p class="text-[10px] text-sber-gray">{{ day.dayName }}</p>
          <div class="w-8 h-8 rounded-full mx-auto flex items-center justify-center"
               :class="day.isToday ? 'bg-sber-green text-white' : 'text-sber-black'">
            <span class="text-sm font-bold">{{ day.dayNum }}</span>
          </div>
        </div>
      </div>
      <!-- Hours -->
      <div v-for="h in [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]" :key="h" class="flex gap-1 min-h-[44px]">
        <div class="w-8 text-[10px] text-sber-gray pt-1">{{ String(h).padStart(2, '0') }}</div>
        <div v-for="day in weekViewDays" :key="day.date" class="flex-1 border-t border-sber-gray-light relative">
          <div v-for="task in getDateHourTasks(day.date, h)" :key="task.id"
               class="rounded px-1 py-0.5 mb-0.5 cursor-pointer truncate"
               :style="{ backgroundColor: getPriorityColor(task.priority) + '25', color: getPriorityColor(task.priority) }"
               @click="selectedTaskId = task.id">
            <span class="text-[9px] font-medium">{{ task.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MONTH VIEW -->
    <div v-else-if="calendarStore.viewType === 'month'" class="p-4">
      <!-- Weekday headers -->
      <div class="grid grid-cols-7 gap-1 mb-1">
        <div v-for="d in ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']" :key="d"
             class="text-center text-[10px] font-semibold text-sber-gray py-1">
          {{ d }}
        </div>
      </div>
      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-1">
        <div v-for="cell in monthCells" :key="cell.date || cell.empty"
             class="aspect-square rounded-xl flex flex-col items-center justify-start pt-1 cursor-pointer
                    transition-colors relative"
             :class="[
               !cell.isCurrentMonth ? 'opacity-30' : '',
               cell.date === calendarStore.currentDate ? 'bg-sber-green text-white' :
               cell.isToday ? 'bg-sber-green-light text-sber-green' : 'hover:bg-sber-gray-light',
             ]"
             @click="cell.date && calendarStore.setDate(cell.date) && calendarStore.setView('day')">
          <span class="text-xs font-bold">{{ cell.day }}</span>
          <!-- Task dots -->
          <div class="flex gap-0.5 mt-0.5 flex-wrap justify-center">
            <div v-for="dot in getDateDots(cell.date)" :key="dot"
                 class="w-1.5 h-1.5 rounded-full"
                 :style="{ backgroundColor: dot }" />
          </div>
        </div>
      </div>
    </div>

    <!-- YEAR VIEW -->
    <div v-else-if="calendarStore.viewType === 'year'" class="p-4">
      <div class="grid grid-cols-3 gap-3">
        <div v-for="month in yearMonths" :key="month.index"
             class="bg-white rounded-2xl p-3 cursor-pointer active:bg-sber-gray-light"
             @click="goToMonth(month.index)">
          <p class="text-xs font-bold text-sber-black mb-2">{{ month.name }}</p>
          <div class="grid grid-cols-7 gap-px">
            <div v-for="cell in month.cells.slice(0, 35)" :key="cell.day"
                 class="aspect-square flex items-center justify-center">
              <span v-if="cell.day" class="text-[9px]"
                    :class="cell.isToday ? 'w-4 h-4 rounded-full bg-sber-green text-white flex items-center justify-center' : 'text-sber-gray'">
                {{ cell.day }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task detail -->
    <TasksTaskDetailModal
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  LayoutGrid, CalendarDays, Calendar, CalendarRange, Columns
} from 'lucide-vue-next'
import dayjs from 'dayjs'

definePageMeta({ layout: 'app' })

const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()

const todayStr = dayjs().format('YYYY-MM-DD')
const viewMenuOpen = ref(false)
const selectedTaskId = ref<string | null>(null)

const viewTypes = [
  { value: 'day', label: 'День', icon: CalendarDays },
  { value: 'week', label: 'Неделя', icon: CalendarRange },
  { value: 'month', label: 'Месяц', icon: Calendar },
  { value: 'year', label: 'Год', icon: Columns },
]

function setView(v: string) {
  calendarStore.setView(v as any)
  viewMenuOpen.value = false
}

const currentTimePx = computed(() => {
  const now = dayjs()
  return (now.hour() * 60 + now.minute()) * (60 / 60) // 60px per hour
})

const earlyHours = [0, 1, 2, 3, 4, 5]
const mainHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const lateHours = [21, 22, 23]

// Week strip for day view
const weekDays = computed(() => {
  const current = dayjs(calendarStore.currentDate)
  const startOfWeek = current.startOf('week')
  return Array.from({ length: 7 }, (_, i) => {
    const d = startOfWeek.add(i, 'day')
    return {
      date: d.format('YYYY-MM-DD'),
      dayName: d.format('dd')[0],
      dayNum: d.format('D'),
      isToday: d.format('YYYY-MM-DD') === todayStr,
    }
  })
})

const weekViewDays = computed(() => {
  const current = dayjs(calendarStore.currentDate)
  const startOfWeek = current.startOf('week')
  return Array.from({ length: 7 }, (_, i) => {
    const d = startOfWeek.add(i, 'day')
    return {
      date: d.format('YYYY-MM-DD'),
      dayName: d.format('dd').substring(0, 2),
      dayNum: d.format('D'),
      isToday: d.format('YYYY-MM-DD') === todayStr,
    }
  })
})

function getHourTasks(hour: number) {
  return tasksStore.getTasksForDate(calendarStore.currentDate).filter(t => {
    if (!t.dueTime) return false
    const h = parseInt(t.dueTime.split(':')[0])
    return h === hour
  })
}

function getDateHourTasks(date: string, hour: number) {
  return tasksStore.getTasksForDate(date).filter(t => {
    if (!t.dueTime) return false
    const h = parseInt(t.dueTime.split(':')[0])
    return h === hour
  })
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
    none: '#8E8E93',
  }
  return colors[priority] || '#8E8E93'
}

// Month cells
const monthCells = computed(() => {
  const d = dayjs(calendarStore.currentDate)
  const startOfMonth = d.startOf('month')
  const endOfMonth = d.endOf('month')
  const startDow = (startOfMonth.day() + 6) % 7  // Mon = 0

  const cells = []
  for (let i = 0; i < startDow; i++) {
    const day = startOfMonth.subtract(startDow - i, 'day')
    cells.push({ date: day.format('YYYY-MM-DD'), day: day.date(), isCurrentMonth: false, isToday: false })
  }
  for (let i = 1; i <= endOfMonth.date(); i++) {
    const day = d.date(i)
    cells.push({
      date: day.format('YYYY-MM-DD'),
      day: i,
      isCurrentMonth: true,
      isToday: day.format('YYYY-MM-DD') === todayStr,
    })
  }
  return cells
})

function getDateDots(date?: string) {
  if (!date) return []
  const tasks = tasksStore.getTasksForDate(date)
  return tasks.slice(0, 3).map(t => getPriorityColor(t.priority))
}

// Year months
const yearMonths = computed(() => {
  const year = parseInt(calendarStore.currentDate.substring(0, 4))
  const monthNames = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
  return Array.from({ length: 12 }, (_, i) => {
    const m = dayjs().year(year).month(i)
    const startDow = (m.startOf('month').day() + 6) % 7
    const cells = []
    for (let j = 0; j < startDow; j++) cells.push({ day: null, isToday: false })
    for (let j = 1; j <= m.daysInMonth(); j++) {
      const d = m.date(j)
      cells.push({ day: j, isToday: d.format('YYYY-MM-DD') === todayStr })
    }
    return { index: i, name: monthNames[i], cells }
  })
})

function goToMonth(monthIndex: number) {
  const year = parseInt(calendarStore.currentDate.substring(0, 4))
  calendarStore.setDate(dayjs().year(year).month(monthIndex).date(1).format('YYYY-MM-DD'))
  calendarStore.setView('month')
}
</script>
