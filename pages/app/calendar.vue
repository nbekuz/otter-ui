<template>
  <div
    class="page-container flex min-h-0 flex-col overflow-hidden bg-sber-gray-light max-lg:h-dvh max-lg:max-h-dvh lg:h-full lg:min-h-0 lg:pb-0"
  >
    <!-- Header: вне прокрутки — на мобильных шапка не «уезжает» (раньше ломалось из‑за скролла родителя layout). -->
    <div class="page-header-top relative z-40 shrink-0 bg-white shadow-sm px-4 pb-2">
      <div class="mb-2 flex items-center justify-end gap-2">
        <button class="rounded-xl bg-sber-green-light px-3 py-1.5 text-xs font-semibold text-sber-green"
                @click="calendarStore.goToday()">
          Сегодня
        </button>
        <div ref="viewMenuRef" class="relative">
          <button class="flex h-8 w-8 items-center justify-center" @click.stop="viewMenuOpen = !viewMenuOpen">
            <LayoutGrid class="h-5 w-5 text-sber-gray" />
          </button>
          <Transition name="slide-down">
            <div v-if="viewMenuOpen"
                 class="absolute right-0 top-full z-50 mt-1 min-w-[10rem] rounded-2xl bg-white p-2 shadow-modal">
              <button v-for="v in viewTypes" :key="v.value"
                      class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                      :class="calendarStore.viewType === v.value ? 'bg-sber-green-light text-sber-green' : 'text-sber-black'"
                      @click="setView(v.value)">
                <component :is="v.icon" class="h-4 w-4" />
                {{ v.label }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-sber-gray-light"
                @click="calendarStore.goPrev()">
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>

        <div v-if="calendarStore.viewType === 'day'" class="flex gap-1">
          <button v-for="day in weekDays" :key="day.date"
                  class="flex h-12 w-10 flex-col items-center justify-center gap-0.5 rounded-xl transition-all"
                  :class="day.date === calendarStore.currentDate
                    ? 'bg-sber-green text-white'
                    : day.isToday ? 'bg-sber-green-light text-sber-green' : 'text-sber-gray'"
                  @click="calendarStore.setDate(day.date)">
            <span class="text-[10px] font-medium">{{ day.dayName }}</span>
            <span class="text-sm font-bold">{{ day.dayNum }}</span>
          </button>
        </div>

        <div v-else class="px-2 text-center text-lg font-bold text-sber-black">
          {{ calendarStore.displayLabel }}
        </div>

        <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-sber-gray-light"
                @click="calendarStore.goNext()">
          <ChevronRight class="h-5 w-5 text-sber-black" />
        </button>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <!-- DAY VIEW -->
      <div v-if="calendarStore.viewType === 'day'" class="relative">
      <!-- Untimed tasks -->
      <div v-if="dayUntimedTasks.length" class="border-b border-sber-gray-light bg-white px-3 py-2">
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="task in dayUntimedTasks"
            :key="task.id"
            class="flex max-w-full items-center gap-1.5 rounded-xl border px-2 py-1 text-xs"
            :class="task.completed ? 'opacity-45' : ''"
            :style="{
              backgroundColor: getPriorityColor(task.priority) + '18',
              borderColor: getPriorityColor(task.priority) + '40',
            }"
            draggable="true"
            @dragstart.stop="startWeekTaskDrag($event, task.id)"
            @dragend="endWeekTaskDrag"
            @click.stop="handleTaskCardClick(task.id)"
          >
            <button
              type="button"
              class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
              :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
              @click.stop="toggleTaskComplete(task.id)"
            >
              <Check v-if="task.completed" class="h-2 w-2 text-white" />
            </button>
            <span class="truncate font-medium text-sber-black">{{ task.title }}</span>
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
        <div v-if="!calendarStore.collapsedEarlyHours" ref="earlyTimelineRef" class="relative">
          <div v-for="h in earlyHours" :key="h" class="flex min-h-[50px]">
            <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
              {{ String(h).padStart(2, '0') }}:00
            </div>
            <div
              class="flex-1 cursor-pointer border-t border-sber-gray-light"
              @click="openNewTaskFromCalendar(h)"
              @dragenter.prevent
              @dragover.prevent
              @drop.prevent.stop="handleDayHourDrop($event, h)"
            />
          </div>
          <div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14">
            <div
              v-for="task in earlyTimelineTasks"
              :key="task.id"
              class="pointer-events-auto absolute left-1 right-1 cursor-grab touch-none select-none overflow-hidden rounded-xl px-2 py-1"
              :class="task.completed ? 'opacity-45' : ''"
              :style="{
                top: `${task.topPx}px`,
                height: `${task.heightPx}px`,
                zIndex: dragPreview?.taskId === task.id ? 35 : 1,
                backgroundColor: getPriorityColor(task.priority) + '20',
                borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
              }"
              @pointerdown.stop.prevent="startTaskMove($event, task)"
              @click.stop.prevent="handleTaskCardClick(task.id)"
            >
              <div class="flex items-start gap-1">
                <button
                  type="button"
                  class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                  :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                  @click.stop="toggleTaskComplete(task.id)"
                  @pointerdown.stop
                >
                  <Check v-if="task.completed" class="h-2 w-2 text-white" />
                </button>
                <p class="truncate text-xs font-medium text-sber-black">{{ task.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main hours (06:00–21:00) -->
      <div ref="mainTimelineRef" class="relative" @click="openNewTaskFromMainTimeline">
        <div
          v-if="calendarStore.currentDate === todayStr && isCurrentTimeInMainRange"
          class="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center"
          :style="{ transform: `translateY(${currentMainTimePx}px)` }"
        >
          <div class="w-14 flex-shrink-0" />
          <div class="relative flex-1">
            <div class="absolute left-0 right-0 flex items-center">
              <div class="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div class="flex-1 h-0.5 bg-red-500" />
            </div>
          </div>
        </div>

        <div v-for="h in mainHours" :key="h" class="flex min-h-[60px]">
          <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
            {{ String(h).padStart(2, '0') }}:00
          </div>
          <div
            class="flex-1 cursor-pointer border-t border-sber-gray-light"
            @dragenter.prevent
            @dragover.prevent
            @drop.prevent.stop="handleDayHourDrop($event, h)"
          />
        </div>

        <div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14">
          <div
            v-for="task in dayTimelineTasks"
            :key="task.id"
            class="pointer-events-auto absolute cursor-grab touch-none select-none overflow-hidden rounded-xl px-3 py-2 transition-opacity active:opacity-70"
            :class="task.completed ? 'opacity-45' : ''"
            :style="{
              ...dayTimelineTaskHorizontalStyle(task.layoutCols, task.layoutCol),
              top: `${task.topPx}px`,
              height: `${task.heightPx}px`,
              zIndex: dragPreview?.taskId === task.id ? 35 : 1,
              backgroundColor: getPriorityColor(task.priority) + '20',
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
            }"
            @pointerdown.stop.prevent="startTaskMove($event, task)"
            @click.stop.prevent="handleTaskCardClick(task.id)"
          >
            <button
              type="button"
              class="absolute left-1/2 top-0 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-start justify-center pt-1"
              aria-label="Изменить начало"
              @pointerdown.stop.prevent="startTaskResize($event, task, 'start')"
            >
              <span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50" />
            </button>
            <div class="pointer-events-none relative z-10 flex items-start gap-1">
              <button
                type="button"
                class="pointer-events-auto mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                @click.stop="toggleTaskComplete(task.id)"
                @pointerdown.stop
              >
                <Check v-if="task.completed" class="h-2 w-2 text-white" />
              </button>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold" :style="{ color: getPriorityColor(task.priority) }">
                  {{ task.labelTime }}
                </p>
                <p class="truncate text-xs font-medium text-sber-black">{{ task.title }}</p>
              </div>
            </div>
            <button
              type="button"
              class="absolute bottom-0 left-1/2 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-end justify-center pb-1"
              aria-label="Изменить конец"
              @pointerdown.stop.prevent="startTaskResize($event, task, 'end')"
            >
              <span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50" />
            </button>
          </div>
        </div>
      </div>

      <!-- Late hours toggle -->
      <div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"
           @click="calendarStore.toggleLateHours()">
        <div class="w-14 text-xs text-sber-gray text-right pr-3">22–00</div>
        <div class="flex-1 h-px bg-sber-gray-mid" />
        <component :is="calendarStore.collapsedLateHours ? ChevronDown : ChevronUp"
                   class="w-4 h-4 text-sber-gray ml-2" />
      </div>

      <Transition name="slide-down">
        <div v-if="!calendarStore.collapsedLateHours" ref="lateTimelineRef" class="relative">
          <div v-for="h in lateHours" :key="h" class="flex min-h-[50px]">
            <div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">
              {{ String(h).padStart(2, '0') }}:00
            </div>
            <div
              class="flex-1 cursor-pointer border-t border-sber-gray-light px-1"
              @click="openNewTaskFromCalendar(h)"
              @dragenter.prevent
              @dragover.prevent
              @drop.prevent.stop="handleDayHourDrop($event, h)"
            />
          </div>
          <div class="border-t border-sber-gray-light" />
          <div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14">
            <div
              v-for="task in lateTimelineTasks"
              :key="task.id"
              class="pointer-events-auto absolute left-1 right-1 cursor-grab touch-none select-none overflow-hidden rounded-xl px-2 py-1"
              :class="task.completed ? 'opacity-45' : ''"
              :style="{
                top: `${task.topPx}px`,
                height: `${task.heightPx}px`,
                zIndex: dragPreview?.taskId === task.id ? 35 : 1,
                backgroundColor: getPriorityColor(task.priority) + '20',
                borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
              }"
              @pointerdown.stop.prevent="startTaskMove($event, task)"
              @click.stop.prevent="handleTaskCardClick(task.id)"
            >
              <div class="flex items-start gap-1">
                <button
                  type="button"
                  class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                  :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                  @click.stop="toggleTaskComplete(task.id)"
                  @pointerdown.stop
                >
                  <Check v-if="task.completed" class="h-2 w-2 text-white" />
                </button>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-semibold" :style="{ color: getPriorityColor(task.priority) }">
                    {{ formatTaskScheduleLabel(task) }}
                  </p>
                  <p class="truncate text-xs font-medium text-sber-black">{{ task.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      </div>

      <!-- WEEK VIEW -->
      <div v-else-if="calendarStore.viewType === 'week'" class="p-2">
      <div class="mb-1 flex gap-1">
        <div class="w-14 flex-shrink-0" />
        <div v-for="day in weekViewDays" :key="day.date" class="flex-1 cursor-pointer text-center" @click="goToDayView(day.date)">
          <p class="text-[10px] text-sber-gray">{{ day.dayName }}</p>
          <div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full"
               :class="day.isToday ? 'bg-sber-green text-white' : 'text-sber-black'">
            <span class="text-sm font-bold">{{ day.dayNum }}</span>
          </div>
        </div>
      </div>
      <div class="mb-1 flex gap-1">
        <div class="w-14 flex-shrink-0" />
        <div
          v-for="day in weekViewDays"
          :key="`untimed-${day.date}`"
          class="flex min-h-[28px] flex-1 flex-wrap gap-0.5 border-b border-[#c8cfdb] px-0.5 py-0.5"
        >
          <div
            v-for="task in getUntimedTasksForDate(day.date)"
            :key="task.id"
            class="flex max-w-full items-center gap-0.5 truncate rounded border px-1 py-0.5 text-[8px]"
            :class="task.completed ? 'opacity-45' : ''"
            :style="{ backgroundColor: getPriorityColor(task.priority) + '22' }"
            draggable="true"
            @dragstart.stop="startWeekTaskDrag($event, task.id)"
            @dragend="endWeekTaskDrag"
            @click.stop="selectedTaskId = task.id"
          >
            <button
              type="button"
              class="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border"
              :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
              @click.stop="toggleTaskComplete(task.id)"
            >
              <Check v-if="task.completed" class="h-1.5 w-1.5 text-white" />
            </button>
            <span class="truncate">{{ task.title }}</span>
          </div>
        </div>
      </div>
      <!-- Hours -->
      <div class="overflow-hidden rounded-2xl border border-[#c8cfdb] bg-white/45">
        <div class="flex">
          <div class="w-14 flex-shrink-0">
            <div
              v-for="h in weekHours"
              :key="h"
              class="h-[48px] border-t border-[#c8cfdb] pr-2 pt-1 text-right text-xs text-sber-gray first:border-t-0"
            >
              {{ String(h).padStart(2, '0') }}:00
            </div>
          </div>
          <div
            v-for="day in weekViewDays"
            :key="day.date"
            class="relative flex-1 border-l border-[#c8cfdb]"
          >
            <div
              v-for="h in weekHours"
              :key="h"
              class="h-[48px] cursor-pointer border-t border-[#c8cfdb] first:border-t-0"
              @click="openNewTaskFromWeekCell(day.date, h)"
              @dragenter.prevent
              @dragover.prevent
              @drop.prevent.stop="handleWeekCellDrop($event, day.date, h)"
            />
            <div
              v-for="task in getWeekDayTimelineTasks(day.date)"
              :key="task.id"
              class="absolute left-0.5 right-0.5 cursor-move overflow-hidden rounded border border-[#c8cfdb] px-1 py-0.5"
              :class="task.completed ? 'opacity-45' : ''"
              :style="{
                top: `${task.topPx}px`,
                height: `${task.heightPx}px`,
                backgroundColor: getPriorityColor(task.priority) + '22',
              }"
              draggable="true"
              @dragstart.stop="startWeekTaskDrag($event, task.id)"
              @dragend="endWeekTaskDrag"
              @click="selectedTaskId = task.id"
            >
              <div class="flex items-start gap-0.5">
                <button
                  type="button"
                  class="mt-px flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border"
                  :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                  @click.stop="toggleTaskComplete(task.id)"
                >
                  <Check v-if="task.completed" class="h-1.5 w-1.5 text-white" />
                </button>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[9px] font-semibold text-sber-black">{{ formatTaskScheduleLabel(task) }}</p>
                  <p class="truncate text-[9px] font-medium text-sber-black">{{ task.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- MONTH VIEW -->
      <div v-else-if="calendarStore.viewType === 'month'" class="p-2">
        <!-- Weekday headers -->
        <div class="mb-1 grid grid-cols-7 gap-1">
          <div v-for="d in ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']" :key="d"
               class="py-1 text-center text-[10px] font-semibold text-sber-gray">
            {{ d }}
          </div>
        </div>
        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="cell in monthCells"
            :key="cell.date || cell.empty"
            class="relative aspect-square overflow-hidden rounded-xl border border-[#c8cfdb] p-1 transition-colors"
            :class="[
              !cell.isCurrentMonth ? 'opacity-35' : '',
              cell.date === calendarStore.currentDate ? 'bg-sber-green-light/70' :
              cell.isToday ? 'bg-sber-green-light/40' : 'bg-white/40 hover:bg-sber-gray-light',
            ]"
            @dragenter.prevent
            @dragover.prevent
            @drop.prevent.stop="cell.date && handleMonthCellDrop($event, cell.date)"
            @click="cell.date && handleMonthCellClick(cell.date, $event)"
          >
            <div class="flex items-center justify-between">
              <span
                data-month-day
                class="inline-flex h-5 min-w-[1.25rem] cursor-pointer items-center justify-center rounded-full px-1 text-[10px] font-bold"
                :class="cell.isToday ? 'bg-sber-green text-white' : 'text-sber-black'"
                @click.stop="cell.date && goToWeekView(cell.date)"
              >
                {{ cell.day }}
              </span>
            </div>

            <div class="mt-1 space-y-0.5">
              <div
                v-for="task in getMonthCellTasks(cell.date)"
                :key="task.id"
                data-month-task
                class="flex items-center gap-0.5 truncate rounded border border-[#c8cfdb] px-1 py-0.5 text-[9px] font-medium text-sber-black"
                :class="task.completed ? 'opacity-45' : ''"
                :style="{ backgroundColor: getPriorityColor(task.priority) + '20' }"
                draggable="true"
                @dragstart.stop="startWeekTaskDrag($event, task.id)"
                @dragend="endWeekTaskDrag"
                @click.stop="selectedTaskId = task.id"
              >
                <button
                  type="button"
                  class="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border"
                  :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                  @click.stop="toggleTaskComplete(task.id)"
                >
                  <Check v-if="task.completed" class="h-1.5 w-1.5 text-white" />
                </button>
                <span class="truncate">{{ task.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- YEAR VIEW -->
      <div v-else-if="calendarStore.viewType === 'year'" class="p-2">
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
    </div>

    <!-- Task detail -->
    <TasksTaskDetailModal
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
      @saved="refreshCalendarTasks"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  LayoutGrid, CalendarDays, Calendar, CalendarRange, Columns, Check,
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Task } from '~/data/mockData'
import {
  addMinutesToTime,
  formatMinutesToTime,
  getTaskScheduleStart,
  parseTimeToMinutes,
} from '~/utils/time'

definePageMeta({ layout: 'app' })

const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()

const todayStr = dayjs().format('YYYY-MM-DD')
const viewMenuOpen = ref(false)
const viewMenuRef = ref<HTMLElement | null>(null)
const selectedTaskId = ref<string | null>(null)

onClickOutside(viewMenuRef, () => {
  viewMenuOpen.value = false
})

const dayUntimedTasks = computed(() => getUntimedTasksForDate(calendarStore.currentDate))
const mainTimelineRef = ref<HTMLElement | null>(null)

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
const isCurrentTimeInMainRange = computed(() => {
  const now = dayjs()
  const nowMinutes = now.hour() * 60 + now.minute()
  return nowMinutes >= mainStartMinutes && nowMinutes <= mainEndMinutes
})
const currentMainTimePx = computed(() => {
  const now = dayjs()
  const nowMinutes = now.hour() * 60 + now.minute()
  return Math.max(0, nowMinutes - mainStartMinutes) * minuteHeightPx
})

const earlyHours = [0, 1, 2, 3, 4, 5]
const mainHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const lateHours = [22, 23]
const weekHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const weekHourHeightPx = 48
const weekStartHour = weekHours[0]
const earlyStartMinutes = 0
const earlyEndMinutes = earlyHours.length * 60
const lateStartMinutes = lateHours[0] * 60
const lateEndMinutes = 24 * 60
const mainStartMinutes = mainHours[0] * 60
const mainEndMinutes = (mainHours[mainHours.length - 1] + 1) * 60
const minuteHeightPx = 1
const earlyLateMinuteHeightPx = 50 / 60
const minDurationMinutes = 10
const draggingWeekTaskId = ref<string | null>(null)

type DragMode = 'move' | 'resize-start' | 'resize-end'

const dragState = ref<{
  taskId: string
  mode: DragMode
  startY: number
  initialStart: number
  initialEnd: number
  hadDuration: boolean
  captureEl: HTMLElement | null
  pointerId: number | null
  pxPerMinute: number
} | null>(null)
const dragPreview = ref<{ taskId: string; start: number; end: number } | null>(null)
const didDrag = ref(false)
/**
 * После реального перетаскивания часто приходит лишний click (ghost click на touch).
 * Один такой клик по карточке игнорируем; таймер сбрасывает флаг, если click не пришёл.
 */
const ignoreNextTaskCardClick = ref(false)
let postDragClickIgnoreTimer: ReturnType<typeof setTimeout> | null = null

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
    const start = getTaskScheduleStart(t)
    if (!start) return false
    const h = parseInt(start.split(':')[0])
    return h === hour
  })
}

