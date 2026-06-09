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
      placeholder="ЧЧ:ММ"
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
import { formatMinutesToTime, parseTimeToMinutes } from '~/utils/time'

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

function formatHHMM(v: string): string {
  if (!v?.trim()) return ''
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(v.trim())
  if (!m) return ''
  const h = Math.min(23, Math.max(0, parseInt(m[1]!, 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2]!, 10)))
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

watch(() => props.modelValue, (v) => {
  textValue.value = formatHHMM(v)
}, { immediate: true })

function onTextInput(e: Event) {
  textValue.value = (e.target as HTMLInputElement).value
}

function parseText(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const formatted = formatHHMM(trimmed)
  if (!formatted) return ''
  parseTimeToMinutes(formatted)
  return formatted
}

function commitText() {
  if (!textValue.value.trim()) {
    emit('update:modelValue', '')
    textValue.value = ''
    return
  }
  const parsed = parseText(textValue.value)
  if (parsed) {
    emit('update:modelValue', parsed)
    textValue.value = parsed
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (textValue.value === '') {
      emit('update:modelValue', '')
    }
  }
  emit('keydown', e)
}

function onPickerInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  emit('update:modelValue', raw ? formatHHMM(raw) : '')
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
