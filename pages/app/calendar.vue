<template>
  <div
    class="page-container flex min-h-0 flex-col overflow-hidden bg-sber-gray-light max-lg:h-dvh max-lg:max-h-dvh lg:h-full lg:min-h-0 lg:pb-0"
  >
    <!-- Header: вне прокрутки — на мобильных шапка не «уезжает» (раньше ломалось из‑за скролла родителя layout). -->
    <div class="page-header-top relative z-40 shrink-0 bg-white px-3 pb-3 shadow-sm sm:px-4">
      <!-- Actions: title left, controls right -->
      <div class="mb-3 flex items-center gap-2">
        <div class="min-w-0 flex-1">
          <p class="truncate text-[15px] font-bold leading-tight text-sber-black sm:text-base">
            {{ headerTitle }}
          </p>
          <p
            v-if="calendarStore.viewType === 'day'"
            class="truncate text-[11px] font-medium text-sber-gray sm:text-xs"
          >
            {{ calendarStore.displayLabel }}
          </p>
        </div>
        <NotificationsBell variant="icon" />
        <button
          type="button"
          class="h-10 shrink-0 rounded-full bg-sber-green-light px-3.5 text-xs font-semibold text-sber-green transition-colors active:bg-sber-green/15 sm:px-4"
          @click="calendarStore.goToday()"
        >
          Сегодня
        </button>
        <div ref="viewMenuRef" class="relative shrink-0">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light transition-colors active:bg-sber-gray-mid/40"
            aria-label="Вид календаря"
            @click.stop="viewMenuOpen = !viewMenuOpen"
          >
            <LayoutGrid class="h-5 w-5 text-sber-gray" />
          </button>
          <Transition name="slide-down">
            <div
              v-if="viewMenuOpen"
              class="absolute right-0 top-full z-50 mt-1.5 min-w-[11rem] rounded-2xl bg-white p-2 shadow-modal"
            >
              <button
                v-for="v in viewTypes"
                :key="v.value"
                type="button"
                class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors"
                :class="calendarStore.viewType === v.value ? 'bg-sber-green-light text-sber-green' : 'text-sber-black hover:bg-sber-gray-light'"
                @click="setView(v.value)"
              >
                <component :is="v.icon" class="h-4 w-4 shrink-0" />
                {{ v.label }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Date navigation -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sber-gray-light transition-colors active:bg-sber-gray-mid/40"
          aria-label="Назад"
          @click="calendarStore.goPrev()"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>

        <div
          v-if="calendarStore.viewType === 'day'"
          class="flex min-w-0 flex-1 gap-0.5 sm:gap-1"
        >
          <button
            v-for="day in weekDays"
            :key="day.date"
            type="button"
            class="flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 transition-all active:scale-[0.97]"
            :class="day.date === calendarStore.currentDate
              ? 'bg-sber-green text-white shadow-sm'
              : day.isToday
                ? 'bg-sber-green-light text-sber-green'
                : 'text-sber-gray hover:bg-sber-gray-light'"
            @click="calendarStore.setDate(day.date)"
          >
            <span class="text-[10px] font-semibold uppercase leading-none tracking-wide opacity-80 sm:text-[11px]">
              {{ day.dayName }}
            </span>
            <span class="text-sm font-bold leading-none sm:text-[15px]">{{ day.dayNum }}</span>
          </button>
        </div>

        <div
          v-else
          class="min-w-0 flex-1 px-2 text-center text-base font-bold text-sber-black sm:text-lg"
        >
          {{ calendarStore.displayLabel }}
        </div>

        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sber-gray-light transition-colors active:bg-sber-gray-mid/40"
          aria-label="Вперёд"
          @click="calendarStore.goNext()"
        >
          <ChevronRight class="h-5 w-5 text-sber-black" />
        </button>
      </div>
    </div>

    <!-- Day/Week: pin date + untimed; only the time grid scrolls. Month/Year: whole body scrolls. -->
    <div
      class="flex min-h-0 flex-1 flex-col"
      :class="calendarStore.viewType === 'day' || calendarStore.viewType === 'week'
        ? 'overflow-hidden'
        : 'overflow-y-auto'"
    >
      <!-- DAY VIEW -->
      <div
        v-if="calendarStore.viewType === 'day'"
        class="relative flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <!-- Untimed tasks: pinned above scroll (default ~3 rows, resizable) -->
        <div
          v-if="dayUntimedTasks.length"
          class="z-30 shrink-0 border-b border-sber-gray-mid bg-white shadow-sm"
        >
          <div class="flex items-center justify-between px-3 pt-2">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-sber-gray">Без времени</p>
            <span class="text-[10px] font-medium text-sber-gray">{{ dayUntimedTasks.length }}</span>
          </div>
          <div class="overflow-y-auto px-3 py-1.5" :style="{ height: `${untimedHeightPx}px` }">
            <div class="flex flex-col gap-1.5">
              <div
                v-for="task in dayUntimedTasks"
                :key="`day-untimed-${task.id}`"
                class="flex w-full min-w-0 items-center gap-1.5 rounded-xl border px-2 py-1.5 text-sm font-medium leading-snug text-sber-black"
                :class="task.completed ? 'opacity-45' : ''"
                :style="{
                  backgroundColor: getPriorityColor(task.priority) + '20',
                  borderColor: getPriorityColor(task.priority) + '40',
                  borderLeftWidth: '3px',
                  borderLeftColor: getPriorityColor(task.priority),
                }"
                draggable="true"
                @dragstart.stop="startWeekTaskDrag($event, task.id)"
                @dragend="endWeekTaskDrag"
                @click.stop="handleTaskCardClick(resolveRealTaskId(task.id))"
              >
                <button
                  type="button"
                  class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                  :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                  @click.stop="toggleTaskComplete(task.id)"
                >
                  <Check v-if="task.completed" class="h-2 w-2 text-white" />
                </button>
                <span class="min-w-0 flex-1 truncate">{{ task.title }}</span>
              </div>
            </div>
          </div>
          <div
            class="flex cursor-ns-resize touch-none items-center justify-center py-1 transition-colors hover:bg-sber-gray-light"
            title="Потяните, чтобы изменить высоту"
            @pointerdown.prevent="startUntimedResize"
          >
            <span class="pointer-events-none h-1 w-10 rounded-full bg-sber-gray-mid" />
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto">
          <div ref="dayTimelineRef" class="relative" @click="openNewTaskFromDayTimeline">
            <div
              v-if="calendarStore.currentDate === todayStr"
              class="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center"
              :style="{ transform: `translateY(${currentDayTimePx}px)` }"
            >
              <div class="w-14 flex-shrink-0" />
              <div class="relative flex-1">
                <div class="absolute left-0 right-0 flex items-center">
                  <div class="-ml-1 h-2 w-2 rounded-full bg-red-500" />
                  <div class="h-0.5 flex-1 bg-red-500" />
                </div>
              </div>
            </div>

            <div v-for="h in dayHours" :key="h" class="flex h-[60px]">
              <div class="w-14 flex-shrink-0 border-t border-sber-gray-mid pr-3 pt-1 text-right text-xs text-sber-gray">
                {{ String(h).padStart(2, '0') }}:00
              </div>
              <div
                class="flex-1 cursor-pointer border-t border-sber-gray-mid"
                @click.stop="openNewTaskFromCalendar(h)"
                @dragenter.prevent
                @dragover.prevent
                @drop.prevent.stop="handleDayHourDrop($event, h)"
              />
            </div>
            <div class="border-t border-sber-gray-mid" />

            <div class="pointer-events-none absolute bottom-0 left-14 right-0 top-0">
              <div
                v-for="task in dayTimelineTasks"
                :key="task.id"
                class="pointer-events-auto absolute min-w-0 cursor-grab touch-none select-none overflow-hidden rounded-xl px-3 py-2 transition-opacity active:opacity-70"
                :class="task.completed ? 'opacity-45' : ''"
                :style="{
                  ...dayTimelineTaskHorizontalStyle(task.layoutCols, task.layoutCol),
                  top: `${task.topPx}px`,
                  height: `${task.heightPx}px`,
                  zIndex: (dragPreview?.taskId === task.id ? 35 : 1) + task.layoutCol,
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
                <div class="pointer-events-none relative z-10 flex min-h-0 items-start gap-1">
                  <button
                    type="button"
                    class="pointer-events-auto mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                    :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                    @click.stop="toggleTaskComplete(task.id)"
                    @pointerdown.stop
                  >
                    <Check v-if="task.completed" class="h-2 w-2 text-white" />
                  </button>
                  <div class="min-w-0 flex-1 overflow-hidden">
                    <p class="truncate text-sm font-semibold leading-snug" :style="{ color: getPriorityColor(task.priority) }">
                      {{ task.labelTime }}
                    </p>
                    <p class="truncate text-sm font-medium leading-snug text-sber-black">{{ task.title }}</p>
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
        </div>
      </div>

      <!-- WEEK VIEW -->
      <div
        v-else-if="calendarStore.viewType === 'week'"
        class="relative flex min-h-0 flex-1 flex-col overflow-hidden p-2"
      >
        <!-- Day headers + untimed: pinned -->
        <div class="z-30 shrink-0 bg-sber-gray-light pb-1">
          <div class="mb-1 flex gap-1">
            <div class="w-14 flex-shrink-0" />
            <div
              v-for="day in weekViewDays"
              :key="day.date"
              class="min-w-0 flex-1 cursor-pointer text-center"
              @click="goToDayView(day.date)"
            >
              <p class="text-xs text-sber-gray">{{ day.dayName }}</p>
              <div
                class="mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                :class="day.isToday ? 'bg-sber-green text-white' : 'text-sber-black'"
              >
                <span class="text-sm font-bold">{{ day.dayNum }}</span>
              </div>
            </div>
          </div>

          <template v-if="weekHasUntimedTasks">
            <div class="flex gap-1">
              <div class="w-14 flex-shrink-0 pt-1 text-right text-[10px] font-semibold uppercase leading-tight text-sber-gray">
                Без<br>вр.
              </div>
              <div
                v-for="day in weekViewDays"
                :key="`untimed-${day.date}`"
                class="flex min-w-0 flex-1 flex-col gap-0.5 overflow-y-auto border-b border-[#c8cfdb] px-0.5 py-0.5"
                :style="{ height: `${untimedHeightPx}px` }"
              >
                <div
                  v-for="task in getUntimedTasksForDate(day.date)"
                  :key="`untimed-task-${task.id}`"
                  class="flex w-full min-w-0 items-center gap-0.5 overflow-hidden rounded border px-1 py-0.5 text-sm font-medium leading-snug text-sber-black"
                  :class="task.completed ? 'opacity-45' : ''"
                  :style="{
                    backgroundColor: getPriorityColor(task.priority) + '22',
                    borderColor: getPriorityColor(task.priority) + '40',
                    borderLeftWidth: '3px',
                    borderLeftColor: getPriorityColor(task.priority),
                  }"
                  draggable="true"
                  @dragstart.stop="startWeekTaskDrag($event, task.id)"
                  @dragend="endWeekTaskDrag"
                  @click.stop="handleTaskCardClick(resolveRealTaskId(task.id))"
                >
                  <button
                    type="button"
                    class="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border"
                    :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                    @click.stop="toggleTaskComplete(task.id)"
                  >
                    <Check v-if="task.completed" class="h-1.5 w-1.5 text-white" />
                  </button>
                  <span class="min-w-0 flex-1 truncate">{{ task.title }}</span>
                </div>
              </div>
            </div>
            <div
              class="mb-1 flex cursor-ns-resize touch-none items-center justify-center py-0.5 transition-colors hover:bg-sber-gray-light"
              title="Потяните, чтобы изменить высоту"
              @pointerdown.prevent="startUntimedResize"
            >
              <span class="pointer-events-none h-1 w-10 rounded-full bg-sber-gray-mid" />
            </div>
          </template>
        </div>

        <!-- Hours 00:00–23:00 -->
        <div class="min-h-0 flex-1 overflow-y-auto">
          <div class="overflow-hidden rounded-2xl border border-[#c8cfdb] bg-white/45">
            <div class="flex">
              <div class="sticky left-0 z-10 w-14 flex-shrink-0 bg-white/90">
                <div
                  v-for="h in visibleWeekHours"
                  :key="`w-${h}`"
                  class="border-t border-[#c8cfdb] pr-2 pt-1 text-right text-xs text-sber-gray first:border-t-0"
                  :style="{ height: `${weekHourHeightPx}px` }"
                >
                  {{ String(h).padStart(2, '0') }}:00
                </div>
              </div>
              <div
                v-for="day in weekViewDays"
                :key="`w-day-${day.date}`"
                class="relative min-w-0 flex-1 overflow-hidden border-l border-[#c8cfdb]"
                :data-week-date="day.date"
                :style="{ height: `${weekTotalPx}px` }"
              >
                <div
                  v-for="h in visibleWeekHours"
                  :key="h"
                  class="cursor-pointer border-t border-[#c8cfdb] first:border-t-0"
                  :style="{ height: `${weekHourHeightPx}px` }"
                  @click="openNewTaskFromWeekCell(day.date, h)"
                  @dragenter.prevent
                  @dragover.prevent
                  @drop.prevent.stop="handleWeekCellDrop($event, day.date, h)"
                />
                <div class="pointer-events-none absolute inset-0">
                  <div
                    v-for="task in getWeekDayTimelineTasks(day.date)"
                    :key="`w-task-${task.id}`"
                    class="pointer-events-auto absolute min-w-0 cursor-grab touch-none select-none overflow-hidden rounded border border-[#c8cfdb] px-1 py-0.5"
                    :class="task.completed ? 'opacity-45' : ''"
                    :style="{
                      ...dayTimelineTaskHorizontalStyle(task.layoutCols, task.layoutCol, 2, 2),
                      top: `${task.topPx}px`,
                      height: `${task.heightPx}px`,
                      zIndex: (dragPreview?.taskId === task.id ? 35 : 1) + task.layoutCol,
                      backgroundColor: getPriorityColor(task.priority) + '22',
                      borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                    }"
                    @pointerdown.stop.prevent="startTaskMove($event, task)"
                    @click.stop.prevent="handleTaskCardClick(resolveRealTaskId(task.id))"
                  >
                    <button
                      type="button"
                      class="absolute left-1/2 top-0 z-20 flex h-5 w-full max-w-[3.5rem] -translate-x-1/2 cursor-ns-resize items-start justify-center"
                      aria-label="Изменить начало"
                      @pointerdown.stop.prevent="startTaskResize($event, task, 'start')"
                    >
                      <span class="pointer-events-none h-1 w-6 shrink-0 rounded-full bg-sber-gray/50" />
                    </button>
                    <div class="pointer-events-none relative z-30 flex min-w-0 items-start gap-0.5">
                      <button
                        type="button"
                        class="pointer-events-auto relative z-40 mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border"
                        :style="{ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : 'transparent' }"
                        aria-label="Завершить задачу"
                        @click.stop.prevent="toggleTaskComplete(task.id)"
                        @pointerdown.stop
                      >
                        <Check v-if="task.completed" class="h-2 w-2 text-white" />
                      </button>
                      <div class="min-w-0 flex-1 overflow-hidden">
                        <p class="truncate text-sm font-semibold leading-snug text-sber-black">{{ weekTaskTimeLabel(task) }}</p>
                        <p class="truncate text-sm font-medium leading-snug text-sber-black">{{ task.title }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="absolute bottom-0 left-1/2 z-20 flex h-5 w-full max-w-[3.5rem] -translate-x-1/2 cursor-ns-resize items-end justify-center"
                      aria-label="Изменить конец"
                      @pointerdown.stop.prevent="startTaskResize($event, task, 'end')"
                    >
                      <span class="pointer-events-none h-1 w-6 shrink-0 rounded-full bg-sber-gray/50" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MONTH VIEW -->
      <div v-else-if="calendarStore.viewType === 'month'" class="min-h-0 flex-1 overflow-y-auto px-1 py-2 sm:p-2">
        <!-- Weekday headers -->
        <div class="mb-1.5 grid grid-cols-7">
          <div v-for="d in ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']" :key="d"
               class="py-1 text-center text-[11px] font-semibold text-sber-gray">
            {{ d }}
          </div>
        </div>
        <!-- Calendar grid: taller cells, no card borders -->
        <div class="grid grid-cols-7 gap-y-0.5">
          <div
            v-for="cell in monthCells"
            :key="cell.date"
            class="relative min-h-[102px] min-w-0 overflow-hidden px-0.5 py-1 transition-colors sm:min-h-[118px]"
            :class="[
              !cell.isCurrentMonth ? 'opacity-35' : '',
              'hover:bg-sber-gray-light/60',
            ]"
            @dragenter.prevent
            @dragover.prevent
            @drop.prevent.stop="handleMonthCellDrop($event, cell.date)"
            @click="handleMonthCellClick(cell.date, $event)"
          >
            <div class="flex h-[22px] items-start justify-center">
              <span
                data-month-day
                class="inline-flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full text-xs font-semibold"
                :class="cell.isToday ? 'bg-sber-green text-white' : 'text-sber-black'"
                @click.stop="goToWeekView(cell.date)"
              >
                {{ cell.day }}
              </span>
            </div>

            <div class="relative mt-0.5 min-h-0 space-y-0.5 overflow-hidden">
              <div
                v-for="task in (monthCellTaskSlices[cell.date]?.visible || [])"
                :key="task.id"
                data-month-task
                class="w-full min-w-0 max-w-full cursor-pointer truncate rounded-[3px] px-1 py-px text-[10px] font-medium leading-tight text-sber-black"
                :class="task.completed ? 'opacity-45' : ''"
                :style="{ backgroundColor: getPriorityColor(task.priority) + '38' }"
                draggable="true"
                @dragstart.stop="startWeekTaskDrag($event, task.id)"
                @dragend="endWeekTaskDrag"
                @click.stop="handleTaskCardClick(resolveRealTaskId(task.id))"
              >
                {{ task.title }}
              </div>
              <button
                v-if="(monthCellTaskSlices[cell.date]?.hidden || 0) > 0"
                type="button"
                data-month-day
                class="absolute bottom-0 right-0 rounded-md bg-sber-gray-light px-1 py-px text-[10px] font-semibold text-sber-gray"
                @click.stop="goToWeekView(cell.date)"
              >
                +{{ monthCellTaskSlices[cell.date]?.hidden }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- YEAR VIEW -->
      <div v-else-if="calendarStore.viewType === 'year'" class="min-h-0 flex-1 overflow-y-auto p-2">
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="month in yearMonths"
            :key="month.index"
            class="cursor-pointer rounded-2xl bg-white p-3 active:bg-sber-gray-light"
            @click="goToMonth(month.index)"
          >
            <p class="mb-2 text-xs font-bold text-sber-black">{{ month.name }}</p>
            <div class="grid grid-cols-7 gap-px">
              <div
                v-for="(cell, cellIdx) in month.cells"
                :key="`${month.index}-${cellIdx}`"
                class="flex aspect-square flex-col items-center justify-center"
                @click.stop="cell.date && goToDayView(cell.date)"
              >
                <span
                  v-if="cell.day"
                  class="flex h-4 w-4 items-center justify-center text-[9px]"
                  :class="cell.isToday
                    ? 'rounded-full bg-sber-green font-semibold text-white'
                    : 'text-sber-gray'"
                >
                  {{ cell.day }}
                </span>
                <div
                  v-if="cell.date"
                  class="mt-px flex h-1 items-center justify-center gap-px"
                >
                  <span
                    v-for="(dot, di) in getDateDots(cell.date)"
                    :key="di"
                    class="h-1 w-1 rounded-full"
                    :style="{ backgroundColor: dot }"
                  />
                </div>
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
  ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, Calendar, CalendarRange, Columns, Check,
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Task } from '~/data/mockData'
import {
  defaultDurationEnd,
  formatMinutesToTime,
  getTaskDurationMinutes,
  getTaskScheduleStart,
  parseTimeToMinutes,
} from '~/utils/time'
import {
  assignTimelineOverlapLayout,
  timelineTaskHorizontalStyle,
} from '~/utils/overlap-layout'
import { resolveRealTaskId } from '~/utils/recurrence'
import { buildMonthCells, buildYearMonths } from '~/utils/calendar-grid'

