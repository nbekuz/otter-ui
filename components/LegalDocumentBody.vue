<template>
  <div class="legal-document-body space-y-3 text-sm leading-relaxed text-sber-gray">
    <p
      v-for="(block, index) in blocks"
      :key="index"
      :class="blockClass(block)"
    >
      {{ block.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ content: string }>()

interface Block {
  kind: 'h1' | 'h2' | 'p'
  text: string
}

const blocks = computed(() => {
  const result: Block[] = []
  for (const rawLine of props.content.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('_')) continue
    if (line.startsWith('# ')) {
      result.push({ kind: 'h1', text: line.slice(2).trim() })
      continue
    }
    if (line.startsWith('## ')) {
      result.push({ kind: 'h2', text: line.slice(3).trim() })
      continue
    }
    result.push({ kind: 'p', text: line.replace(/\*\*/g, '') })
  }
  return result
})

function blockClass(block: Block) {
  if (block.kind === 'h1') {
    return 'text-lg font-bold text-sber-black'
  }
  if (block.kind === 'h2') {
    return 'pt-2 text-base font-semibold text-sber-black'
  }
  return 'whitespace-pre-wrap'
}
</script>
