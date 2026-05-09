<template>
  <Teleport to="body">
    <Transition name="app-global-toast">
      <div
        v-if="toast.visible"
        class="fixed left-1/2 top-[max(5rem,env(safe-area-inset-top,0px)+1rem)] z-[100] flex max-w-[min(100vw-2rem,420px)] -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg"
        :class="toast.type === 'success'
          ? 'border-sber-green bg-sber-green-light'
          : 'border-red-300 bg-red-50'"
        role="status"
      >
        <CheckCircle
          class="h-5 w-5 flex-shrink-0"
          :class="toast.type === 'success' ? 'text-sber-green' : 'text-red-500'"
          aria-hidden="true"
        />
        <p
          class="text-sm font-medium"
          :class="toast.type === 'success' ? 'text-sber-green' : 'text-red-600'"
        >
          {{ toast.message }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next'

const { toast } = useAppToast()
</script>

<style scoped>
.app-global-toast-enter-active,
.app-global-toast-leave-active {
  transition: all 0.3s ease;
}
.app-global-toast-enter-from,
.app-global-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
