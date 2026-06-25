<template>
  <div class="legal-document-body space-y-4 text-sm leading-relaxed text-sber-gray">
    <template v-for="(block, index) in blocks" :key="index">
      <h1
        v-if="block.kind === 'h1'"
        class="text-lg font-bold text-sber-black"
        v-html="block.html"
      />

      <h2
        v-else-if="block.kind === 'h2'"
        class="pt-2 text-base font-semibold text-sber-black"
        v-html="block.html"
      />

      <h3
        v-else-if="block.kind === 'h3'"
        class="pt-1 text-sm font-semibold text-sber-black"
        v-html="block.html"
      />

      <p
        v-else-if="block.kind === 'p'"
        class="whitespace-pre-wrap"
        v-html="block.html"
      />

      <ul v-else-if="block.kind === 'list'" class="list-disc space-y-2 pl-5">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex" v-html="item" />
      </ul>

      <div v-else-if="block.kind === 'table'" class="overflow-x-auto">
        <table class="min-w-full border-collapse text-left text-sm text-sber-gray">
          <thead>
            <tr>
              <th
                v-for="(header, headerIndex) in block.headers"
                :key="headerIndex"
                class="border border-sber-gray-light bg-sber-gray-light px-3 py-2 font-semibold text-sber-black"
                v-html="header"
              />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="border border-sber-gray-light px-3 py-2 align-top"
                v-html="cell"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ content: string }>()

type TextBlock = {
  kind: 'h1' | 'h2' | 'h3' | 'p'
  html: string
}

type ListBlock = {
  kind: 'list'
  items: string[]
}

type TableBlock = {
  kind: 'table'
  headers: string[]
  rows: string[][]
}

type Block = TextBlock | ListBlock | TableBlock

const blocks = computed<Block[]>(() => {
  const result: Block[] = []
  const lines = props.content.split('\n')
  let index = 0

  while (index < lines.length) {
    const rawLine = lines[index] ?? ''
    const line = rawLine.trim()

    if (!line || line.startsWith('_')) {
      index += 1
      continue
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = []

      while (index < lines.length && (lines[index] ?? '').trim().startsWith('|')) {
        tableLines.push((lines[index] ?? '').trim())
        index += 1
      }

      const tableBlock = parseTable(tableLines)
      if (tableBlock) result.push(tableBlock)
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []

      while (index < lines.length) {
        const listLine = (lines[index] ?? '').trim()
        if (!listLine.startsWith('- ')) break
        items.push(formatInline(listLine.slice(2).trim()))
        index += 1
      }

      result.push({ kind: 'list', items })
      continue
    }

    if (line.startsWith('### ')) {
      result.push({ kind: 'h3', html: formatInline(line.slice(4).trim()) })
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      result.push({ kind: 'h2', html: formatInline(line.slice(3).trim()) })
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      result.push({ kind: 'h1', html: formatInline(line.slice(2).trim()) })
      index += 1
      continue
    }

    result.push({ kind: 'p', html: formatInline(line) })
    index += 1
  }

  if (result[0]?.kind === 'h1') {
    result.shift()
  }

  return result
})

function parseTable(lines: string[]): TableBlock | null {
  if (lines.length < 2) return null

  const rows = lines.map(parseTableRow)
  const [headers, separator, ...body] = rows

  if (!headers || !separator || !separator.every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')))) {
    return null
  }

  return {
    kind: 'table',
    headers: headers.map(formatInline),
    rows: body.map(row => row.map(formatInline)),
  }
}

function parseTableRow(line: string) {
  return line
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim())
}

function formatInline(value: string) {
  let html = escapeHtml(value)

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, (_, label: string, href: string) => {
    const safeHref = escapeAttribute(href)
    return `<a href="${safeHref}" class="font-medium text-sber-green underline underline-offset-2">${label}</a>`
  })

  return html
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttribute(value: string) {
  return escapeHtml(value)
}
</script>
