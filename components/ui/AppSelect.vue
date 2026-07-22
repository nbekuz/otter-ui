<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

export type AppSelectOption = {
  value: string
  label: string
  color?: string
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: AppSelectOption[]
  placeholder?: string
  /** Compact trigger for inline badges (priority chip, etc.) */
  variant?: 'field' | 'inline'
  /** Extra classes on the trigger button */
  triggerClass?: string
}>(), {
  placeholder: 'Выберите',
  variant: 'field',
  triggerClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})

const selected = computed(() =>
  props.options.find(o => o.value === props.modelValue),
)

const selectedLabel = computed(() => selected.value?.label || props.placeholder)

const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.appSettings.theme === 'dark')

onClickOutside(rootRef, (event) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('[data-app-select-menu]')) return
  open.value = false
})

function updateMenuPosition() {
  const el = triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const menuMinWidth = props.variant === 'inline' ? 176 : rect.width
  const spaceBelow = window.innerHeight - rect.bottom
  const openUp = spaceBelow < 260 && rect.top > spaceBelow
  menuStyle.value = {
    position: 'fixed',
    left: `${Math.min(rect.left, window.innerWidth - menuMinWidth - 8)}px`,
    width: `${Math.max(menuMinWidth, rect.width)}px`,
    zIndex: '90',
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` }),
  }
}

watch(open, (isOpen) => {
  if (!isOpen) return
  nextTick(() => updateMenuPosition())
})

function selectOption(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div ref="rootRef" class="relative" :class="variant === 'inline' ? 'inline-block max-w-full' : 'w-full'">
    <button
      ref="triggerRef"
      type="button"
      class="group flex w-full items-center gap-2 text-left outline-none transition-colors"
      :class="[
        variant === 'field'
          ? 'input-field justify-between py-3 pr-3'
          : 'bg-transparent py-0.5 pr-1 text-xs font-medium',
        open && variant === 'field' ? 'border-sber-green bg-white ring-2 ring-sber-green/15' : '',
        triggerClass,
      ]"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span
        class="min-w-0 flex-1 truncate"
        :class="selected
          ? (variant === 'inline' ? '' : isDark ? 'text-white' : 'text-sber-black')
          : 'text-sber-gray'"
        :style="variant === 'inline' && selected?.color ? { color: selected.color } : undefined"
      >
        {{ selectedLabel }}
      </span>
      <ChevronDown
        class="shrink-0 transition-transform duration-200"
        :class="[
          variant === 'inline' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          open ? 'rotate-180 text-sber-green' : 'text-sber-gray',
        ]"
      />
    </button>

    <Teleport to="body">
      <Transition name="select-pop">
        <div
          v-if="open"
          data-app-select-menu
          class="overflow-hidden rounded-2xl border p-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.16)]"
          :class="isDark
            ? 'border-[#2a303a] bg-[#171a21]'
            : 'border-sber-gray-mid/70 bg-white'"
          :style="menuStyle"
          role="listbox"
        >
          <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            role="option"
            class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
            :class="opt.value === modelValue
              ? 'bg-sber-green text-white'
              : isDark
                ? 'text-slate-200 hover:bg-[#20242d]'
                : 'text-sber-black hover:bg-sber-green-light/70'"
            :aria-selected="opt.value === modelValue"
            @click="selectOption(opt.value)"
          >
            <span
              v-if="opt.color"
              class="h-2.5 w-2.5 shrink-0 rounded-full"
              :class="opt.value === modelValue ? 'ring-2 ring-white/50' : ''"
              :style="{ backgroundColor: opt.color }"
            />
            <span class="min-w-0 flex-1 truncate font-medium">{{ opt.label }}</span>
            <Check
              v-if="opt.value === modelValue"
              class="h-4 w-4 shrink-0 text-white"
            />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.select-pop-enter-active,
.select-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
