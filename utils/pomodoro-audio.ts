let backgroundAudio: HTMLAudioElement | null = null
let backgroundUrl: string | null = null
let effectAudio: HTMLAudioElement | null = null

export function stopEffectAudio() {
  if (effectAudio) {
    effectAudio.pause()
    effectAudio.currentTime = 0
    effectAudio.src = ''
    effectAudio = null
  }
}

/** To‘liq to‘xtatish — pozitsiya nolga (Stop, yangi ovoz, tugatish). */
export function stopBackgroundAudio() {
  if (backgroundAudio) {
    backgroundAudio.pause()
    backgroundAudio.currentTime = 0
    backgroundAudio.src = ''
    backgroundAudio = null
  }
  backgroundUrl = null
}

/** Pauza — keyingi Play shu joydan davom etadi. */
export function pauseBackgroundAudio() {
  backgroundAudio?.pause()
}

export function playBackgroundLoop(url: string | null | undefined) {
  if (!url) {
    stopBackgroundAudio()
    return
  }

  if (backgroundUrl === url && backgroundAudio) {
    if (!backgroundAudio.paused) return
    void backgroundAudio.play().catch(() => {})
    return
  }

  stopEffectAudio()
  stopBackgroundAudio()

  backgroundUrl = url
  backgroundAudio = new Audio(url)
  backgroundAudio.loop = true
  void backgroundAudio.play().catch(() => {})
}

export function playSoundOnce(url: string | null | undefined) {
  if (!url) return

  stopEffectAudio()

  effectAudio = new Audio(url)
  effectAudio.loop = false
  void effectAudio.play().catch(() => {})
}
