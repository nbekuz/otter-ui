<template>
  <div
    class="page-container flex min-h-0 flex-col max-lg:min-h-dvh lg:!h-full lg:!min-h-0 lg:!flex-1 lg:!overflow-hidden lg:!pb-0"
    :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'"
    @click="handlePageClick"
  >
    <!-- Header -->
    <div
      class="page-header-top shrink-0 px-4 pb-3 lg:px-6"
      :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'"
    >
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm font-semibold text-sber-black">{{ greeting }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"
            @click.stop="toggleSearch"
          >
            <Search class="w-5 h-5 text-sber-gray" />
          </button>
          <div @click.stop>
            <NotificationsBell variant="icon" :is-dark-theme="isDarkTheme" />
          </div>
        </div>
      </div>

      <!-- Search bar -->
      <Transition name="slide-down">
        <div v-if="showSearch" class="relative mb-1" @click.stop>
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск задач..."
            class="input-field pl-11 py-3 text-sm"
          />
          <button v-if="searchQuery" class="absolute right-4 top-1/2 -translate-y-1/2"
                  @click="searchQuery = ''">
            <X class="w-4 h-4 text-sber-gray" />
          </button>
        </div>
      </Transition>

      <!-- Stats row -->
      <div v-if="!showSearch" class="grid grid-cols-3 gap-2 lg:hidden">
        <div v-for="stat in stats" :key="stat.label"
             class="bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm lg:px-5 lg:py-4">
          <p class="text-lg font-bold" :style="{ color: stat.color }">{{ stat.count }}</p>
          <p class="text-[10px] text-sber-gray font-medium">{{ stat.label }}</p>
        </div>
      </div>

      <div
        v-if="!showSearch"
        class="hidden lg:grid lg:gap-3"
        :style="{ gridTemplateColumns: `repeat(${Math.max(desktopGroups.length, 1)}, minmax(0, 1fr))` }"
      >
        <button
          v-for="group in desktopGroups"
          :key="group.id"
          class="rounded-2xl border px-3 py-3 text-left shadow-sm transition-colors"
          :class="[
            isDarkTheme ? 'bg-[#171a21]' : 'bg-white',
            activeDesktopGroupId === group.id
              ? 'border-sber-green bg-sber-green-light/40'
              : 'border-transparent hover:border-sber-gray-mid',
          ]"
          type="button"
          @click="selectDesktopGroup(group.id)"
        >
          <p class="text-lg font-bold" :style="{ color: group.color }">{{ group.tasks.length }}</p>
          <p class="text-[11px] font-semibold text-sber-gray">{{ group.title }}</p>
        </button>
      </div>
    </div>

    <!-- Search results -->
    <div v-if="showSearch && searchQuery" class="min-h-0 flex-1 overflow-y-auto px-4 pb-8 lg:px-6 lg:pb-6">
      <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">
        Результаты ({{ searchResults.length }})
      </p>
      <div v-if="searchResults.length === 0" class="text-center py-8 text-sber-gray text-sm">
        Ничего не найдено
      </div>
      <div class="grid grid-cols-1 gap-3">
        <TasksTaskItem
          v-for="task in searchResults"
          :key="task.id"
          :task="task"
          @complete="tasksStore.completeTask($event)"
          @delete="requestDeleteTask"
          @open="openTask"
        />
      </div>
    </div>

    <!-- Task groups -->
    <div v-else-if="tasksStore.loading && !tasksStore.initialized" class="min-h-0 flex-1 px-4 py-16 text-center text-sm text-sber-gray">
      Загрузка задач...
    </div>
    <div v-else-if="tasksStore.error && !tasksStore.initialized" class="min-h-0 flex-1 px-4 py-16 text-center">
      <p class="text-sm text-red-500">{{ tasksStore.error }}</p>
      <button class="mt-3 text-sm font-semibold text-sber-green" type="button" @click="tasksStore.fetchGrouped()">
        Повторить
      </button>
    </div>
    <div
      v-else
      class="flex min-h-0 flex-1 flex-col px-4 pb-8 lg:overflow-hidden lg:px-6 lg:pb-4"
    >
      <div class="grid grid-cols-1 gap-3 lg:hidden">
        <TasksTaskGroup
          v-for="group in visibleGroups"
          :key="group.id"
          :title="group.title"
          :tasks="group.tasks"
          :color="group.color"
          :surface="group.surface"
          :icon="group.icon"
          @open-task="openTask"
          @delete-task="requestDeleteTask"
        />
      </div>

      <div
        ref="desktopSplitRef"
        class="hidden min-h-0 flex-1 overflow-hidden lg:flex lg:rounded-3xl lg:border lg:border-sber-gray-mid/60 lg:shadow-card"
        :class="isDarkTheme ? 'lg:bg-[#171a21]' : 'lg:bg-white'"
      >
        <!-- Left: tasks list -->
        <section
          class="flex min-h-0 min-w-[360px] shrink-0 flex-col overflow-hidden border-r border-sber-gray-light px-4 py-4"
          :class="isDarkTheme ? 'bg-[#171a21]' : 'bg-white'"
          :style="{ flex: `0 0 ${leftPaneWidth}%`, width: `${leftPaneWidth}%`, maxWidth: `${leftPaneWidth}%` }"
        >
          <div class="mb-3 flex shrink-0 items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: activeDesktopGroup?.color || '#8E8E93' }" />
              <p class="text-sm font-bold text-sber-black">{{ activeDesktopGroup?.title }}</p>
              <span class="rounded-full bg-sber-gray-light px-2 py-0.5 text-xs font-semibold text-sber-gray">
                {{ activeDesktopTasks.length }}
              </span>
            </div>
            <button class="text-xs font-semibold text-sber-green" type="button" @click="clearDesktopSelection">
              Снять выбор
            </button>
          </div>

          <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain pr-1">
            <template v-if="activeDesktopTasks.length">
              <div
                v-for="task in activeDesktopTasks"
                :key="`desktop-task-${task.id}`"
                class="box-border flex w-full flex-none grow-0 items-center gap-2 rounded-2xl border px-2 py-2 transition-colors"
                :class="desktopSelectedTaskId === task.id
                  ? 'border-sber-green bg-sber-green-light/25'
                  : isDarkTheme
                    ? 'border-[#2a303a] bg-[#10141b] hover:bg-[#1b212b]'
                    : 'border-sber-gray-light bg-white hover:bg-sber-gray-light/60'"
                :style="{
                  height: 'auto',
                  minHeight: '0',
                  ...(!task.completed && task.priority !== 'none'
                    ? { borderLeftWidth: '3px', borderLeftColor: priorityColor(task.priority) }
                    : {}),
                }"
              >
                <button
                  type="button"
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                  :style="{
                    borderColor: priorityColor(task.priority),
                    backgroundColor: task.completed ? priorityColor(task.priority) : 'transparent',
                  }"
                  @click.stop="toggleDesktopTaskCheck(task.id)"
                >
                  <Check v-if="task.completed" class="h-3 w-3 text-white" />
                </button>
                <button
                  type="button"
                  class="min-w-0 flex-1 overflow-hidden text-left"
                  @click="selectDesktopTask(task.id)"
                >
                  <p
                    class="truncate text-sm font-semibold leading-5"
                    :class="task.completed
                      ? 'text-sber-gray line-through'
                      : desktopSelectedTaskId === task.id
                        ? 'text-sber-green'
                        : 'text-sber-black'"
                  >
                    {{ task.title }}
                  </p>
                </button>
                <div
                  v-if="hasDesktopTaskMeta(task)"
                  class="flex max-w-[55%] shrink-0 flex-wrap items-center justify-end gap-x-1.5 gap-y-0.5 text-[11px] text-sber-gray"
                >
                  <span v-if="task.dueDate">{{ formatDesktopTaskDate(task.dueDate) }}</span>
                  <span v-if="task.dueDate && task.dueTime" class="text-sber-gray-mid">–</span>
                  <span v-if="task.dueTime">{{ task.dueTime }}</span>
                  <template v-if="task.duration?.start && task.duration?.end">
                    <span class="text-sber-gray-mid">–</span>
                    <span class="font-medium text-sber-blue">{{ task.duration.start }}–{{ task.duration.end }}</span>
                  </template>
                  <Bell
                    v-if="task.notification !== undefined && task.notification !== ''"
                    class="h-3 w-3 shrink-0"
                    aria-label="Уведомление"
                  />
                  <RefreshCw
                    v-if="task.repeat && task.repeat !== 'none'"
                    class="h-3 w-3 shrink-0"
                    aria-label="Повтор"
                  />
                </div>
              </div>
            </template>
            <div
              v-else
              class="flex-none rounded-2xl border border-dashed border-sber-gray-mid px-3 py-8 text-center text-sm text-sber-gray"
            >
              В этом разделе пока нет задач
            </div>
          </div>
        </section>

        <!-- Resize handle -->
        <button
          class="w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-sber-green/20"
          type="button"
          @pointerdown="startResizing"
        />

        <!-- Right: task editor -->
        <section
          class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-5 py-3"
          :class="isDarkTheme ? 'bg-[#171a21]' : 'bg-white'"
        >
          <div v-if="desktopSelectedTask" class="flex min-h-0 flex-1 flex-col overflow-hidden">
            <h2 class="mb-3 shrink-0 line-clamp-1 text-xl font-bold text-sber-black">{{ desktopSelectedTask.title }}</h2>

            <div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1">
            <div class="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label>
                <input v-model="editorForm.title" class="input-field py-2.5" type="text">
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label>
                <textarea
                  v-model="editorForm.description"
                  rows="2"
                  class="input-field min-h-[52px] max-h-[88px] resize-y py-2"
                />
              </div>

              <div class="md:col-span-2 grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>
                  <DateFieldRu v-model="editorForm.dueDate" field-class="py-3" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Время срока</label>
                  <TimeFieldRu v-model="editorForm.dueTime" field-class="py-3" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Начало</label>
                  <TimeFieldRu
                    v-model="editorForm.durationStart"
                    field-class="py-3"
                    @update:model-value="desktopEditorError = ''"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Конец</label>
                  <TimeFieldRu
                    v-model="editorForm.durationEnd"
                    field-class="py-3"
                    @update:model-value="onEditorDurationEndInput"
                  />
                </div>
              </div>

              <p v-if="desktopEditorError" class="md:col-span-2 text-sm font-medium text-red-500">
                {{ desktopEditorError }}
              </p>

              <div>
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Приоритет</label>
                <UiAppSelect v-model="editorForm.priority" :options="prioritySelectOptions" />
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Уведомление</label>
                <UiAppSelect v-model="editorForm.notification" :options="notificationSelectOptions" />
                <div v-if="editorForm.notification === 'custom'" class="mt-2 flex items-center gap-2">
                  <input
                    v-model.number="customNotifyMinutes"
                    type="number"
                    min="0"
                    max="10080"
                    class="input-field w-28 py-2 text-sm"
                  >
                  <span class="text-xs text-sber-gray">минут до срока</span>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Повтор</label>
                <UiAppSelect v-model="editorForm.repeat" :options="repeatSelectOptions" />
              </div>

              <div v-if="editorForm.repeat === 'custom'" class="md:col-span-2 rounded-2xl border border-sber-green/30 bg-sber-green-light/30 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p>

                <div class="mt-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-sm text-sber-gray">Каждые</span>
                    <input
                      v-model.number="desktopCustomRepeat.interval"
                      type="number"
                      min="1"
                      max="31"
                      class="w-20 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-sber-black"
                      :class="desktopRepeatErrors.interval
                        ? 'border-red-400 bg-red-50'
                        : 'border-sber-gray-mid'"
                      @input="desktopRepeatErrors.interval = ''"
                    >
                    <button
                      type="button"
                      class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                      :class="desktopCustomRepeat.unit === 'week' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                      @click="desktopCustomRepeat.unit = 'week'; clearDesktopRepeatErrors()"
                    >
                      Недели
                    </button>
                    <button
                      type="button"
                      class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                      :class="desktopCustomRepeat.unit === 'month' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                      @click="desktopCustomRepeat.unit = 'month'; clearDesktopRepeatErrors()"
                    >
                      Месяца
                    </button>
                  </div>
                  <p
                    v-if="desktopRepeatErrors.interval"
                    class="mt-1.5 text-xs font-medium text-red-500"
                  >
                    {{ desktopRepeatErrors.interval }}
                  </p>
                </div>

                <div v-if="desktopCustomRepeat.unit === 'week'" class="mt-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="day in weekDays"
                      :key="day.value"
                      type="button"
                      class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                      :class="desktopCustomRepeat.weekdays.includes(day.value)
                        ? 'border-sber-green bg-sber-green text-white'
                        : desktopRepeatErrors.weekdays
                          ? 'border-red-400 bg-red-50 text-sber-gray'
                          : 'border-sber-gray-mid bg-white text-sber-gray'"
                      @click="toggleDesktopCustomWeekday(day.value)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                  <p
                    v-if="desktopRepeatErrors.weekdays"
                    class="mt-1.5 text-xs font-medium text-red-500"
                  >
                    {{ desktopRepeatErrors.weekdays }}
                  </p>
                </div>

                <div v-else class="mt-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p>
                  <div class="flex flex-wrap items-center gap-2">
                    <input
                      v-model.number="desktopCustomRepeat.monthDay"
                      type="number"
                      min="1"
                      max="31"
                      class="w-28 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-sber-black"
                      :class="desktopRepeatErrors.monthDay
                        ? 'border-red-400 bg-red-50'
                        : 'border-sber-gray-mid'"
                      @input="desktopRepeatErrors.monthDay = ''"
                    >
                    <p v-if="desktopRepeatErrors.monthDay" class="text-xs font-medium text-red-500">
                      {{ desktopRepeatErrors.monthDay }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Матрица Эйзенхауэра</label>
                <div class="grid grid-cols-4 gap-1">
                  <button
                    v-for="block in matrixBlocks"
                    :key="block.id"
                    type="button"
                    class="flex min-w-0 flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-1.5 text-center transition-all"
                    :class="editorForm.matrixBlock === block.id ? 'border-current' : 'border-sber-gray-light'"
                    :style="editorForm.matrixBlock === block.id
                      ? { borderColor: block.color, backgroundColor: block.color + '15' }
                      : {}"
                    @click="editorForm.matrixBlock = block.id"
                  >
                    <div class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: block.color }" />
                    <span class="line-clamp-2 text-[9px] font-medium leading-tight text-sber-black">{{ block.title }}</span>
                  </button>
                </div>
              </div>

              <div class="md:col-span-2">
                <input ref="attachmentInputRef" type="file" class="hidden" @change="handleAttachmentChange">
                <div class="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-sber-green/40 bg-sber-green-light px-3 py-2 text-sm font-semibold text-sber-green transition-colors hover:bg-sber-green/20"
                    @click="attachmentInputRef?.click()"
                  >
                    <Paperclip class="h-4 w-4" />
                    Добавить изображение или файл
                  </button>
                  <div
                    v-if="attachmentName"
                    class="w-fit max-w-full rounded-xl border border-sber-gray-light p-2"
                  >
                    <div class="flex min-w-0 items-center gap-2">
                      <a
                        v-if="attachmentDataUrl"
                        :href="attachmentDataUrl"
                        target="_blank"
                        rel="noopener"
                        class="min-w-0 truncate text-sm font-medium text-sber-green hover:underline"
                      >{{ attachmentName }}</a>
                      <p v-else class="min-w-0 truncate text-sm text-sber-black">{{ attachmentName }}</p>
                      <button type="button" class="shrink-0 text-sber-gray hover:text-red-500" @click="clearAttachment">
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                    <a
                      v-if="attachmentIsImage"
                      :href="attachmentDataUrl"
                      target="_blank"
                      rel="noopener"
                      class="mt-2 block"
                    >
                      <img :src="attachmentDataUrl" alt="Вложение" class="max-h-28 rounded-lg object-contain">
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div class="mt-3 grid shrink-0 grid-cols-3 gap-2 border-t border-sber-gray-light/80 pt-3">
              <button class="btn-primary col-span-1 !py-3 !text-sm" type="button" @click="saveDesktopTask">
                Сохранить
              </button>
              <button
                class="col-span-1 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors"
                :class="desktopSelectedTask.completed ? 'bg-sber-blue-light text-sber-blue' : 'bg-sber-green-light text-sber-green'"
                type="button"
                @click="toggleDesktopTaskComplete"
              >
                {{ desktopSelectedTask.completed ? 'Восстановить' : 'Выполнено' }}
              </button>
              <button class="col-span-1 rounded-2xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-500" type="button" @click="confirmDeleteDesktopTask">
                Удалить
              </button>
            </div>
          </div>

          <div v-else class="flex h-full items-center justify-center rounded-3xl border border-dashed border-sber-gray-mid px-4 py-6 text-center text-sm text-sber-gray sm:px-6">
            Выберите задачу слева, чтобы открыть редактирование
          </div>
        </section>
      </div>
    </div>

    <!-- Unsaved changes -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="unsavedModal" class="overlay" @click="unsavedModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="unsavedModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-2 text-lg font-bold text-sber-black">Сохранить изменения?</h3>
          <p class="mb-5 text-sm text-sber-gray">Есть несохранённые правки в задаче.</p>
          <button class="btn-primary mb-2" type="button" @click="saveAndContinue">Сохранить</button>
          <button class="btn-secondary mb-2" type="button" @click="discardAndContinue">Не сохранять</button>
          <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="unsavedModal = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete recurring -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="deleteModal" class="overlay" @click="deleteModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="deleteModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-2 text-lg font-bold text-sber-black">Удалить повторяющуюся задачу?</h3>
          <p class="mb-4 text-sm text-sber-gray">Выберите, что именно удалить.</p>
          <button class="btn-primary mb-2" type="button" @click="deleteTaskOccurrence">
            Удалить только этот повтор
          </button>
          <button class="btn-secondary mb-2" type="button" @click="deleteAllOccurrences">
            Удалить все повторения
          </button>
          <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="deleteModal = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Search, X, AlertCircle, Sun, Sunset, Moon, Star, Clock, CheckCircle2, Calendar, Paperclip, Check, Bell, RefreshCw } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import { getApiErrorMessage, getApiFieldError } from '~/utils/api'