/** Полуинтервалы [start, end) в минутах — пересечение по времени показа. */
function intervalsOverlapHalfOpen(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Раскладка «как в календаре»: пересекающиеся по времени задачи — в одной связной группе,
 * ширина делится на число одновременных слотов; внутри группы — колонки без наложения.
 */
function assignDayTimelineOverlapLayout(
  segments: Array<{ id: string; rawStart: number; rawEnd: number }>,
): Map<string, { col: number; cols: number }> {
  const layout = new Map<string, { col: number; cols: number }>()
  const n = segments.length
  if (n === 0) return layout

  const visited = new Array(n).fill(false)

  for (let startIdx = 0; startIdx < n; startIdx++) {
    if (visited[startIdx]) continue

    const stack: number[] = [startIdx]
    visited[startIdx] = true
    const comp: number[] = []

    while (stack.length) {
      const u = stack.pop()!
      comp.push(u)
      for (let v = 0; v < n; v++) {
        if (visited[v]) continue
        const su = segments[u]
        const sv = segments[v]
        if (intervalsOverlapHalfOpen(su.rawStart, su.rawEnd, sv.rawStart, sv.rawEnd)) {
          visited[v] = true
          stack.push(v)
        }
      }
    }

    const endpoints: Array<{ t: number; d: number }> = []
    for (const idx of comp) {
      const s = segments[idx]
      endpoints.push({ t: s.rawStart, d: 1 })
      endpoints.push({ t: s.rawEnd, d: -1 })
    }
    endpoints.sort((a, b) => (a.t !== b.t ? a.t - b.t : a.d - b.d))
    let sweep = 0
    let maxConc = 0
    for (const e of endpoints) {
      sweep += e.d
      maxConc = Math.max(maxConc, sweep)
    }
    const cols = Math.max(1, maxConc)

    const sortedIdx = [...comp].sort((ai, bi) => {
      const a = segments[ai]
      const b = segments[bi]
      if (a.rawStart !== b.rawStart) return a.rawStart - b.rawStart
      return b.rawEnd - a.rawEnd
    })

    const columnEnds: number[] = []
    for (const idx of sortedIdx) {
      const t = segments[idx]
      let col = columnEnds.findIndex(end => end <= t.rawStart)
      if (col === -1) {
        col = columnEnds.length
        columnEnds.push(t.rawEnd)
      } else {
        columnEnds[col] = t.rawEnd
      }
      layout.set(t.id, { col, cols })
    }
  }

  return layout
}

function dayTimelineTaskHorizontalStyle(layoutCols: number, layoutCol: number): Record<string, string> {
  const pad = 4
  const gap = 3
  if (layoutCols <= 1) {
    return { left: `${pad}px`, right: `${pad}px` }
  }
  const gapsTotal = gap * (layoutCols - 1)
  const innerPx = 2 * pad + gapsTotal
  return {
    left: `calc(${pad}px + (100% - ${innerPx}px) * ${layoutCol} / ${layoutCols} + ${gap * layoutCol}px)`,
    width: `calc((100% - ${innerPx}px) / ${layoutCols})`,
    right: 'auto',
  }
}

const dayTimelineTasks = computed(() => {
  const base = tasksStore.getTasksForDate(calendarStore.currentDate)
    .filter(t => !!getTaskScheduleStart(t))
    .map((task) => {
      const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null
      const scheduleStart = getTaskScheduleStart(task) || '00:00'
      const startMinutes = preview ? preview.start : parseTimeToMinutes(scheduleStart)
      const durationMinutes = preview ? (preview.end - preview.start) : getTaskDurationMinutes(task)
      const endMinutes = Math.min(startMinutes + durationMinutes, mainEndMinutes)
      const clippedStart = Math.max(startMinutes, mainStartMinutes)
      const clippedDuration = Math.max(endMinutes - clippedStart, 15)

      const labelTime = preview
        ? `${formatMinutesToTime(preview.start)} – ${formatMinutesToTime(preview.end)}`
        : task.duration?.start && task.duration?.end
          ? `${task.duration.start} – ${task.duration.end}`
          : (getTaskScheduleStart(task) || '')

      return {
        ...task,
        rawStart: startMinutes,
        rawEnd: startMinutes + durationMinutes,
        labelTime,
        topPx: (clippedStart - mainStartMinutes) * minuteHeightPx,
        heightPx: clippedDuration * minuteHeightPx,
      }
    })
    .filter(task => task.topPx < (mainEndMinutes - mainStartMinutes) * minuteHeightPx)

  const layout = assignDayTimelineOverlapLayout(
    base.map(t => ({ id: t.id, rawStart: t.rawStart, rawEnd: t.rawEnd })),
  )

  return base.map((task) => {
    const slot = layout.get(task.id) ?? { col: 0, cols: 1 }
    return {
      ...task,
      layoutCol: slot.col,
      layoutCols: slot.cols,
    }
  })
})

function getDateHourTasks(date: string, hour: number) {
  return tasksStore.getTasksForDate(date).filter(t => {
    const start = getTaskScheduleStart(t)
    if (!start) return false
    const h = parseInt(start.split(':')[0])
    return h === hour
  })
}

function buildSectionTimelineTasks(
  rangeStart: number,
  rangeEnd: number,
  pxPerMinute: number,
  hourFilter: (hour: number) => boolean,
) {
  return tasksStore.getTasksForDate(calendarStore.currentDate)
    .filter(t => !!getTaskScheduleStart(t))
    .map((task) => {
      const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null
      const scheduleStart = getTaskScheduleStart(task) || '00:00'
      const startMinutes = preview ? preview.start : parseTimeToMinutes(scheduleStart)
      const startHour = Math.floor(startMinutes / 60)
      if (!hourFilter(startHour)) return null

      const durationMinutes = preview ? (preview.end - preview.start) : getTaskDurationMinutes(task)
      const endMinutes = startMinutes + durationMinutes
      if (endMinutes <= rangeStart || startMinutes >= rangeEnd) return null

      const clippedStart = Math.max(startMinutes, rangeStart)
      const clippedEnd = Math.min(endMinutes, rangeEnd)
      const clippedDuration = Math.max(clippedEnd - clippedStart, 15)

      return {
        ...task,
        rawStart: startMinutes,
        rawEnd: endMinutes,
        topPx: (clippedStart - rangeStart) * pxPerMinute,
        heightPx: clippedDuration * pxPerMinute,
      }
    })
    .filter((task): task is Task & { rawStart: number; rawEnd: number; topPx: number; heightPx: number } => !!task)
}

const earlyTimelineTasks = computed(() =>
  buildSectionTimelineTasks(earlyStartMinutes, earlyEndMinutes, earlyLateMinuteHeightPx, h => h < 6),
)

const lateTimelineTasks = computed(() =>
  buildSectionTimelineTasks(lateStartMinutes, lateEndMinutes, earlyLateMinuteHeightPx, h => h >= 22),
)

function getWeekDayTimelineTasks(date: string) {
  return tasksStore.getTasksForDate(date)
    .filter(t => !!getTaskScheduleStart(t))
    .map((task) => {
      const scheduleStart = getTaskScheduleStart(task) || '00:00'
      const startMinutes = parseTimeToMinutes(scheduleStart)
      const startHour = Math.floor(startMinutes / 60)
      if (!weekHours.includes(startHour)) return null

      const durationMinutes = getTaskDurationMinutes(task)
      const topPx = ((startMinutes - weekStartHour * 60) / 60) * weekHourHeightPx
      const heightPx = Math.max((durationMinutes / 60) * weekHourHeightPx, weekHourHeightPx * 0.5)

      return { ...task, topPx, heightPx }
    })
    .filter((task): task is Task & { topPx: number; heightPx: number } => !!task)
}

function formatTaskScheduleLabel(task: Task) {
  if (task.duration?.start && task.duration?.end) {
    return `${task.duration.start} – ${task.duration.end}`
  }
  return getTaskScheduleStart(task) || ''
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

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step
}

function getTaskDurationMinutes(task: { dueTime?: string; duration?: { start: string; end: string } }) {
  if (task.duration?.start && task.duration?.end) {
    const start = parseTimeToMinutes(task.duration.start)
    const end = parseTimeToMinutes(task.duration.end)
    if (end > start) return end - start
  }
  return 60
}

function snapMinutes(minutes: number) {
  return Math.round(minutes / 5) * 5
}

function clampMoveStart(start: number, duration: number) {
  const min = 0
  const max = 24 * 60 - duration
  return Math.max(min, Math.min(max, start))
}

function startTaskMove(event: PointerEvent, task: Task & { rawStart: number; rawEnd: number }) {
  initDrag(event, task, 'move')
}

function startTaskResize(event: PointerEvent, task: Task & { rawStart: number; rawEnd: number }, edge: 'start' | 'end') {
  initDrag(event, task, edge === 'start' ? 'resize-start' : 'resize-end')
}

function resolveDragPxPerMinute(startMinutes: number) {
  if (startMinutes < mainStartMinutes) return earlyLateMinuteHeightPx
  if (startMinutes >= lateStartMinutes) return earlyLateMinuteHeightPx
  return minuteHeightPx
}

function initDrag(event: PointerEvent, task: Task & { rawStart: number; rawEnd: number }, mode: DragMode) {
  const captureEl = (event.currentTarget as HTMLElement | null) ?? null
  const pointerId = event.pointerId
  if (captureEl?.setPointerCapture) {
    try {
      captureEl.setPointerCapture(pointerId)
    } catch {
      /* ignore */
    }
  }

  dragState.value = {
    taskId: task.id,
    mode,
    startY: event.clientY,
    initialStart: task.rawStart,
    initialEnd: task.rawEnd,
    hadDuration: !!task.duration,
    captureEl,
    pointerId,
    pxPerMinute: resolveDragPxPerMinute(task.rawStart),
  }
  didDrag.value = false
  dragPreview.value = { taskId: task.id, start: task.rawStart, end: task.rawEnd }

  window.addEventListener('pointermove', handleDragMove, { passive: false })
  window.addEventListener('pointerup', handleDragEnd)
  window.addEventListener('pointercancel', handleDragEnd)
}

function handleDragMove(event: PointerEvent) {
  if (!dragState.value) return
  event.preventDefault()

  const rawDeltaMinutes = (event.clientY - dragState.value.startY) / dragState.value.pxPerMinute
  if (Math.abs(rawDeltaMinutes) >= 1.5) {
    didDrag.value = true
  }

  let nextStart = dragState.value.initialStart
  let nextEnd = dragState.value.initialEnd

  if (dragState.value.mode === 'move') {
    const duration = dragState.value.initialEnd - dragState.value.initialStart
    nextStart = clampMoveStart(dragState.value.initialStart + rawDeltaMinutes, duration)
    nextStart = snapMinutes(nextStart)
    nextEnd = nextStart + duration
  } else if (dragState.value.mode === 'resize-start') {
    nextStart = Math.max(0, Math.min(dragState.value.initialEnd - minDurationMinutes, dragState.value.initialStart + rawDeltaMinutes))
    nextStart = snapMinutes(nextStart)
  } else {
    nextEnd = Math.min(24 * 60, Math.max(dragState.value.initialStart + minDurationMinutes, dragState.value.initialEnd + rawDeltaMinutes))
    nextEnd = snapMinutes(nextEnd)
  }

  dragPreview.value = {
    taskId: dragState.value.taskId,
    start: nextStart,
    end: nextEnd,
  }
}

function finishDragInteraction() {
  if (didDrag.value) {
    ignoreNextTaskCardClick.value = true
    if (postDragClickIgnoreTimer) clearTimeout(postDragClickIgnoreTimer)
    postDragClickIgnoreTimer = setTimeout(() => {
      ignoreNextTaskCardClick.value = false
      postDragClickIgnoreTimer = null
    }, 450)
  }
  didDrag.value = false
  dragState.value = null
  dragPreview.value = null
  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', handleDragEnd)
  window.removeEventListener('pointercancel', handleDragEnd)
}

function handleDragEnd() {
  if (!dragState.value) return

  const state = dragState.value
  if (state.captureEl && state.pointerId != null) {
    try {
      if (state.captureEl.hasPointerCapture(state.pointerId)) {
        state.captureEl.releasePointerCapture(state.pointerId)
      }
    } catch {
      /* ignore */
    }
  }

  const preview = dragPreview.value
  const shouldPersist = preview
    && preview.taskId === state.taskId
    && (preview.start !== state.initialStart || preview.end !== state.initialEnd)

  if (!shouldPersist) {
    finishDragInteraction()
    return
  }

  const duration = Math.max(minDurationMinutes, preview.end - preview.start)
  const updates: Partial<Task> = {
    duration: {
      start: formatMinutesToTime(preview.start),
      end: formatMinutesToTime(preview.start + duration),
    },
  }

  void tasksStore
    .updateTask(state.taskId, updates, { grouped: false, matrix: false })
    .finally(finishDragInteraction)
}

function handleTaskCardClick(taskId: string) {
  if (dragState.value) return
  if (ignoreNextTaskCardClick.value) {
    ignoreNextTaskCardClick.value = false
    return
  }
  selectedTaskId.value = taskId
}

function refreshCalendarTasks() {
  void tasksStore.fetchCalendar(calendarStore.viewType, calendarStore.currentDate)
}

function getUntimedTasksForDate(date: string) {
  return tasksStore.getTasksForDate(date).filter(t => !getTaskScheduleStart(t))
}

function toggleTaskComplete(taskId: string) {
  void tasksStore.completeTask(taskId, { grouped: false, calendar: false, matrix: false })
}

function goToDayView(date: string) {
  calendarStore.setDate(date)
  calendarStore.setView('day')
}

function goToWeekView(date: string) {
  calendarStore.setDate(date)
  calendarStore.setView('week')
}

function handleMonthCellClick(date: string, event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-month-day]') || target.closest('[data-month-task]')) return
  openNewTaskFromMonthCell(date)
}