definePageMeta({ layout: 'app' })

const route = useRoute()
const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()

const todayStr = dayjs().format('YYYY-MM-DD')
const viewMenuOpen = ref(false)
const viewMenuRef = ref<HTMLElement | null>(null)
const selectedTaskId = ref<string | null>(null)

onClickOutside(viewMenuRef, () => {
  viewMenuOpen.value = false
})

const dayTimelineRef = ref<HTMLElement | null>(null)

function hydrateCalendarFromQuery() {
  const date = route.query.date
  const view = route.query.view
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    calendarStore.setDate(date)
  }
  if (
    typeof view === 'string' &&
    (view === 'day' || view === 'week' || view === 'month' || view === 'year')
  ) {
    calendarStore.setView(view)
  }
}

onMounted(() => {
  // Query wins; otherwise use Settings → Вид defaults.
  if (!route.query.view) {
    calendarStore.applyViewDefaultsFromSettings()
  }
  hydrateCalendarFromQuery()
  if (!tasksStore.initialized) {
    void tasksStore.fetchGrouped()
  }
})

const viewTypes = [
  { value: 'day', label: 'День', icon: CalendarDays },
  { value: 'week', label: 'Неделя', icon: CalendarRange },
  { value: 'month', label: 'Месяц', icon: Calendar },
  { value: 'year', label: 'Год', icon: Columns },
]