import { defaultDurationEnd, validateDurationFields, validateRepeatInterval } from '~/utils/time'
import { priorityColor } from '~/utils/priority-colors'
import { resolveMediaUrl } from '~/utils/media'

definePageMeta({ layout: 'app' })

const route = useRoute()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const prioritySelectOptions = [
  { value: 'high', label: 'Высокий', color: '#FF3B30' },
  { value: 'medium', label: 'Средний', color: '#FF9500' },
  { value: 'low', label: 'Низкий', color: '#34C759' },
  { value: 'none', label: 'Без приоритета', color: '#8E8E93' },
]

const notificationSelectOptions = [
  { value: '', label: 'Без уведомления' },
  { value: '0', label: 'В момент срока' },
  { value: '1', label: 'За 1 минуту' },
  { value: '5', label: 'За 5 минут' },
  { value: '15', label: 'За 15 минут' },
  { value: '30', label: 'За 30 минут' },
  { value: '60', label: 'За 1 час' },
  { value: '1440', label: 'За 1 день' },
  { value: 'custom', label: 'Своё время…' },
]

const repeatSelectOptions = [
  { value: 'none', label: 'Не повторять' },
  { value: 'daily', label: 'Каждый день' },
  { value: 'weekly', label: 'Каждую неделю' },
  { value: 'monthly', label: 'Каждый месяц' },
  { value: 'yearly', label: 'Каждый год' },
  { value: 'custom', label: 'Настроить повторение' },
]