function openNewTaskFromMonthCell(date: string) {
  const returnTo = encodeURIComponent(`/app/calendar?view=month&date=${date}`)
  navigateTo(`/app/new-task?returnTo=${returnTo}&dueDate=${date}`)
}

function openNewTaskFromWeekCell(date: string, hour: number) {
  const slotStart = `${String(hour).padStart(2, '0')}:00`
  const returnTo = encodeURIComponent(`/app/calendar?view=week&date=${date}`)
  const slotEnd = addMinutesToTime(slotStart, 60)
  navigateTo(`/app/new-task?returnTo=${returnTo}&dueDate=${date}&dueTime=${slotStart}&durationStart=${slotStart}&durationEnd=${slotEnd}`)
}

function handleDayHourDrop(event: DragEvent, hour: number) {
  handleWeekCellDrop(event, calendarStore.currentDate, hour)
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

function getMonthCellTasks(date?: string) {
  if (!date) return []
  return tasksStore.getTasksForDate(date).slice(0, 3)
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

function buildNewTaskFromCalendarQuery(slotStart: string) {
  const slotEnd = addMinutesToTime(slotStart, 60)
  const returnTo = encodeURIComponent(`/app/calendar?view=${calendarStore.viewType}&date=${calendarStore.currentDate}`)
  return `/app/new-task?returnTo=${returnTo}&dueDate=${calendarStore.currentDate}&dueTime=${slotStart}&durationStart=${slotStart}&durationEnd=${slotEnd}`
}

function openNewTaskFromCalendar(hour: number) {
  const slotStart = `${String(hour).padStart(2, '0')}:00`
  navigateTo(buildNewTaskFromCalendarQuery(slotStart))
}

function openNewTaskFromMainTimeline(event: MouseEvent) {
  const container = mainTimelineRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const offsetY = event.clientY - rect.top
  const rawMinutes = mainStartMinutes + Math.floor(offsetY / minuteHeightPx)
  const snappedMinutes = Math.max(mainStartMinutes, Math.min(mainEndMinutes - 1, roundToStep(rawMinutes, 5)))
  navigateTo(buildNewTaskFromCalendarQuery(formatMinutesToTime(snappedMinutes)))
}

function startWeekTaskDrag(event: DragEvent, taskId: string) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
  draggingWeekTaskId.value = taskId
}

function endWeekTaskDrag() {
  draggingWeekTaskId.value = null
}

function handleWeekCellDrop(event: DragEvent, date: string, hour: number) {
  const draggedTaskId = draggingWeekTaskId.value || event.dataTransfer?.getData('text/plain') || null
  if (!draggedTaskId) return

  const task = tasksStore.tasks.find(t => t.id === draggedTaskId)
  if (!task) {
    draggingWeekTaskId.value = null
    return
  }

  const scheduleStart = getTaskScheduleStart(task)
  const currentMinutes = scheduleStart ? parseTimeToMinutes(scheduleStart) % 60 : 0
  const nextStartMinutes = hour * 60 + currentMinutes
  const durationMinutes = getTaskDurationMinutes(task)
  const dayEndMinutes = 24 * 60 - 1
  const nextEndMinutes = Math.min(nextStartMinutes + durationMinutes, dayEndMinutes)
  const nextStart = formatMinutesToTime(nextStartMinutes)
  const nextEnd = formatMinutesToTime(nextEndMinutes)

  const updates: Partial<Task> = {
    dueDate: date,
    duration: { start: nextStart, end: nextEnd },
  }

  if (!task.duration && task.dueTime) {
    updates.dueTime = nextStart
  }

  void tasksStore.updateTask(task.id, updates, { grouped: false, matrix: false })
  draggingWeekTaskId.value = null
}

function handleMonthCellDrop(event: DragEvent, date: string) {
  const draggedTaskId = draggingWeekTaskId.value || event.dataTransfer?.getData('text/plain') || null
  if (!draggedTaskId) return

  const task = tasksStore.tasks.find(t => t.id === draggedTaskId)
  if (!task) {
    draggingWeekTaskId.value = null
    return
  }

  void tasksStore.updateTask(task.id, { dueDate: date }, { grouped: false, matrix: false })
  draggingWeekTaskId.value = null
}

watch(
  [() => calendarStore.currentDate, () => calendarStore.viewType],
  ([date, view]) => {
    void tasksStore.fetchCalendar(view, date)
  },
  { immediate: true },
)

watch(
  () => tasksStore.calendarTasks,
  (tasks) => {
    if (calendarStore.viewType !== 'day') return

    const hasLate = tasks.some((task) => {
      const start = getTaskScheduleStart(task)
      if (!start) return false
      const hour = parseInt(start.split(':')[0], 10)
      const endHour = task.duration?.end
        ? parseInt(task.duration.end.split(':')[0], 10)
        : hour
      return hour >= 21 || endHour >= 21
    })
    if (hasLate) {
      calendarStore.collapsedLateHours = false
    }

    const hasEarly = tasks.some((task) => {
      const start = getTaskScheduleStart(task)
      if (!start) return false
      return parseInt(start.split(':')[0], 10) < 6
    })
    if (hasEarly) {
      calendarStore.collapsedEarlyHours = false
    }
  },
  { deep: true },
)
</script>
