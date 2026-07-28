<template>
  <Teleport to="body">
    <Transition name="task-reminder-toast">
      <div
        v-if="toast.visible"
        class="pointer-events-auto fixed left-1/2 top-[max(1rem,env(safe-area-inset-top,0px)+0.75rem)] z-[110] flex max-w-[min(100vw-2rem,420px)] -translate-x-1/2 items-start gap-2.5 rounded-lg border border-black/5 bg-white px-3.5 py-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
        role="status"
        aria-live="polite"
      >
        <Bell class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
        <button
          type="button"
          class="min-w-0 flex-1 text-left"
          :disabled="!toast.taskId"
          @click="openTask"
        >
          <p class="text-sm font-medium leading-snug text-sber-black">
            {{ toast.title }}
          </p>
          <p
            v-if="toast.body"
            class="mt-0.5 line-clamp-2 text-xs leading-snug text-sber-gray"
          >
            {{ toast.body }}
          </p>
        </button>
        <button
          type="button"
          class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-sber-gray/70 hover:text-sber-black"
          aria-label="Закрыть"
          @click.stop="hideReminder"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Bell, X } from 'lucide-vue-next'

const route = useRoute()
const { toast, hideReminder } = useTaskReminderToast()

async function openTask() {
  const taskId = toast.value.taskId
  if (!taskId) return
  hideReminder()
  await navigateTo({
    path: '/app/new-task',
    query: { id: taskId, returnTo: route.fullPath },
  })
}
</script>

<style scoped>
.task-reminder-toast-enter-active,
.task-reminder-toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.task-reminder-toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -12px);
}
.task-reminder-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -16px);
}
</style>