const matrixBlocks = [
  { id: 'urgent-important' as const, title: 'Срочно и важно', color: '#FF3B30' },
  { id: 'not-urgent-important' as const, title: 'Не срочно, но важно', color: '#007AFF' },
  { id: 'urgent-not-important' as const, title: 'Срочно, не важно', color: '#FF9500' },
  { id: 'not-urgent-not-important' as const, title: 'Не срочно, не важно', color: '#8E8E93' },
]

const attachmentInputRef = ref<HTMLInputElement | null>(null)
const attachmentName = ref('')
const attachmentMimeType = ref('')
const attachmentDataUrl = ref('')
const attachmentRemoved = ref(false)
const attachmentIsImage = computed(() =>
  !!attachmentDataUrl.value
  && (attachmentMimeType.value.startsWith('image/')
    || /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|$)/i.test(attachmentDataUrl.value)),
)
const customNotifyMinutes = ref(10)
const PRESET_NOTIFY = new Set(['', '0', '1', '5', '15', '30', '60', '1440', 'custom'])

const showSearch = ref(false)
const searchQuery = ref('')
const desktopSelectedTaskId = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isDesktop = ref(false)
const desktopSplitRef = ref<HTMLElement | null>(null)
const leftPaneWidth = ref(52)
let removeResizeListeners: (() => void) | null = null