const headerTitle = computed(() => {
  switch (calendarStore.viewType) {
    case 'day':
      return 'Календарь'
    case 'week':
      return 'Неделя'
    case 'month':
      return 'Месяц'
    case 'year':
      return 'Год'
    default:
      return 'Календарь'
  }
})

function setView(v: string) {
  calendarStore.setView(v as any)
  viewMenuOpen.value = false
}

const earlyHours = [0, 1, 2, 3, 4, 5]
const mainHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const lateHours = [22, 23]
/** Full day hours for the day timeline (no early/late split). */
const dayHours = Array.from({ length: 24 }, (_, i) => i)
const weekHourHeightPx = 60
const weekMinuteHeightPx = weekHourHeightPx / 60
const dayHourHeightPx = 60

const visibleWeekHours = computed(() => [...earlyHours, ...mainHours, ...lateHours])
const weekFirstVisibleMin = computed(() => visibleWeekHours.value[0] * 60)
const weekLastVisibleMin = computed(
  () => (visibleWeekHours.value[visibleWeekHours.value.length - 1] + 1) * 60,
)
const weekTotalPx = computed(() => visibleWeekHours.value.length * weekHourHeightPx)
const weekHourIndex = computed(() => {
  const map = new Map<number, number>()
  visibleWeekHours.value.forEach((h, i) => map.set(h, i))
  return map
})

