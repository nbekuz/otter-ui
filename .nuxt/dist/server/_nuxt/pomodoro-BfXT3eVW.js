import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderTeleport } from "vue/server-renderer";
import { Settings, Target, ChevronRight, Music, Square, Pause, Play, SkipForward, Search, X, Check } from "lucide-vue-next";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import { f as defineStore, j as defaultPomodoroSettings, k as apiGet, l as apiPatch, m as apiPost, c as useTasksStore, _ as _export_sfc } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
let backgroundAudio = null;
let backgroundUrl = null;
let effectAudio = null;
function stopEffectAudio() {
  if (effectAudio) {
    effectAudio.pause();
    effectAudio.currentTime = 0;
    effectAudio.src = "";
    effectAudio = null;
  }
}
function stopBackgroundAudio() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    backgroundAudio.src = "";
    backgroundAudio = null;
  }
  backgroundUrl = null;
}
function pauseBackgroundAudio() {
  backgroundAudio?.pause();
}
function playBackgroundLoop(url) {
  if (!url) {
    stopBackgroundAudio();
    return;
  }
  if (backgroundUrl === url && backgroundAudio) {
    if (!backgroundAudio.paused) return;
    void backgroundAudio.play().catch(() => {
    });
    return;
  }
  stopEffectAudio();
  stopBackgroundAudio();
  backgroundUrl = url;
  backgroundAudio = new Audio(url);
  backgroundAudio.loop = true;
  void backgroundAudio.play().catch(() => {
  });
}
function playSoundOnce(url) {
  if (!url) return;
  stopEffectAudio();
  effectAudio = new Audio(url);
  effectAudio.loop = false;
  void effectAudio.play().catch(() => {
  });
}
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
function apiToPomodoroSettings(data) {
  return {
    duration: data.duration_minutes,
    shortBreak: data.short_break_minutes ?? defaultPomodoroSettings.shortBreak,
    longBreak: defaultPomodoroSettings.longBreak,
    sessionsUntilLong: defaultPomodoroSettings.sessionsUntilLong,
    sound: data.timer_end_sound,
    workingSound: data.work_sound,
    showOnLockScreen: data.show_on_lock_screen
  };
}
function pomodoroToApiPatch(updates) {
  const patch = {};
  if (updates.duration !== void 0) patch.duration_minutes = updates.duration;
  if (updates.shortBreak !== void 0) patch.short_break_minutes = updates.shortBreak;
  if (updates.sound !== void 0) patch.timer_end_sound = updates.sound;
  if (updates.workingSound !== void 0) patch.work_sound = updates.workingSound;
  if (updates.showOnLockScreen !== void 0) patch.show_on_lock_screen = updates.showOnLockScreen;
  return patch;
}
const usePomodoroStore = defineStore("pomodoro", () => {
  const settings = ref({ ...defaultPomodoroSettings });
  const timerEndSoundDetail = ref(null);
  const workSoundDetail = ref(null);
  const state = ref("idle");
  const secondsLeft = ref(settings.value.duration * 60);
  const selectedTaskId = ref(null);
  const sessionCount = ref(0);
  const isBreak = ref(false);
  const activeSessionId = ref(null);
  const sessions = ref([]);
  let intervalId = null;
  const totalSeconds = computed(
    () => isBreak.value ? (sessionCount.value % settings.value.sessionsUntilLong === 0 ? settings.value.longBreak : settings.value.shortBreak) * 60 : settings.value.duration * 60
  );
  const progress = computed(
    () => 1 - secondsLeft.value / totalSeconds.value
  );
  const displayTime = computed(() => {
    const m = Math.floor(secondsLeft.value / 60).toString().padStart(2, "0");
    const s = (secondsLeft.value % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  });
  function applySettingsResponse(data) {
    settings.value = apiToPomodoroSettings(data);
    timerEndSoundDetail.value = data.timer_end_sound_detail ?? null;
    workSoundDetail.value = data.work_sound_detail ?? null;
  }
  function syncBackgroundAudio() {
    if (state.value === "paused") {
      return;
    }
    if (state.value !== "running" || isBreak.value) {
      stopBackgroundAudio();
      return;
    }
    const key = settings.value.workingSound;
    if (key === "none") {
      stopBackgroundAudio();
      return;
    }
    const url = workSoundDetail.value?.audio_url;
    if (url) playBackgroundLoop(url);
    else stopBackgroundAudio();
  }
  function previewSound(sound) {
    if (!sound || sound.key === "none") return;
    playSoundOnce(sound.audio_url);
  }
  async function fetchSettings() {
    const data = await apiGet("pomodoro/settings/");
    applySettingsResponse(data);
    if (state.value === "idle") {
      secondsLeft.value = settings.value.duration * 60;
    }
  }
  async function fetchSessions() {
    sessions.value = await apiGet("pomodoro/sessions/");
    return sessions.value;
  }
  async function syncSessionState(nextState) {
    if (!activeSessionId.value) return;
    const updated = await apiPost(
      `pomodoro/sessions/${activeSessionId.value}/state/`,
      { state: nextState }
    );
    const idx = sessions.value.findIndex((s) => s.id === updated.id);
    if (idx === -1) sessions.value.unshift(updated);
    else sessions.value[idx] = updated;
  }
  async function ensureSession() {
    if (activeSessionId.value) return;
    await startSession(selectedTaskId.value);
  }
  async function start() {
    if (state.value === "idle" || state.value === "paused") {
      try {
        await ensureSession();
      } catch {
        return;
      }
      state.value = "running";
      void syncSessionState("running");
      stopEffectAudio();
      syncBackgroundAudio();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      intervalId = setInterval();
    }
  }
  function pause() {
    if (state.value === "running") {
      state.value = "paused";
      pauseBackgroundAudio();
      void syncSessionState("paused");
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }
  function stop() {
    state.value = "idle";
    isBreak.value = false;
    stopBackgroundAudio();
    void syncSessionState("stopped");
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    secondsLeft.value = settings.value.duration * 60;
    activeSessionId.value = null;
  }
  async function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings };
    if (state.value === "idle") {
      secondsLeft.value = settings.value.duration * 60;
    }
    const patch = pomodoroToApiPatch(newSettings);
    if (Object.keys(patch).length > 0) {
      const updated = await apiPatch("pomodoro/settings/", patch);
      applySettingsResponse(updated);
      if (state.value === "running") syncBackgroundAudio();
    }
  }
  async function setWorkSound(key, sound) {
    if (sound) workSoundDetail.value = sound;
    const isRunning = state.value === "running";
    if (isRunning) stopEffectAudio();
    await updateSettings({ workingSound: key });
    if (!isRunning) previewSound(sound);
  }
  async function setTimerEndSound(key, sound) {
    if (sound) timerEndSoundDetail.value = sound;
    await updateSettings({ sound: key });
    previewSound(sound);
  }
  async function startSession(taskId) {
    const payload = {
      duration_minutes: settings.value.duration
    };
    if (taskId) payload.task = Number(taskId);
    const session = await apiPost("pomodoro/sessions/", payload);
    activeSessionId.value = session.id;
    selectedTaskId.value = taskId || null;
    sessions.value.unshift(session);
  }
  function selectTask(taskId) {
    selectedTaskId.value = taskId;
  }
  return {
    settings,
    timerEndSoundDetail,
    workSoundDetail,
    state,
    secondsLeft,
    totalSeconds,
    progress,
    displayTime,
    selectedTaskId,
    sessionCount,
    isBreak,
    activeSessionId,
    sessions,
    fetchSettings,
    fetchSessions,
    start,
    pause,
    stop,
    updateSettings,
    setWorkSound,
    setTimerEndSound,
    previewSound,
    startSession,
    selectTask,
    stopBackgroundAudio
  };
});
const useSoundsStore = defineStore("sounds", () => {
  const workBackground = ref([]);
  const timerEnd = ref([]);
  const loading = ref(false);
  async function fetchCategory(category) {
    return apiGet("sounds/", { params: { category } });
  }
  async function fetchAll() {
    loading.value = true;
    try {
      const [work, end] = await Promise.all([
        fetchCategory("work_background"),
        fetchCategory("timer_end")
      ]);
      workBackground.value = work.sort((a, b) => a.sort_order - b.sort_order);
      timerEnd.value = end.sort((a, b) => a.sort_order - b.sort_order);
    } finally {
      loading.value = false;
    }
  }
  function findWorkSound(key) {
    return workBackground.value.find((s) => s.key === key);
  }
  function findTimerEndSound(key) {
    return timerEnd.value.find((s) => s.key === key);
  }
  return {
    workBackground,
    timerEnd,
    loading,
    fetchAll,
    fetchCategory,
    findWorkSound,
    findTimerEndSound
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pomodoro",
  __ssrInlineRender: true,
  setup(__props) {
    const pomodoroStore = usePomodoroStore();
    const soundsStore = useSoundsStore();
    const tasksStore = useTasksStore();
    const settingsOpen = ref(false);
    const taskPickerOpen = ref(false);
    const taskSearch = ref("");
    const progressPercent = computed(() => Math.round(Math.max(0, Math.min(1, pomodoroStore.progress)) * 100));
    const waterFillStyle = computed(() => {
      const activeColor = pomodoroStore.isBreak ? "#007AFF" : "#21A038";
      return {
        height: `${progressPercent.value}%`,
        background: `linear-gradient(180deg, ${activeColor}CC 0%, ${activeColor}99 100%)`
      };
    });
    const selectedTask = computed(
      () => tasksStore.tasks.find((t) => t.id === pomodoroStore.selectedTaskId)
    );
    const filteredTasks = computed(() => {
      const activeTasks = tasksStore.tasks.filter((t) => !t.completed);
      if (!taskSearch.value) return activeTasks;
      return activeTasks.filter((t) => t.title.toLowerCase().includes(taskSearch.value.toLowerCase()));
    });
    function getPriorityColor(priority) {
      const colors = {
        high: "#FF3B30",
        medium: "#FF9500",
        low: "#34C759",
        none: "#8E8E93"
      };
      return colors[priority] || "#8E8E93";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex min-h-0 flex-col bg-sber-gray-light lg:h-full" }, _attrs))} data-v-d4710e3c><div class="page-header-top flex shrink-0 items-center justify-between px-4 pb-3 lg:px-6" data-v-d4710e3c><h1 class="text-xl font-bold text-sber-black" data-v-d4710e3c>Помодоро</h1><button class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition-colors active:bg-sber-gray-light" data-v-d4710e3c>`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-sber-black" }, null, _parent));
      _push(`</button></div><div class="flex min-h-0 flex-1 flex-col px-4 pb-4 lg:px-6" data-v-d4710e3c><div class="mx-auto flex w-full max-w-4xl min-h-0 flex-1 flex-col gap-4" data-v-d4710e3c><div class="grid gap-3 lg:grid-cols-2" data-v-d4710e3c><button class="flex min-w-0 w-full items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm transition-colors active:bg-sber-gray-light" data-v-d4710e3c>`);
      _push(ssrRenderComponent(unref(Target), { class: "h-5 w-5 shrink-0 text-sber-green" }, null, _parent));
      _push(`<div class="min-w-0 flex-1 text-left" data-v-d4710e3c><p class="text-xs text-sber-gray" data-v-d4710e3c>Задача для фокуса</p><p class="truncate text-sm font-medium text-sber-black" data-v-d4710e3c>${ssrInterpolate(unref(selectedTask)?.title || "Выбрать задачу...")}</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button><div class="flex items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm" data-v-d4710e3c>`);
      _push(ssrRenderComponent(unref(Music), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`<span class="flex-1 text-sm text-sber-gray" data-v-d4710e3c>Звук фоновый</span><div class="flex flex-wrap justify-end gap-2" data-v-d4710e3c><!--[-->`);
      ssrRenderList(unref(soundsStore).workBackground, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(pomodoroStore).settings.workingSound === s.key ? "bg-sber-green text-white" : "bg-sber-gray-light text-sber-gray", "rounded-lg px-2 py-1 text-sm transition-colors"])}"${ssrRenderAttr("title", s.title)} data-v-d4710e3c>${ssrInterpolate(s.emoji)}</button>`);
      });
      _push(`<!--]--></div></div></div><div class="mx-auto flex w-full min-h-0 flex-1 flex-col justify-center rounded-[32px] bg-white px-6 py-6 shadow-card lg:px-10 lg:py-8" data-v-d4710e3c><div class="mb-4 flex justify-center gap-2 lg:mb-6" data-v-d4710e3c><!--[-->`);
      ssrRenderList(unref(pomodoroStore).settings.sessionsUntilLong, (i) => {
        _push(`<div class="${ssrRenderClass([i <= unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong || unref(pomodoroStore).sessionCount > 0 && unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong === 0 ? "bg-sber-green" : "bg-sber-gray-mid", "h-2 w-8 rounded-full transition-colors"])}" data-v-d4710e3c></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col items-center justify-center" data-v-d4710e3c><div class="relative mb-6 flex h-64 w-64 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light/60 p-3 shadow-inner lg:mb-8 lg:h-[min(52vh,28rem)] lg:w-[min(52vh,28rem)] lg:p-4" data-v-d4710e3c><div class="relative h-[224px] w-[224px] overflow-hidden rounded-full bg-white lg:h-[calc(100%-1.5rem)] lg:w-[calc(100%-1.5rem)]" data-v-d4710e3c><div class="absolute inset-x-0 bottom-0 transition-all duration-500" style="${ssrRenderStyle(unref(waterFillStyle))}" data-v-d4710e3c><div class="water-wave water-wave-1" data-v-d4710e3c></div><div class="water-wave water-wave-2" data-v-d4710e3c></div></div></div><div class="absolute inset-0 z-20 flex flex-col items-center justify-center" data-v-d4710e3c><p class="text-5xl font-bold tracking-tight text-sber-black lg:text-7xl" data-v-d4710e3c>${ssrInterpolate(unref(pomodoroStore).displayTime)}</p>`);
      if (unref(pomodoroStore).state === "paused") {
        _push(`<p class="mt-1 text-sm text-sber-gray" data-v-d4710e3c>На паузе</p>`);
      } else if (unref(pomodoroStore).isBreak) {
        _push(`<p class="mt-1 text-sm text-sber-blue" data-v-d4710e3c>Перерыв</p>`);
      } else {
        _push(`<p class="mt-1 text-sm text-sber-gray" data-v-d4710e3c>${ssrInterpolate(unref(pomodoroStore).state === "running" ? "Фокус" : "Готов")}</p>`);
      }
      _push(`</div></div><div class="flex items-center gap-6" data-v-d4710e3c><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid disabled:opacity-50"${ssrIncludeBooleanAttr(unref(pomodoroStore).state === "idle") ? " disabled" : ""} data-v-d4710e3c>`);
      _push(ssrRenderComponent(unref(Square), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><button class="${ssrRenderClass([unref(pomodoroStore).state === "running" ? "bg-sber-blue" : "bg-sber-green", "flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"])}" data-v-d4710e3c>`);
      if (unref(pomodoroStore).state === "running") {
        _push(ssrRenderComponent(unref(Pause), { class: "h-8 w-8 text-white" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Play), { class: "ml-1 h-8 w-8 text-white" }, null, _parent));
      }
      _push(`</button><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid" data-v-d4710e3c>`);
      _push(ssrRenderComponent(unref(SkipForward), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button></div></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(taskPickerOpen)) {
          _push2(`<div class="overlay" data-v-d4710e3c></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(taskPickerOpen)) {
          _push2(`<div class="app-modal flex max-h-[75dvh] flex-col px-4 py-5" data-v-d4710e3c><h3 class="mb-3 text-lg font-bold text-sber-black" data-v-d4710e3c>Выбрать задачу</h3><div class="sticky top-0 z-10 shrink-0 bg-white pb-2" data-v-d4710e3c><div class="relative mb-3" data-v-d4710e3c>`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(taskSearch))} placeholder="Поиск..." class="input-field py-3 pl-11 text-sm" data-v-d4710e3c></div><button class="mb-2 flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-sm text-sber-gray" data-v-d4710e3c>`);
          _push2(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
          _push2(` Без задачи </button></div><div class="min-h-0 flex-1 overflow-y-auto" data-v-d4710e3c><!--[-->`);
          ssrRenderList(unref(filteredTasks), (task) => {
            _push2(`<div class="${ssrRenderClass([unref(pomodoroStore).selectedTaskId === task.id ? "bg-sber-green-light" : "border border-sber-gray-light bg-white", "mb-2 flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-colors active:bg-sber-gray-light"])}" data-v-d4710e3c><div class="h-3 w-3 shrink-0 rounded-full" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) })}" data-v-d4710e3c></div><p class="flex-1 truncate text-sm font-medium text-sber-black" data-v-d4710e3c>${ssrInterpolate(task.title)}</p>`);
            if (unref(pomodoroStore).selectedTaskId === task.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "h-4 w-4 text-sber-green" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          });
          _push2(`<!--]--></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsOpen)) {
          _push2(`<div class="overlay" data-v-d4710e3c></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(settingsOpen)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-d4710e3c><h3 class="text-lg font-bold text-sber-black mb-5" data-v-d4710e3c>Настройки Помодоро</h3><div class="mb-5" data-v-d4710e3c><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-d4710e3c> Длительность: ${ssrInterpolate(unref(pomodoroStore).settings.duration)} мин </label><div class="flex gap-2 flex-wrap" data-v-d4710e3c><!--[-->`);
          ssrRenderList([15, 20, 25, 30, 45, 60], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.duration === d ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}" data-v-d4710e3c>${ssrInterpolate(d)} мин </button>`);
          });
          _push2(`<!--]--></div></div><div class="mb-5" data-v-d4710e3c><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-d4710e3c> Короткий перерыв: ${ssrInterpolate(unref(pomodoroStore).settings.shortBreak)} мин </label><div class="flex gap-2" data-v-d4710e3c><!--[-->`);
          ssrRenderList([3, 5, 7, 10], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.shortBreak === d ? "bg-sber-blue text-white border-sber-blue" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}" data-v-d4710e3c>${ssrInterpolate(d)} мин </button>`);
          });
          _push2(`<!--]--></div></div><div class="flex items-center justify-between py-3 border-b border-sber-gray-light mb-5" data-v-d4710e3c><div data-v-d4710e3c><p class="text-sm font-medium text-sber-black" data-v-d4710e3c>Показывать при блокировке</p><p class="text-xs text-sber-gray" data-v-d4710e3c>На экране блокировки смартфона</p></div><button class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-d4710e3c><div class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-d4710e3c></div></button></div><div class="mb-5" data-v-d4710e3c><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-d4710e3c>Звук завершения</label><div class="flex gap-2 flex-wrap" data-v-d4710e3c><!--[-->`);
          ssrRenderList(unref(soundsStore).timerEnd, (s) => {
            _push2(`<button type="button" class="${ssrRenderClass([unref(pomodoroStore).settings.sound === s.key ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"])}" data-v-d4710e3c>${ssrInterpolate(s.emoji)} ${ssrInterpolate(s.title)}</button>`);
          });
          _push2(`<!--]--></div></div><button class="btn-primary" data-v-d4710e3c>Готово</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/pomodoro.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pomodoro = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d4710e3c"]]);
export {
  pomodoro as default
};
//# sourceMappingURL=pomodoro-BfXT3eVW.js.map
