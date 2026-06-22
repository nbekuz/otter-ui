<template>
  <div :class="alignClass">
    <p class="text-xs leading-relaxed text-sber-gray">
      <template v-if="prefix">{{ prefix }} </template>
      <NuxtLink :to="termsTo" class="font-medium text-sber-green underline" @click.stop>
        {{ termsLabel }}
      </NuxtLink>
      <template v-if="inlinePrivacy">
        и
        <NuxtLink :to="privacyTo" class="font-medium text-sber-green underline" @click.stop>
          {{ privacyLabel }}
        </NuxtLink>
      </template>
      <template v-if="suffix">{{ suffix }}</template>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  prefix?: string
  suffix?: string
  termsLabel?: string
  privacyLabel?: string
  termsTo?: string
  privacyTo?: string
  align?: 'left' | 'center'
  inlinePrivacy?: boolean
}>(), {
  prefix: 'Продолжая, вы принимаете',
  suffix: '.',
  termsLabel: 'условия использования',
  privacyLabel: 'политику конфиденциальности',
  termsTo: '/legal/terms-of-use',
  privacyTo: '/legal/privacy-policy',
  align: 'center',
  inlinePrivacy: true,
})

const alignClass = computed(() =>
  props.align === 'left' ? 'text-left' : 'text-center',
)
</script>