// Only set on the client — SSR would use the server timezone and can show
// e.g. "Доброй ночи" while the user is in the afternoon locally.
const nowHour = ref<number | null>(null)
let greetingTimer: ReturnType<typeof setInterval> | null = null

function localHour(): number {
  return new Date().getHours()
}

function greetingForHour(hour: number): string {
  // 05:00–11:59 утро · 12:00–16:59 день · 17:00–22:59 вечер · 23:00–04:59 ночь
  if (hour >= 5 && hour < 12) return 'Доброе утро ☀️'
  if (hour >= 12 && hour < 17) return 'Добрый день 🌤'
  if (hour >= 17 && hour < 23) return 'Добрый вечер 🌙'
  return 'Доброй ночи 🌙'
}

if (import.meta.client) {
  nowHour.value = localHour()
}

const greeting = computed(() => {
  if (nowHour.value === null) return ''
  return greetingForHour(nowHour.value)
})

const stats = computed(() => [
  { label: 'Просрочено', count: tasksStore.overdueTasks.length, color: '#FF3B30' },
  { label: 'Сегодня', count: tasksStore.todayTasks.length, color: '#FF9500' },
  { label: 'Завтра', count: tasksStore.tomorrowTasks.length, color: '#007AFF' },
])

const allGroups = computed(() => [
  {
    id: 'overdue',
    title: 'Просрочено',
    tasks: tasksStore.overdueTasks,
    color: '#FF3B30',
    surface: '#FDEAEA',
    icon: AlertCircle,
  },
  {
    id: 'today',
    title: 'Сегодня',
    tasks: tasksStore.todayTasks,
    color: '#FF9500',
    surface: '#FFF7E0',
    icon: Sun,
  },
  {
    id: 'tomorrow',
    title: 'Завтра',
    tasks: tasksStore.tomorrowTasks,
    color: '#007AFF',
    surface: '#EEF4FF',
    icon: Sunset,
  },
  {
    id: 'later',
    title: 'Позже',
    tasks: tasksStore.laterTasks,
    color: '#AF52DE',
    surface: '#F6EEFF',
    icon: Calendar,
  },
  {
    id: 'nodate',
    title: 'Без срока',
    tasks: tasksStore.noDateTasks,
    color: '#8E8E93',
    surface: '#FFF8E6',
    icon: Clock,
  },
  {
    id: 'completed',
    title: 'Выполнено',
    tasks: tasksStore.completedTasks,
    color: '#21A038',
    surface: '#ECF8EF',
    icon: CheckCircle2,
  },
])

