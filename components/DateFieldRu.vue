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
      placeholder="ДД.ММ.ГГГГ"
      class="input-field w-full cursor-text pr-9 text-left"
      :class="fieldClass"
      :value="textValue"
      @input="onTextInput"
      @blur="commitText"
      @keydown="onKeydown"
      @click.stop
    >
    <input
      ref="pickerRef"
      type="date"
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
      <Calendar class="h-3.5 w-3.5 lg:h-4 lg:w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Calendar } from 'lucide-vue-next'

dayjs.extend(customParseFormat)

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

watch(() => props.modelValue, (v) => {
  if (!v) {
    textValue.value = ''
    return
  }
  const d = dayjs(v)
  textValue.value = d.isValid() ? d.format('DD.MM.YYYY') : ''
}, { immediate: true })

function onTextInput(e: Event) {
  textValue.value = (e.target as HTMLInputElement).value
}

function parseText(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const iso = dayjs(trimmed, 'YYYY-MM-DD', true)
  if (iso.isValid()) return iso.format('YYYY-MM-DD')

  const dotted = dayjs(trimmed, 'DD.MM.YYYY', true)
  if (dotted.isValid()) return dotted.format('YYYY-MM-DD')

  const short = dayjs(trimmed, 'DD.MM.YY', true)
  if (short.isValid()) return short.format('YYYY-MM-DD')

  return ''
}

function commitText() {
  const parsed = parseText(textValue.value)
  if (!textValue.value.trim()) {
    emit('update:modelValue', '')
    textValue.value = ''
    return
  }
  if (parsed) {
    emit('update:modelValue', parsed)
    textValue.value = dayjs(parsed).format('DD.MM.YYYY')
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
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
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
