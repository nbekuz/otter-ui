<template>
  <div
    class="relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20"
    :class="wrapperClass"
  >
    <div
      class="input-field pointer-events-none flex min-h-0 items-center pr-9 text-left tabular-nums"
      :class="fieldClass"
    >
      <span :class="displayText ? 'text-sber-black' : 'text-sber-gray'">
        {{ displayText || '__:__' }}
      </span>
    </div>
    <input
      ref="nativeRef"
      type="time"
      lang="ru-RU"
      step="60"
      class="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"
      :value="modelValue"
      @input="onPick"
      @change="onPick"
      @keydown="emit('keydown', $event)"
    >
    <Clock
      class="pointer-events-none absolute right-2 top-1/2 z-[2] h-3.5 w-3.5 -translate-y-1/2 text-sber-green lg:right-4 lg:h-4 lg:w-4"
    />
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string
  fieldClass?: string
  wrapperClass?: string
}>(), {
  modelValue: '',
  fieldClass: '',
  wrapperClass: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string]; keydown: [e: KeyboardEvent] }>()

const nativeRef = ref<HTMLInputElement | null>(null)

/** Показ в 24ч (ЧЧ:ММ), значение в модели — как у input type="time" (ЧЧ:ММ). */
function formatHHMM(v: string): string {
  if (!v?.trim()) return ''
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(v.trim())
  if (!m) return ''
  const h = Math.min(23, Math.max(0, parseInt(m[1]!, 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2]!, 10)))
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

const displayText = computed(() => formatHHMM(props.modelValue))

function onPick(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  emit('update:modelValue', raw ? formatHHMM(raw) : '')
}

defineExpose({
  focus: () => {
    const el = nativeRef.value
    if (!el) return
    if (typeof el.showPicker === 'function') {
      try {
        el.showPicker()
        return
      } catch {
        /* ignore */
      }
    }
    el.focus()
  },
})
</script>
