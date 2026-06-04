let backgroundAudio: HTMLAudioElement | null = null

export function stopBackgroundAudio() {
  if (backgroundAudio) {
    backgroundAudio.pause()
    backgroundAudio.currentTime = 0
    backgroundAudio = null
  }
}

export function playBackgroundLoop(url: string | null | undefined) {
  stopBackgroundAudio()
  if (!url) return
  backgroundAudio = new Audio(url)
  backgroundAudio.loop = true
  void backgroundAudio.play().catch(() => {})
}

export function playSoundOnce(url: string | null | undefined) {
  if (!url) return
  const audio = new Audio(url)
  void audio.play().catch(() => {})
}