const visibleGroups = computed(() =>
  allGroups.value.filter(g => settingsStore.isGroupVisible(g.id))
)

const allTasksList = computed(() => [...tasksStore.tasks])

const allDesktopGroups = computed(() => ([
  { id: 'all', title: 'Все задачи', color: '#5856D6', tasks: allTasksList.value },
  { id: 'overdue', title: 'Просрочено', color: '#FF3B30', tasks: tasksStore.overdueTasks },
  { id: 'today', title: 'Сегодня', color: '#FF9500', tasks: tasksStore.todayTasks },
  { id: 'tomorrow', title: 'Завтра', color: '#007AFF', tasks: tasksStore.tomorrowTasks },
  { id: 'later', title: 'Позже', color: '#AF52DE', tasks: tasksStore.laterTasks },
  { id: 'nodate', title: 'Без срока', color: '#8E8E93', tasks: tasksStore.noDateTasks },
  { id: 'completed', title: 'Готово', color: '#21A038', tasks: tasksStore.completedTasks },
]))

/** Respect settings «Разделы списка задач» — hide disabled chips. */
const desktopGroups = computed(() =>
  allDesktopGroups.value.filter(group =>
    group.id === 'all' || settingsStore.isGroupVisible(group.id),
  ),
)

const activeDesktopGroupId = ref('all')
const activeDesktopGroup = computed(() =>
  desktopGroups.value.find(group => group.id === activeDesktopGroupId.value) || desktopGroups.value[0]
)
const activeDesktopTasks = computed(() => activeDesktopGroup.value?.tasks || [])
const desktopSelectedTask = computed(() =>
  tasksStore.tasks.find(task => task.id === desktopSelectedTaskId.value) || null
)

const searchResults = ref<Task[]>([])
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (query) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  searchDebounceTimer = setTimeout(async () => {
    try {
      searchResults.value = await tasksStore.searchTasks(query)
    }
    catch {
      searchResults.value = []
    }
  }, 300)
})

const desktopEditorError = ref('')
const desktopRepeatErrors = reactive({
  interval: '',
  weekdays: '',
  monthDay: '',
})

function clearDesktopRepeatErrors() {
  desktopRepeatErrors.interval = ''
  desktopRepeatErrors.weekdays = ''
  desktopRepeatErrors.monthDay = ''
}

function hasDesktopRepeatErrors() {
  return !!(desktopRepeatErrors.interval || desktopRepeatErrors.weekdays || desktopRepeatErrors.monthDay)
}

const editorForm = reactive({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
  notification: '',
  repeat: 'none' as RepeatType,
  matrixBlock: 'not-urgent-not-important' as NonNullable<Task['matrixBlock']>,
})

const desktopCustomRepeat = reactive({
  interval: 1,
  unit: 'week' as 'week' | 'month',
  weekdays: [1] as number[],
  monthDay: dayjs().date(),
})

const {
  pauseSync: pauseEditorTimeSync,
  resumeSync: resumeEditorTimeSync,
  markEndEdited: markEditorEndEdited,
  resetEndEdited: resetEditorEndEdited,
  adoptLoadedDuration: adoptEditorLoadedDuration,
} = useTaskTimeSync(editorForm)

const editorSnapshot = ref('')
const unsavedModal = ref(false)
const deleteModal = ref(false)
let pendingUnsavedAction: (() => void) | null = null
let pendingDeleteTaskId: string | null = null

const weekDays = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 7 },
]

function captureEditorSnapshot() {
  editorSnapshot.value = JSON.stringify({
    ...editorForm,
    customRepeat: { ...desktopCustomRepeat },
    customNotifyMinutes: customNotifyMinutes.value,
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
  })
}

const editorDirty = computed(() => {
  if (!desktopSelectedTaskId.value) return false
  const current = JSON.stringify({
    ...editorForm,
    customRepeat: { ...desktopCustomRepeat },
    customNotifyMinutes: customNotifyMinutes.value,
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
  })
  return current !== editorSnapshot.value
})

function runWithUnsavedGuard(action: () => void) {
  if (!editorDirty.value) {
    action()
    return
  }
  pendingUnsavedAction = action
  unsavedModal.value = true
}

