<template>
  <div
    class="relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20"
    :class="wrapperClass"
    @click="openPicker"
  >
    <input
      ref="textRef"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      placeholder="чч:мм"
      maxlength="5"
      class="input-field w-full cursor-text pr-9 text-left tabular-nums"
      :class="fieldClass"
      :value="textValue"
      @input="onTextInput"
      @blur="commitText"
      @keydown="onKeydown"
      @click.stop
    >
    <input
      ref="pickerRef"
      type="time"
      lang="ru-RU"
      step="60"
      class="sr-only"
      tabindex="-1"
      :value="modelValue"
      @input="onPickerInput"
      @change="onPickerInput"
    >
    <button
      type="button"
      class="absolute right-2 top-1/2 z-[2] -translate-y-1/2 rounded-lg p-0.5 text-sber-green hover:bg-sber-green-light lg:right-4"
      tabindex="-1"
      @click.stop="openPicker"
    >
      <Clock class="h-3.5 w-3.5 lg:h-4 lg:w-4" />
    </button>
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

const textRef = ref<HTMLInputElement | null>(null)
const pickerRef = ref<HTMLInputElement | null>(null)
const textValue = ref('')

/**
 * Keep only digits (max 4) and format as HH:MM.
 * - hours clamped to 00–23 when 2 digits present
 * - minute tens digit limited to 0–5
 */
function maskAsHHMM(raw: string): string {
  let digits = raw.replace(/\D/g, '').slice(0, 4)
  if (!digits) return ''

  // If first hour digit is 3–9, treat as 0X (e.g. 9 → 09)
  if (digits.length >= 1 && digits[0]! >= '3') {
    digits = `0${digits}`.slice(0, 4)
  }

  let hh = digits.slice(0, Math.min(2, digits.length))
  let mm = digits.length > 2 ? digits.slice(2) : ''

  if (hh.length === 2) {
    const n = Math.min(23, parseInt(hh, 10))
    hh = String(n).padStart(2, '0')
  }

  if (mm.length >= 1 && mm[0]! >= '6') {
    mm = `5${mm.slice(1)}`.slice(0, 2)
  }
  if (mm.length === 2) {
    const n = Math.min(59, parseInt(mm, 10))
    mm = String(n).padStart(2, '0')
  }

  return mm ? `${hh}:${mm}` : hh
}

function toStrictHHMM(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (!digits) return ''

  let normalized = digits
  if (normalized[0]! >= '3') {
    normalized = `0${normalized}`.slice(0, 4)
  }

  let h = normalized.slice(0, Math.min(2, normalized.length)).padStart(2, '0')
  let min = (normalized.length > 2 ? normalized.slice(2) : '').padEnd(2, '0')
  h = String(Math.min(23, parseInt(h, 10) || 0)).padStart(2, '0')
  min = String(Math.min(59, parseInt(min, 10) || 0)).padStart(2, '0')
  return `${h}:${min}`
}

watch(() => props.modelValue, (v) => {
  if (!v?.trim()) {
    textValue.value = ''
    return
  }
  textValue.value = toStrictHHMM(v)
}, { immediate: true })

function onTextInput(e: Event) {
  const el = e.target as HTMLInputElement
  const next = maskAsHHMM(el.value)
  textValue.value = next
  el.value = next

  if (/^\d{2}:\d{2}$/.test(next)) {
    emit('update:modelValue', next)
  }
}

function commitText() {
  if (!textValue.value.trim()) {
    emit('update:modelValue', '')
    textValue.value = ''
    return
  }
  const parsed = toStrictHHMM(textValue.value)
  emit('update:modelValue', parsed)
  textValue.value = parsed
}

function onKeydown(e: KeyboardEvent) {
  const nav = new Set([
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End',
  ])
  if (nav.has(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
    if ((e.key === 'Backspace' || e.key === 'Delete') && textValue.value === '') {
      emit('update:modelValue', '')
    }
    if (e.key === 'Enter') commitText()
    emit('keydown', e)
    return
  }
  if (!/^\d$/.test(e.key) && e.key !== ':') {
    e.preventDefault()
  }
  emit('keydown', e)
}

function onPickerInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const formatted = raw ? toStrictHHMM(raw) : ''
  emit('update:modelValue', formatted)
  textValue.value = formatted
}

function openPicker() {
  const picker = pickerRef.value
  if (!picker) return
  if (typeof picker.showPicker === 'function') {
    try {
      picker.showPicker()
      return
    }
    catch {
      /* ignore */
    }
  }
  picker.click()
}

defineExpose({
  focus: () => textRef.value?.focus(),
})
</script>
