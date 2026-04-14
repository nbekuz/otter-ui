import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderTeleport } from "vue/server-renderer";
import { Settings, Square, Pause, Play, SkipForward, Target, ChevronRight, Music, Search, X, Check } from "lucide-vue-next";
import { d as defineStore, a as defaultPomodoroSettings, w as workSoundOptions, s as soundOptions } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useTasksStore } from "./tasks-BcYdj5cJ.js";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const usePomodoroStore = defineStore("pomodoro", () => {
  const settings = ref({ ...defaultPomodoroSettings });
  const state = ref("idle");
  const secondsLeft = ref(settings.value.duration * 60);
  const selectedTaskId = ref(null);
  const sessionCount = ref(0);
  const isBreak = ref(false);
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
  function start() {
    if (state.value === "idle" || state.value === "paused") {
      state.value = "running";
      intervalId = setInterval();
    }
  }
  function pause() {
    if (state.value === "running") {
      state.value = "paused";
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }
  function stop() {
    state.value = "idle";
    isBreak.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    secondsLeft.value = settings.value.duration * 60;
  }
  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings };
    if (state.value === "idle") {
      secondsLeft.value = settings.value.duration * 60;
    }
  }
  function selectTask(taskId) {
    selectedTaskId.value = taskId;
  }
  return {
    settings,
    state,
    secondsLeft,
    totalSeconds,
    progress,
    displayTime,
    selectedTaskId,
    sessionCount,
    isBreak,
    start,
    pause,
    stop,
    updateSettings,
    selectTask
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pomodoro",
  __ssrInlineRender: true,
  setup(__props) {
    const pomodoroStore = usePomodoroStore();
    const tasksStore = useTasksStore();
    const settingsOpen = ref(false);
    const taskPickerOpen = ref(false);
    const taskSearch = ref("");
    const activeWorkSound = ref("rain");
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex flex-col bg-sber-gray-light" }, _attrs))}><div class="flex items-center justify-between px-4 pt-14 pb-4 lg:px-6"><h1 class="text-xl font-bold text-sber-black">Помодоро</h1><button class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition-colors active:bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-sber-black" }, null, _parent));
      _push(`</button></div><div class="flex-1 px-4 pb-6 lg:px-6"><div class="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start"><div class="rounded-[32px] bg-white px-6 py-6 shadow-card"><div class="mb-6 flex justify-center gap-2"><!--[-->`);
      ssrRenderList(unref(pomodoroStore).settings.sessionsUntilLong, (i) => {
        _push(`<div class="${ssrRenderClass([i <= unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong || unref(pomodoroStore).sessionCount > 0 && unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong === 0 ? "bg-sber-green" : "bg-sber-gray-mid", "h-2 w-8 rounded-full transition-colors"])}"></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col items-center justify-center"><div class="relative mb-8 h-64 w-64 rounded-full bg-sber-gray-light"><svg class="h-full w-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="rgba(142,142,147,0.18)" stroke-width="6"></circle><circle cx="50" cy="50" r="45" fill="none"${ssrRenderAttr("stroke", unref(pomodoroStore).isBreak ? "#007AFF" : "#21A038")} stroke-width="6" stroke-linecap="round"${ssrRenderAttr("stroke-dasharray", `${283 * unref(pomodoroStore).progress} 283`)} style="${ssrRenderStyle({ transition: "stroke-dasharray 1s linear" })}"></circle></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><p class="text-5xl font-bold tracking-tight text-sber-black">${ssrInterpolate(unref(pomodoroStore).displayTime)}</p>`);
      if (unref(pomodoroStore).state === "paused") {
        _push(`<p class="mt-1 text-sm text-sber-gray">На паузе</p>`);
      } else if (unref(pomodoroStore).isBreak) {
        _push(`<p class="mt-1 text-sm text-sber-blue">Перерыв</p>`);
      } else {
        _push(`<p class="mt-1 text-sm text-sber-gray">${ssrInterpolate(unref(pomodoroStore).state === "running" ? "Фокус" : "Готов")}</p>`);
      }
      _push(`</div></div><div class="flex items-center gap-6"><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid disabled:opacity-50"${ssrIncludeBooleanAttr(unref(pomodoroStore).state === "idle") ? " disabled" : ""}>`);
      _push(ssrRenderComponent(unref(Square), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><button class="${ssrRenderClass([unref(pomodoroStore).state === "running" ? "bg-sber-blue" : "bg-sber-green", "flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"])}">`);
      if (unref(pomodoroStore).state === "running") {
        _push(ssrRenderComponent(unref(Pause), { class: "h-8 w-8 text-white" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Play), { class: "ml-1 h-8 w-8 text-white" }, null, _parent));
      }
      _push(`</button><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid">`);
      _push(ssrRenderComponent(unref(SkipForward), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button></div></div></div><div class="space-y-3"><button class="flex w-full items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm transition-colors active:bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(Target), { class: "w-5 h-5 text-sber-green" }, null, _parent));
      _push(`<div class="flex-1 text-left"><p class="text-xs text-sber-gray">Задача для фокуса</p><p class="text-sm font-medium text-sber-black truncate">${ssrInterpolate(unref(selectedTask)?.title || "Выбрать задачу...")}</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
      _push(`</button><div class="flex items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm">`);
      _push(ssrRenderComponent(unref(Music), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`<span class="text-sm text-sber-gray flex-1">Звук фоновый</span><div class="flex gap-2 flex-wrap justify-end"><!--[-->`);
      ssrRenderList(unref(workSoundOptions).slice(0, 4), (s) => {
        _push(`<button class="${ssrRenderClass([unref(activeWorkSound) === s.id ? "bg-sber-green text-white" : "bg-sber-gray-light text-sber-gray", "text-sm px-2 py-1 rounded-lg transition-colors"])}">${ssrInterpolate(s.icon)}</button>`);
      });
      _push(`<!--]--></div></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(taskPickerOpen)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(taskPickerOpen)) {
          _push2(`<div class="app-modal px-4 py-5" style="${ssrRenderStyle({ "max-height": "75dvh", "overflow-y": "auto" })}"><h3 class="text-lg font-bold text-sber-black mb-3">Выбрать задачу</h3><div class="relative mb-4">`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(taskSearch))} placeholder="Поиск..." class="input-field pl-11 py-3 text-sm"></div><button class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 bg-sber-gray-light text-sber-gray text-sm">`);
          _push2(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
          _push2(` Без задачи </button><!--[-->`);
          ssrRenderList(unref(filteredTasks), (task) => {
            _push2(`<div class="${ssrRenderClass([unref(pomodoroStore).selectedTaskId === task.id ? "bg-sber-green-light" : "bg-white border border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 cursor-pointer transition-colors active:bg-sber-gray-light"])}"><div class="w-3 h-3 rounded-full flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) })}"></div><p class="text-sm text-sber-black font-medium flex-1 truncate">${ssrInterpolate(task.title)}</p>`);
            if (unref(pomodoroStore).selectedTaskId === task.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-sber-green" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          });
          _push2(`<!--]--></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsOpen)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(settingsOpen)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black mb-5">Настройки Помодоро</h3><div class="mb-5"><label class="text-sm font-semibold text-sber-black mb-3 block"> Длительность: ${ssrInterpolate(unref(pomodoroStore).settings.duration)} мин </label><div class="flex gap-2 flex-wrap"><!--[-->`);
          ssrRenderList([15, 20, 25, 30, 45, 60], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.duration === d ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}">${ssrInterpolate(d)} мин </button>`);
          });
          _push2(`<!--]--></div></div><div class="mb-5"><label class="text-sm font-semibold text-sber-black mb-3 block"> Короткий перерыв: ${ssrInterpolate(unref(pomodoroStore).settings.shortBreak)} мин </label><div class="flex gap-2"><!--[-->`);
          ssrRenderList([3, 5, 7, 10], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.shortBreak === d ? "bg-sber-blue text-white border-sber-blue" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}">${ssrInterpolate(d)} мин </button>`);
          });
          _push2(`<!--]--></div></div><div class="flex items-center justify-between py-3 border-b border-sber-gray-light mb-5"><div><p class="text-sm font-medium text-sber-black">Показывать при блокировке</p><p class="text-xs text-sber-gray">На экране блокировки смартфона</p></div><button class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}"><div class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}"></div></button></div><div class="mb-5"><label class="text-sm font-semibold text-sber-black mb-3 block">Звук завершения</label><div class="flex gap-2 flex-wrap"><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.sound === s.id ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"])}">${ssrInterpolate(s.icon)} ${ssrInterpolate(s.name)}</button>`);
          });
          _push2(`<!--]--></div></div><button class="btn-primary">Готово</button></div>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=pomodoro-CKHKf7xe.js.map