function selectDesktopGroup(groupId: string) {
  runWithUnsavedGuard(() => {
    activeDesktopGroupId.value = groupId
    desktopSelectedTaskId.value = null
  })
}

function selectDesktopTask(id: string) {
  if (desktopSelectedTaskId.value === id) return
  runWithUnsavedGuard(() => {
    desktopSelectedTaskId.value = id
  })
}

async function saveAndContinue() {
  await saveDesktopTask()
  if (desktopEditorError.value || hasDesktopRepeatErrors()) return
  unsavedModal.value = false
  const action = pendingUnsavedAction
  pendingUnsavedAction = null
  action?.()
}

function discardAndContinue() {
  unsavedModal.value = false
  const task = desktopSelectedTask.value
  syncEditorForm(task)
  captureEditorSnapshot()
  const action = pendingUnsavedAction
  pendingUnsavedAction = null
  action?.()
}

onBeforeRouteLeave((to) => {
  if (!editorDirty.value) return true
  if (unsavedModal.value) return false
  pendingUnsavedAction = () => {
    // Re-trigger the same navigation once the edit state is resolved.
    void navigateTo(to.fullPath)
  }
  unsavedModal.value = true
  return false
})

function openTask(id: string) {
  const fromSearch = searchResults.value.find(t => t.id === id)
  const fromStore = tasksStore.tasks.find(t => t.id === id)

  if (isDesktop.value) {
    // Search payload can be fresher than the grouped list cache — merge it in
    // so the task appears in the correct left-pane group.
    if (fromSearch) {
      tasksStore.upsertTaskInState(fromSearch)
    }

    const task = tasksStore.tasks.find(t => t.id === id) || fromSearch || fromStore
    const groupId = findDesktopGroupIdForTask(id)
      || (task ? resolveTaskGroupId(task) : 'all')

    runWithUnsavedGuard(() => {
      activeDesktopGroupId.value = groupId
      desktopSelectedTaskId.value = id
    })
    showSearch.value = false
    searchQuery.value = ''
    return
  }
  navigateTo({ path: '/app/new-task', query: { id, returnTo: '/app' } })
}

/** Prefer the group that actually contains the task in the left list. */
function findDesktopGroupIdForTask(taskId: string): string | null {
  for (const group of desktopGroups.value) {
    if (group.id === 'all') continue
    if (group.tasks.some(t => t.id === taskId)) return group.id
  }
  return null
}

function resolveTaskGroupId(task: Task): string {
  // Derive from completed + due date. Do not trust stale list_key from the API
  // (after «Восстановить» it often stays «completed» and hides the task in Позже).
  let groupId = 'all'
  if (task.completed) {
    groupId = 'completed'
  }
  else {
    const d = task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : ''
    if (!d) groupId = 'nodate'
    else {
      const today = dayjs().format('YYYY-MM-DD')
      const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
      if (dayjs(d).isBefore(today, 'day')) groupId = 'overdue'
      else if (d === today) groupId = 'today'
      else if (d === tomorrow) groupId = 'tomorrow'
      else groupId = 'later'
    }
  }
  // Hidden sections → open in «Все задачи»
  if (groupId !== 'all' && !settingsStore.isGroupVisible(groupId)) {
    return 'all'
  }
  return groupId
}

