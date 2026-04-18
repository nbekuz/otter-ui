<template>
  <div
    class="relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20"
    :class="wrapperClass"
  >
    <div
      class="input-field pointer-events-none flex min-h-0 items-center pr-9 text-left"
      :class="fieldClass"
    >
      <span :class="displayText ? 'text-sber-black' : 'text-sber-gray'">
        {{ displayText || '__.__.____' }}
      </span>
    </div>
    <input
      ref="nativeRef"
      type="date"
      class="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"
      :value="modelValue"
      @input="onPick"
      @change="onPick"
      @keydown="emit('keydown', $event)"
    >
    <Calendar
      class="pointer-events-none absolute right-2 top-1/2 z-[2] h-3.5 w-3.5 -translate-y-1/2 text-sber-green lg:right-4 lg:h-4 lg:w-4"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { Calendar } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string
  /** Classes merged onto the visible field (input-field + sizes) */
  fieldClass?: string
  /** Optional outer wrapper classes */
  wrapperClass?: string
}>(), {
  modelValue: '',
  fieldClass: '',
  wrapperClass: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string]; keydown: [e: KeyboardEvent] }>()

const nativeRef = ref<HTMLInputElement | null>(null)

const displayText = computed(() => {
  if (!props.modelValue) return ''
  const d = dayjs(props.modelValue)
  return d.isValid() ? d.format('DD.MM.YYYY') : ''
})

function onPick(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
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
