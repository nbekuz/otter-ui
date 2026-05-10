<template>
  <div class="flex gap-3" :class="[alignClass, wrapperClass]">
    <button
      :id="inputId"
      type="button"
      class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sber-green focus-visible:ring-offset-2"
      :class="modelValue ? 'border-sber-green bg-sber-green' : 'border-sber-gray-mid bg-white'"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-labelledby="labelId"
      @click="toggle"
    >
      <Check v-if="modelValue" class="h-4 w-4 text-white" stroke-width="3" />
    </button>
    <div :id="labelId" class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    /** `start` — ko‘p qatorli matn (terms); `center` — bir qator (Login «Запомнить») */
    align?: 'start' | 'center'
    /** Qo‘shimcha sinflar (masalan responsive) */
    wrapperClass?: string
  }>(),
  { align: 'start', wrapperClass: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const uid = useId()
const inputId = `${uid}-cb`
const labelId = `${uid}-label`

const alignClass = computed(() =>
  props.align === 'center' ? 'items-center' : 'items-start',
)

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>