async function toggleSearch() {
  showSearch.value = !showSearch.value

  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

function handlePageClick() {
  if (showSearch.value) {
    showSearch.value = false
  }
}

function syncEditorForm(task: Task | null) {
  desktopEditorError.value = ''
  clearDesktopRepeatErrors()
  pauseEditorTimeSync()
  editorForm.title = task?.title || ''
  editorForm.description = task?.description || ''
  editorForm.dueDate = task?.dueDate || ''
  editorForm.dueTime = task?.dueTime || ''
  editorForm.durationStart = task?.duration?.start || ''
  editorForm.durationEnd = task?.duration?.end || ''
  if (editorForm.durationStart && !editorForm.durationEnd) {
    editorForm.durationEnd = defaultDurationEnd(editorForm.durationStart)
  }
  adoptEditorLoadedDuration(editorForm.durationStart, editorForm.durationEnd)
  editorForm.priority = task?.priority || 'none'
  const notify = task?.notification || ''
  if (notify && !PRESET_NOTIFY.has(notify)) {
    editorForm.notification = 'custom'
    customNotifyMinutes.value = Number(notify) || 10
  } else {
    editorForm.notification = notify
  }
  editorForm.repeat = task?.repeat || 'none'
  editorForm.matrixBlock = task?.matrixBlock || 'not-urgent-not-important'

  desktopCustomRepeat.interval = task?.repeatCustom?.interval || 1
  desktopCustomRepeat.unit = task?.repeatCustom?.unit || (task?.repeatDays?.length ? 'week' : 'week')
  desktopCustomRepeat.weekdays = task?.repeatCustom?.weekdays?.length
    ? [...task.repeatCustom.weekdays]
    : task?.repeatDays?.length
      ? [...task.repeatDays]
      : [1]
  desktopCustomRepeat.monthDay = task?.repeatCustom?.monthDay || dayjs().date()

  attachmentRemoved.value = false
  if (task?.attachment?.dataUrl) {
    attachmentName.value = task.attachment.name
    attachmentMimeType.value = task.attachment.mimeType
    attachmentDataUrl.value = resolveMediaUrl(task.attachment.dataUrl) || task.attachment.dataUrl
  } else if (task?.imageUrl) {
    attachmentName.value = 'attachment'
    attachmentMimeType.value = 'image/*'
    attachmentDataUrl.value = resolveMediaUrl(task.imageUrl) || task.imageUrl
  } else {
    clearAttachment()
    attachmentRemoved.value = false
  }
  nextTick(() => {
    resumeEditorTimeSync()
    captureEditorSnapshot()
  })
}

function handleAttachmentChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (input) input.value = ''
  if (!file) return

  attachmentRemoved.value = false
  attachmentName.value = file.name
  attachmentMimeType.value = file.type || 'application/octet-stream'
  const reader = new FileReader()
  reader.onload = () => {
    attachmentDataUrl.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

function clearAttachment() {
  attachmentName.value = ''
  attachmentMimeType.value = ''
  attachmentDataUrl.value = ''
  attachmentRemoved.value = true
  if (attachmentInputRef.value) attachmentInputRef.value.value = ''
}

async function saveDesktopTask() {
  const task = desktopSelectedTask.value
  if (!task) return

  desktopEditorError.value = ''
  clearDesktopRepeatErrors()
  const durationError = validateDurationFields(editorForm.durationStart, editorForm.durationEnd)
  if (durationError) {
    desktopEditorError.value = durationError
    return
  }

  const updates: Partial<Task> = {
    title: editorForm.title.trim() || task.title,
    description: editorForm.description.trim() || undefined,
    dueDate: editorForm.dueDate || undefined,
    dueTime: editorForm.dueTime || undefined,
    priority: editorForm.priority,
    notification: editorForm.notification || undefined,
    repeat: editorForm.repeat,
    matrixBlock: editorForm.matrixBlock,
  }

  if (editorForm.repeat === 'custom') {
    const intervalError = validateRepeatInterval(Number(desktopCustomRepeat.interval))
    if (intervalError) {
      desktopRepeatErrors.interval = intervalError
      return
    }
    const interval = Math.min(31, Math.max(1, Number(desktopCustomRepeat.interval) || 1))
    const monthDay = Number(desktopCustomRepeat.monthDay) || 1
    if (desktopCustomRepeat.unit === 'month' && (monthDay < 1 || monthDay > 31)) {
      desktopRepeatErrors.monthDay = 'День месяца должен быть от 1 до 31'
      return
    }
    if (desktopCustomRepeat.unit === 'week' && desktopCustomRepeat.weekdays.length === 0) {
      desktopRepeatErrors.weekdays = 'Выберите хотя бы один день недели'
      return
    }
    const clampedMonthDay = Math.min(31, Math.max(1, monthDay))
    const weekdays = [...desktopCustomRepeat.weekdays].sort((a, b) => a - b)

    updates.repeatCustom = {
      interval,
      unit: desktopCustomRepeat.unit,
      weekdays: desktopCustomRepeat.unit === 'week' ? weekdays : undefined,
      monthDay: desktopCustomRepeat.unit === 'month' ? clampedMonthDay : undefined,
    }
    updates.repeatDays = desktopCustomRepeat.unit === 'week' ? weekdays : undefined
  } else {
    updates.repeatCustom = undefined
    updates.repeatDays = undefined
  }

  if (editorForm.notification === 'custom') {
    updates.notification = String(Math.max(0, customNotifyMinutes.value || 0))
  } else {
    updates.notification = editorForm.notification || undefined
  }

  if (editorForm.durationStart && editorForm.durationEnd) {
    updates.duration = { start: editorForm.durationStart, end: editorForm.durationEnd }
  } else {
    updates.duration = undefined
  }

  if (attachmentDataUrl.value?.startsWith('data:')) {
    updates.attachment = {
      name: attachmentName.value,
      mimeType: attachmentMimeType.value || 'application/octet-stream',
      dataUrl: attachmentDataUrl.value,
    }
  } else if (attachmentRemoved.value) {
    updates.attachment = undefined
    updates.imageUrl = undefined
    updates.attachments = []
  }

  try {
    await tasksStore.updateTask(task.id, updates)
    captureEditorSnapshot()
  }
  catch (err: unknown) {
    desktopEditorError.value = getApiFieldError(err, 'end_at')
      || getApiErrorMessage(err, 'Не удалось сохранить задачу')
  }
}

function toggleDesktopTaskCheck(id: string) {
  tasksStore.completeTask(id)
}

function hasDesktopTaskMeta(task: Task) {
  return !!(
    task.dueDate
    || task.dueTime
    || (task.duration?.start && task.duration?.end)
    || (task.notification !== undefined && task.notification !== '')
    || (task.repeat && task.repeat !== 'none')
  )
}

function formatDesktopTaskDate(dueDate: string) {
  const d = dayjs(dueDate)
  return d.isValid() ? d.format('DD.MM.YY') : dueDate
}

async function toggleDesktopTaskComplete() {
  const task = desktopSelectedTask.value
  if (!task) return
  const id = task.id
  const wasCompleted = task.completed
  await tasksStore.completeTask(id)
  if (!wasCompleted) return
  // After restore, jump to the date-based section (Позже / Просрочено / …).
  const restored = tasksStore.tasks.find(t => t.id === id)
  if (!restored || restored.completed) return
  const groupId = findDesktopGroupIdForTask(id) || resolveTaskGroupId(restored)
  if (groupId && groupId !== activeDesktopGroupId.value) {
    activeDesktopGroupId.value = groupId
  }
}

function confirmDeleteDesktopTask() {
  const task = desktopSelectedTask.value
  if (!task) return
  requestDeleteTask(task.id)
}

function requestDeleteTask(id: string) {
  const task = tasksStore.tasks.find(t => t.id === id)
    || (desktopSelectedTask.value?.id === id ? desktopSelectedTask.value : null)
  if (task && tasksStore.isRecurringTask(task)) {
    pendingDeleteTaskId = id
    deleteModal.value = true
    return
  }
  deleteDesktopTask(id)
}

function deleteDesktopTask(id: string) {
  tasksStore.deleteTask(id)
  if (desktopSelectedTaskId.value === id) {
    desktopSelectedTaskId.value = null
  }
}

async function deleteTaskOccurrence() {
  if (!pendingDeleteTaskId) return
  const id = pendingDeleteTaskId
  deleteModal.value = false
  pendingDeleteTaskId = null
  await tasksStore.deleteOccurrence(id)
  if (desktopSelectedTaskId.value === id) {
    desktopSelectedTaskId.value = null
  }
}

function deleteAllOccurrences() {
  if (!pendingDeleteTaskId) return
  const id = pendingDeleteTaskId
  deleteModal.value = false
  pendingDeleteTaskId = null
  tasksStore.deleteSeries(id)
  if (desktopSelectedTaskId.value === id) {
    desktopSelectedTaskId.value = null
  }
}

function clearDesktopSelection() {
  desktopSelectedTaskId.value = null
}

function toggleDesktopCustomWeekday(day: number) {
  desktopRepeatErrors.weekdays = ''
  if (desktopCustomRepeat.weekdays.includes(day)) {
    desktopCustomRepeat.weekdays = desktopCustomRepeat.weekdays.filter(v => v !== day)
    if (desktopCustomRepeat.weekdays.length === 0) {
      desktopCustomRepeat.weekdays = [1]
    }
    return
  }
  desktopCustomRepeat.weekdays = [...desktopCustomRepeat.weekdays, day].sort((a, b) => a - b)
}

function formatTaskDate(task: Task) {
  if (!task.dueDate) return ''
  return dayjs(task.dueDate).format('DD.MM.YY')
}

function formatNotification(value?: string) {
  if (!value) return ''
  if (value === '0') return 'в срок'
  if (value === '60') return 'за 1ч'
  if (value === '1440') return 'за 1д'
  return `за ${value}м`
}

function formatRepeat(task: Task) {
  const labels: Record<string, string> = {
    daily: 'ежедневно',
    weekly: 'еженед.',
    monthly: 'ежемес.',
    yearly: 'ежегодно',
    custom: 'кастом',
  }
  return labels[task.repeat] || ''
}

function formatPriority(priority: Priority) {
  const labels: Record<Priority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    none: 'Без приор.',
  }
  return labels[priority]
}

function updateDesktopFlag() {
  isDesktop.value = window.innerWidth >= 1024
}

function startResizing(event: PointerEvent) {
  const container = desktopSplitRef.value
  if (!container) return
  event.preventDefault()

  const onMove = (moveEvent: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const nextWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100
    leftPaneWidth.value = Math.max(34, Math.min(72, nextWidth))
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    removeResizeListeners = null
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp, { once: true })
  removeResizeListeners = onUp
}

watch(desktopSelectedTask, (task) => {
  syncEditorForm(task)
}, { immediate: true })

watch(() => editorForm.dueDate, (newDate) => {
  if (newDate !== '') return
  editorForm.dueTime = ''
  editorForm.durationStart = ''
  editorForm.durationEnd = ''
  resetEditorEndEdited()
})

function onEditorDurationEndInput(val: string) {
  desktopEditorError.value = ''
  if (!val?.trim()) resetEditorEndEdited()
  else markEditorEndEdited()
}

watch(activeDesktopTasks, (tasks) => {
  if (!desktopSelectedTaskId.value) return
  if (tasks.some(task => task.id === desktopSelectedTaskId.value)) return

  const id = desktopSelectedTaskId.value
  // Switch to the group that actually holds the task instead of dropping selection.
  const groupId = findDesktopGroupIdForTask(id)
  if (groupId && groupId !== activeDesktopGroupId.value) {
    activeDesktopGroupId.value = groupId
    return
  }
  if (tasksStore.tasks.some(t => t.id === id)) {
    if (activeDesktopGroupId.value !== 'all') {
      activeDesktopGroupId.value = 'all'
      return
    }
  }
  desktopSelectedTaskId.value = null
})

// Keep the left list on the group that actually contains the selected task
// (e.g. after opening a task from search). The "Все задачи" view is left alone.
watch(desktopSelectedTaskId, (id) => {
  if (!id || activeDesktopGroupId.value === 'all') return
  const contained = findDesktopGroupIdForTask(id)
  if (contained) {
    if (contained !== activeDesktopGroupId.value) {
      activeDesktopGroupId.value = contained
    }
    return
  }
  const task = tasksStore.tasks.find(t => t.id === id)
  if (!task) return
  const groupId = resolveTaskGroupId(task)
  if (activeDesktopGroupId.value !== groupId) {
    activeDesktopGroupId.value = groupId
  }
})

watch(desktopGroups, (groups) => {
  if (groups.some(group => group.id === activeDesktopGroupId.value)) return
  activeDesktopGroupId.value = groups[0]?.id || 'all'
}, { immediate: true })

watch(
  () => route.query.group,
  (group) => {
    if (group === 'all') {
      activeDesktopGroupId.value = 'all'
    }
  },
  { immediate: true },
)

onMounted(() => {
  updateDesktopFlag()
  window.addEventListener('resize', updateDesktopFlag)
  nowHour.value = localHour()
  greetingTimer = setInterval(() => {
    nowHour.value = localHour()
  }, 60_000)
  if (!tasksStore.initialized) {
    void tasksStore.fetchGrouped()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDesktopFlag)
  removeResizeListeners?.()
  if (greetingTimer) clearInterval(greetingTimer)
})
</script>