function weekMinutesToPx(min: number): number {
  if (min <= weekFirstVisibleMin.value) return 0
  if (min >= weekLastVisibleMin.value) return weekTotalPx.value
  const hour = Math.floor(min / 60)
  const idx = weekHourIndex.value.get(hour)
  if (idx == null) {
    return hour < mainHours[0] ? 0 : weekTotalPx.value
  }
  return idx * weekHourHeightPx + (min - hour * 60) * weekMinuteHeightPx
}

const dayStartMinutes = 0
const dayEndMinutes = 24 * 60
const minuteHeightPx = dayHourHeightPx / 60
const minDurationMinutes = 10
const draggingWeekTaskId = ref<string | null>(null)

const currentDayTimePx = computed(() => {
  const now = dayjs()
  const nowMinutes = now.hour() * 60 + now.minute()
  return Math.max(0, Math.min(dayEndMinutes, nowMinutes)) * minuteHeightPx
})

type DragMode = 'move' | 'resize-start' | 'resize-end'

const dragState = ref<{
  taskId: string
  mode: DragMode
  startY: number
  startX: number
  initialStart: number
  initialEnd: number
  sourceDate: string | null
  hadDuration: boolean
  captureEl: HTMLElement | null
  pointerId: number | null
  pxPerMinute: number
} | null>(null)
const dragPreview = ref<{
  taskId: string
  start: number
  end: number
  /** Week view: target day while dragging across columns. */
  date?: string | null
} | null>(null)
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

