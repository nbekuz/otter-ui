/** Half-open intervals [start, end) — overlap check for calendar layout. */
export function intervalsOverlapHalfOpen(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Side-by-side columns for overlapping timed events (Google Calendar style).
 */
export function assignTimelineOverlapLayout(
  segments: Array<{ id: string; rawStart: number; rawEnd: number }>,
): Map<string, { col: number; cols: number }> {
  const layout = new Map<string, { col: number; cols: number }>()
  const n = segments.length
  if (n === 0) return layout

  const visited = new Array(n).fill(false)

  for (let startIdx = 0; startIdx < n; startIdx++) {
    if (visited[startIdx]) continue

    const stack: number[] = [startIdx]
    visited[startIdx] = true
    const comp: number[] = []

    while (stack.length) {
      const u = stack.pop()!
      comp.push(u)
      for (let v = 0; v < n; v++) {
        if (visited[v]) continue
        const su = segments[u]
        const sv = segments[v]
        if (intervalsOverlapHalfOpen(su.rawStart, su.rawEnd, sv.rawStart, sv.rawEnd)) {
          visited[v] = true
          stack.push(v)
        }
      }
    }

    const endpoints: Array<{ t: number; d: number }> = []
    for (const idx of comp) {
      const s = segments[idx]
      endpoints.push({ t: s.rawStart, d: 1 })
      endpoints.push({ t: s.rawEnd, d: -1 })
    }
    endpoints.sort((a, b) => (a.t !== b.t ? a.t - b.t : a.d - b.d))
    let sweep = 0
    let maxConc = 0
    for (const e of endpoints) {
      sweep += e.d
      maxConc = Math.max(maxConc, sweep)
    }
    const cols = Math.max(1, maxConc)

    const sortedIdx = [...comp].sort((ai, bi) => {
      const a = segments[ai]
      const b = segments[bi]
      if (a.rawStart !== b.rawStart) return a.rawStart - b.rawStart
      return b.rawEnd - a.rawEnd
    })

    const columnEnds: number[] = []
    for (const idx of sortedIdx) {
      const t = segments[idx]
      let col = columnEnds.findIndex(end => end <= t.rawStart)
      if (col === -1) {
        col = columnEnds.length
        columnEnds.push(t.rawEnd)
      } else {
        columnEnds[col] = t.rawEnd
      }
      layout.set(t.id, { col, cols })
    }
  }

  return layout
}

export function timelineTaskHorizontalStyle(
  layoutCols: number,
  layoutCol: number,
  pad = 4,
  gap = 3,
): Record<string, string> {
  const cols = Math.max(1, Number(layoutCols) || 1)
  const col = Math.min(Math.max(0, Number(layoutCol) || 0), cols - 1)

  if (cols <= 1) {
    return { left: `${pad}px`, right: `${pad}px`, width: 'auto', minWidth: '0' }
  }

  const gapsTotal = gap * (cols - 1)
  const innerPx = 2 * pad + gapsTotal
  return {
    left: `calc(${pad}px + (100% - ${innerPx}px) * ${col} / ${cols} + ${gap * col}px)`,
    width: `calc((100% - ${innerPx}px) / ${cols})`,
    right: 'auto',
    minWidth: '0',
  }
}
