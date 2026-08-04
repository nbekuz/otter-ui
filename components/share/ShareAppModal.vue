<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="modalOpen"
        class="overlay"
        @click="closeShareModal"
      />
    </Transition>
    <Transition name="modal">
      <div
        v-if="modalOpen"
        class="app-modal px-5 py-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-app-title"
        @click.stop
      >
        <h3 id="share-app-title" class="mb-1 text-lg font-bold text-sber-black">
          Поделиться
        </h3>
        <p class="mb-4 text-sm text-sber-gray">
          {{ payload.text }}
        </p>

        <div class="mb-4 rounded-2xl bg-sber-gray-light px-3 py-2.5">
          <p class="truncate text-xs font-medium text-sber-green">{{ payload.url }}</p>
        </div>

        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="network in networks"
            :key="network.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left transition-colors hover:bg-sber-gray-mid/40 active:opacity-80"
            @click="shareViaNetwork(network.id)"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              :class="networkTone(network.id)"
            >
              {{ networkGlyph(network.id) }}
            </span>
            <span class="text-sm font-semibold text-sber-black">{{ network.label }}</span>
          </button>
        </div>

        <button
          type="button"
          class="btn-secondary mt-4"
          @click="closeShareModal"
        >
          Закрыть
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ShareNetworkId } from '~/utils/share-app'

const {
  modalOpen,
  payload,
  networks,
  closeShareModal,
  shareViaNetwork,
} = useAppShare()

function networkTone(id: ShareNetworkId): string {
  switch (id) {
    case 'telegram':
      return 'bg-[#229ED9]'
    case 'whatsapp':
      return 'bg-[#25D366]'
    case 'vk':
      return 'bg-[#0077FF]'
    case 'x':
      return 'bg-sber-black'
    case 'facebook':
      return 'bg-[#1877F2]'
    case 'email':
      return 'bg-sber-gray'
    case 'copy':
      return 'bg-sber-green'
    default:
      return 'bg-sber-gray'
  }
}

function networkGlyph(id: ShareNetworkId): string {
  switch (id) {
    case 'telegram':
      return 'TG'
    case 'whatsapp':
      return 'WA'
    case 'vk':
      return 'VK'
    case 'x':
      return 'X'
    case 'facebook':
      return 'f'
    case 'email':
      return '@'
    case 'copy':
      return '↗'
    default:
      return '•'
  }
}
</script>