/** Полуинтервалы — см. utils/overlap-layout. */
function assignDayTimelineOverlapLayout(
  segments: Array<{ id: string; rawStart: number; rawEnd: number }>,
): Map<string, { col: number; cols: number }> {
  return assignTimelineOverlapLayout(segments)
}

function dayTimelineTaskHorizontalStyle(
  layoutCols: number,
  layoutCol: number,
  pad = 4,
  gap = 3,
): Record<string, string> {
  return timelineTaskHorizontalStyle(layoutCols, layoutCol, pad, gap)
}

const dayTimelineTasks = computed(() => {
  const base = tasksStore.getTasksForDate(calendarStore.currentDate)
    .filter(t => !!getTaskScheduleStart(t))
    .map((task) => {
      const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null
      const scheduleStart = getTaskScheduleStart(task) || '00:00'
      const startMinutes = preview ? preview.start : parseTimeToMinutes(scheduleStart)
      const durationMinutes = preview ? (preview.end - preview.start) : getTaskDurationMinutes(task)
      const fullEndMinutes = startMinutes + durationMinutes

      if (fullEndMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) return null

      const clippedEnd = Math.min(fullEndMinutes, dayEndMinutes)
      const clippedStart = Math.max(startMinutes, dayStartMinutes)
      const clippedDuration = Math.max(clippedEnd - clippedStart, minDurationMinutes)

      const labelTime = preview
        ? `${formatMinutesToTime(preview.start)} – ${formatMinutesToTime(preview.end)}`
        : task.duration?.start && task.duration?.end
          ? `${task.duration.start} – ${task.duration.end}`
          : (getTaskScheduleStart(task) || '')

      return {
        ...task,
        rawStart: startMinutes,
        rawEnd: fullEndMinutes,
        labelTime,
        topPx: (clippedStart - dayStartMinutes) * minuteHeightPx,
        heightPx: clippedDuration * minuteHeightPx,
      }
    })
    .filter((task): task is NonNullable<typeof task> => !!task)

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

function getWeekDayTimelineTasks(date: string) {
  const preview = dragPreview.value
  const realPreviewId = preview ? resolveRealTaskId(preview.taskId) : null
  const previewOnThisDay = Boolean(
    preview && realPreviewId && (preview.date || null) === date,
  )
  const previewOnOtherDay = Boolean(
    preview && realPreviewId && preview.date && preview.date !== date,
  )

  let sourceTasks = tasksStore.getTasksForDate(date)
    .filter(t => !!getTaskScheduleStart(t))

  // Hide the block on its source day while the preview lives on another column.
  if (previewOnOtherDay) {
    sourceTasks = sourceTasks.filter(t => resolveRealTaskId(t.id) !== realPreviewId)
  }

  // Show the dragged block on the target day even if it is not scheduled there yet.
  if (previewOnThisDay) {
    const already = sourceTasks.some(t => resolveRealTaskId(t.id) === realPreviewId)
    if (!already) {
      const fromStore = tasksStore.tasks.find(t => resolveRealTaskId(t.id) === realPreviewId)
        || tasksStore.calendarTasks.find(t => resolveRealTaskId(t.id) === realPreviewId)
      if (fromStore) sourceTasks = [...sourceTasks, fromStore]
    }
  }

  const base = sourceTasks
    .map((task) => {
      const isPreview = realPreviewId != null
        && resolveRealTaskId(task.id) === realPreviewId
        && (!preview?.date || preview.date === date)
      const activePreview = isPreview ? preview : null
      const scheduleStart = getTaskScheduleStart(task) || '00:00'
      const startMinutes = activePreview ? activePreview.start : parseTimeToMinutes(scheduleStart)
      const durationMinutes = activePreview
        ? (activePreview.end - activePreview.start)
        : getTaskDurationMinutes(task)
      const endMinutes = startMinutes + durationMinutes

      if (endMinutes <= weekFirstVisibleMin.value || startMinutes >= weekLastVisibleMin.value) {
        return null
      }

      const topPx = weekMinutesToPx(startMinutes)
      const bottomPx = weekMinutesToPx(endMinutes)
      const heightPx = Math.max(bottomPx - topPx, weekHourHeightPx * 0.35)

      return {
        ...task,
        rawStart: startMinutes,
        rawEnd: endMinutes,
        topPx,
        heightPx,
      }
    })
    .filter((t): t is Task & { rawStart: number; rawEnd: number; topPx: number; heightPx: number } => !!t)

  const layout = assignTimelineOverlapLayout(
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
}

const untimedRowPx = 36
const untimedMinPx = 40
const untimedMaxPx = 360
const untimedHeightPx = ref(untimedRowPx * 3)

let untimedResize: { startY: number; startHeight: number } | null = null

function startUntimedResize(event: PointerEvent) {
  untimedResize = { startY: event.clientY, startHeight: untimedHeightPx.value }
  try {
    ;(event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId)
  }
  catch { /* ignore */ }
  window.addEventListener('pointermove', handleUntimedResizeMove, { passive: false })
  window.addEventListener('pointerup', handleUntimedResizeEnd)
  window.addEventListener('pointercancel', handleUntimedResizeEnd)
}

function handleUntimedResizeMove(event: PointerEvent) {
  if (!untimedResize) return
  event.preventDefault()
  const next = untimedResize.startHeight + (event.clientY - untimedResize.startY)
  untimedHeightPx.value = Math.max(untimedMinPx, Math.min(untimedMaxPx, next))
}

function handleUntimedResizeEnd() {
  untimedResize = null
  window.removeEventListener('pointermove', handleUntimedResizeMove)
  window.removeEventListener('pointerup', handleUntimedResizeEnd)
  window.removeEventListener('pointercancel', handleUntimedResizeEnd)
}

function getUntimedTasksForDate(date: string) {
  return tasksStore.getTasksForDate(date).filter(t =>
    t.isAllDay || (!getTaskScheduleStart(t) && !!t.dueDate),
  )
}

const dayUntimedTasks = computed(() => getUntimedTasksForDate(calendarStore.currentDate))

const weekHasUntimedTasks = computed(() =>
  weekViewDays.value.some(day => getUntimedTasksForDate(day.date).length > 0),
)

onUnmounted(() => {
  handleUntimedResizeEnd()
})

function formatTaskScheduleLabel(task: Task) {
  if (task.duration?.start && task.duration?.end) {
    return `${task.duration.start} – ${task.duration.end}`
  }
  return getTaskScheduleStart(task) || ''
}

function weekTaskTimeLabel(task: Task & { rawStart: number; rawEnd: number }) {
  const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null
  if (preview) {
    return `${formatMinutesToTime(preview.start)} – ${formatMinutesToTime(preview.end)}`
  }
  return formatTaskScheduleLabel(task)
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

  const sourceDate = calendarStore.viewType === 'week'
    ? (task.dueDate || calendarStore.currentDate)
    : calendarStore.currentDate

  dragState.value = {
    taskId: task.id,
    mode,
    startY: event.clientY,
    startX: event.clientX,
    initialStart: task.rawStart,
    initialEnd: task.rawEnd,
    sourceDate: calendarStore.viewType === 'week' ? sourceDate : null,
    hadDuration: !!task.duration,
    captureEl,
    pointerId,
    pxPerMinute: calendarStore.viewType === 'week' ? weekMinuteHeightPx : minuteHeightPx,
  }
  didDrag.value = false
  dragPreview.value = {
    taskId: task.id,
    start: task.rawStart,
    end: task.rawEnd,
    date: calendarStore.viewType === 'week' ? sourceDate : null,
  }

  window.addEventListener('pointermove', handleDragMove, { passive: false })
  window.addEventListener('pointerup', handleDragEnd)
  window.addEventListener('pointercancel', handleDragEnd)
}

function resolveWeekDateUnderPointer(clientX: number, _clientY: number, fallback: string | null) {
  if (typeof document === 'undefined') return fallback
  const cols = document.querySelectorAll<HTMLElement>('[data-week-date]')
  for (const col of cols) {
    const rect = col.getBoundingClientRect()
    if (clientX >= rect.left && clientX < rect.right) {
      return col.dataset.weekDate || fallback
    }
  }
  return fallback
}

function handleDragMove(event: PointerEvent) {
  if (!dragState.value) return
  event.preventDefault()

  const rawDeltaMinutes = (event.clientY - dragState.value.startY) / dragState.value.pxPerMinute
  const rawDeltaX = event.clientX - dragState.value.startX
  if (Math.abs(rawDeltaMinutes) >= 1.5 || Math.abs(rawDeltaX) >= 12) {
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

  let nextDate = dragState.value.sourceDate
  if (
    dragState.value.mode === 'move'
    && calendarStore.viewType === 'week'
    && dragState.value.sourceDate
  ) {
    nextDate = resolveWeekDateUnderPointer(
      event.clientX,
      event.clientY,
      dragState.value.sourceDate,
    )
  }

  dragPreview.value = {
    taskId: dragState.value.taskId,
    start: nextStart,
    end: nextEnd,
    date: nextDate,
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
  const dateChanged = Boolean(
    preview?.date
    && state.sourceDate
    && preview.date !== state.sourceDate,
  )
  const shouldPersist = preview
    && preview.taskId === state.taskId
    && (
      preview.start !== state.initialStart
      || preview.end !== state.initialEnd
      || dateChanged
    )

  if (!shouldPersist) {
    finishDragInteraction()
    return
  }

  const duration = Math.max(minDurationMinutes, preview.end - preview.start)
  const nextStart = formatMinutesToTime(preview.start)
  const nextEnd = formatMinutesToTime(preview.start + duration)
  const updates: Partial<Task> = {
    dueTime: nextStart,
    duration: { start: nextStart, end: nextEnd },
  }
  if (dateChanged && preview.date) {
    updates.dueDate = preview.date
  }

  void tasksStore
    .updateTask(resolveRealTaskId(state.taskId), updates, { grouped: false, matrix: false })
    .finally(finishDragInteraction)
}

function handleTaskCardClick(taskId: string) {
  if (dragState.value) return
  if (ignoreNextTaskCardClick.value) {
    ignoreNextTaskCardClick.value = false
    return
  }
  selectedTaskId.value = resolveRealTaskId(taskId)
}

function refreshCalendarTasks() {
  void tasksStore.fetchCalendar(calendarStore.viewType, calendarStore.currentDate)
}

function toggleTaskComplete(taskId: string) {
  void tasksStore.completeTask(resolveRealTaskId(taskId), { grouped: false, calendar: false, matrix: false })
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
  const slotEnd = defaultDurationEnd(slotStart)
  navigateTo(`/app/new-task?returnTo=${returnTo}&dueDate=${date}&dueTime=${slotStart}&durationStart=${slotStart}&durationEnd=${slotEnd}`)
}

function handleDayHourDrop(event: DragEvent, hour: number) {
  handleWeekCellDrop(event, calendarStore.currentDate, hour)
}

// Month cells
const monthCells = computed(() =>
  buildMonthCells(calendarStore.currentDate, todayStr),
)

/** Priority-colored dots for year mini-calendars (max 3). */
const yearDotsByDate = computed(() => {
  if (calendarStore.viewType !== 'year') return new Map<string, string[]>()
  const year = parseInt(calendarStore.currentDate.substring(0, 4), 10)
  if (!Number.isFinite(year)) return new Map<string, string[]>()
  const start = `${year}-01-01`
  const end = `${year}-12-31`
  const map = new Map<string, string[]>()
  for (const t of tasksStore.getTasksForWeek(start, end)) {
    if (!t.dueDate) continue
    const list = map.get(t.dueDate) || []
    if (list.length >= 3) continue
    list.push(getPriorityColor(t.priority))
    map.set(t.dueDate, list)
  }
  return map
})

function getDateDots(date?: string | null) {
  if (!date) return []
  return yearDotsByDate.value.get(date) || []
}

function getMonthCellTasks(date?: string) {
  if (!date) return []
  return tasksStore.getTasksForDate(date).filter(t => !!t.dueDate)
}

/** How many pills fit in a month cell (matches Flutter denser month layout). */
const MONTH_CELL_VISIBLE_MAX = 5

const monthCellTaskSlices = computed(() => {
  const out: Record<string, { visible: Task[], hidden: number }> = {}
  for (const cell of monthCells.value) {
    if (!cell.date) continue
    const all = getMonthCellTasks(cell.date)
    if (all.length <= MONTH_CELL_VISIBLE_MAX) {
      out[cell.date] = { visible: all, hidden: 0 }
    }
    else {
      out[cell.date] = {
        visible: all.slice(0, MONTH_CELL_VISIBLE_MAX),
        hidden: all.length - MONTH_CELL_VISIBLE_MAX,
      }
    }
  }
  return out
})

// Year months
const yearMonths = computed(() => {
  const year = parseInt(calendarStore.currentDate.substring(0, 4), 10)
  return buildYearMonths(year, todayStr)
})

function goToMonth(monthIndex: number) {
  const year = parseInt(calendarStore.currentDate.substring(0, 4), 10)
  calendarStore.setDate(
    dayjs().year(year).month(monthIndex).date(1).format('YYYY-MM-DD'),
  )
  calendarStore.setView('month')
}

function buildNewTaskFromCalendarQuery(slotStart: string) {
  const slotEnd = defaultDurationEnd(slotStart)
  const returnTo = encodeURIComponent(`/app/calendar?view=${calendarStore.viewType}&date=${calendarStore.currentDate}`)
  return `/app/new-task?returnTo=${returnTo}&dueDate=${calendarStore.currentDate}&dueTime=${slotStart}&durationStart=${slotStart}&durationEnd=${slotEnd}`
}

function openNewTaskFromCalendar(hour: number) {
  const slotStart = `${String(hour).padStart(2, '0')}:00`
  navigateTo(buildNewTaskFromCalendarQuery(slotStart))
}

function openNewTaskFromDayTimeline(event: MouseEvent) {
  const container = dayTimelineRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const offsetY = event.clientY - rect.top
  const rawMinutes = dayStartMinutes + Math.floor(offsetY / minuteHeightPx)
  const snappedMinutes = Math.max(dayStartMinutes, Math.min(dayEndMinutes - 1, roundToStep(rawMinutes, 5)))
  navigateTo(buildNewTaskFromCalendarQuery(formatMinutesToTime(snappedMinutes)))
}

function startWeekTaskDrag(event: DragEvent, taskId: string) {
  const realId = resolveRealTaskId(taskId)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', realId)
  }
  draggingWeekTaskId.value = realId
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
    dueTime: nextStart,
    duration: { start: nextStart, end: nextEnd },
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
    if (calendarStore.viewType !== 'day' && calendarStore.viewType !== 'week') return

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
