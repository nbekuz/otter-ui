import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { Settings, Target, ChevronRight, Music, Square, Pause, Play, SkipForward, Search, X, Check } from 'lucide-vue-next';
import { w as workSoundOptions, s as soundOptions, d as defineStore, b as defaultPomodoroSettings } from './server.mjs';
import { u as useTasksStore } from './tasks-NRltayIc.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'dayjs';

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
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex flex-col bg-sber-gray-light" }, _attrs))} data-v-b2a1fd71><div class="flex items-center justify-between px-4 pt-14 pb-4 lg:px-6" data-v-b2a1fd71><h1 class="text-xl font-bold text-sber-black" data-v-b2a1fd71>\u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E</h1><button class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition-colors active:bg-sber-gray-light" data-v-b2a1fd71>`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-sber-black" }, null, _parent));
      _push(`</button></div><div class="flex-1 px-4 pb-6 lg:px-6" data-v-b2a1fd71><div class="mx-auto max-w-3xl space-y-4" data-v-b2a1fd71><div class="grid gap-3 lg:grid-cols-2" data-v-b2a1fd71><button class="flex w-full items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm transition-colors active:bg-sber-gray-light" data-v-b2a1fd71>`);
      _push(ssrRenderComponent(unref(Target), { class: "h-5 w-5 text-sber-green" }, null, _parent));
      _push(`<div class="flex-1 text-left" data-v-b2a1fd71><p class="text-xs text-sber-gray" data-v-b2a1fd71>\u0417\u0430\u0434\u0430\u0447\u0430 \u0434\u043B\u044F \u0444\u043E\u043A\u0443\u0441\u0430</p><p class="truncate text-sm font-medium text-sber-black" data-v-b2a1fd71>${ssrInterpolate(((_a = unref(selectedTask)) == null ? void 0 : _a.title) || "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443...")}</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button><div class="flex items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm" data-v-b2a1fd71>`);
      _push(ssrRenderComponent(unref(Music), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`<span class="flex-1 text-sm text-sber-gray" data-v-b2a1fd71>\u0417\u0432\u0443\u043A \u0444\u043E\u043D\u043E\u0432\u044B\u0439</span><div class="flex flex-wrap justify-end gap-2" data-v-b2a1fd71><!--[-->`);
      ssrRenderList(unref(workSoundOptions).slice(0, 4), (s) => {
        _push(`<button class="${ssrRenderClass([unref(activeWorkSound) === s.id ? "bg-sber-green text-white" : "bg-sber-gray-light text-sber-gray", "rounded-lg px-2 py-1 text-sm transition-colors"])}" data-v-b2a1fd71>${ssrInterpolate(s.icon)}</button>`);
      });
      _push(`<!--]--></div></div></div><div class="mx-auto w-full rounded-[32px] bg-white px-6 py-6 shadow-card" data-v-b2a1fd71><div class="mb-6 flex justify-center gap-2" data-v-b2a1fd71><!--[-->`);
      ssrRenderList(unref(pomodoroStore).settings.sessionsUntilLong, (i) => {
        _push(`<div class="${ssrRenderClass([i <= unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong || unref(pomodoroStore).sessionCount > 0 && unref(pomodoroStore).sessionCount % unref(pomodoroStore).settings.sessionsUntilLong === 0 ? "bg-sber-green" : "bg-sber-gray-mid", "h-2 w-8 rounded-full transition-colors"])}" data-v-b2a1fd71></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col items-center justify-center" data-v-b2a1fd71><div class="relative mb-8 flex h-64 w-64 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light/60 p-3 shadow-inner" data-v-b2a1fd71><div class="relative h-[224px] w-[224px] overflow-hidden rounded-full bg-white" data-v-b2a1fd71><div class="absolute inset-x-0 bottom-0 transition-all duration-500" style="${ssrRenderStyle(unref(waterFillStyle))}" data-v-b2a1fd71><div class="water-wave water-wave-1" data-v-b2a1fd71></div><div class="water-wave water-wave-2" data-v-b2a1fd71></div></div></div><div class="absolute inset-0 z-20 flex flex-col items-center justify-center" data-v-b2a1fd71><p class="text-5xl font-bold tracking-tight text-sber-black" data-v-b2a1fd71>${ssrInterpolate(unref(pomodoroStore).displayTime)}</p>`);
      if (unref(pomodoroStore).state === "paused") {
        _push(`<p class="mt-1 text-sm text-sber-gray" data-v-b2a1fd71>\u041D\u0430 \u043F\u0430\u0443\u0437\u0435</p>`);
      } else if (unref(pomodoroStore).isBreak) {
        _push(`<p class="mt-1 text-sm text-sber-blue" data-v-b2a1fd71>\u041F\u0435\u0440\u0435\u0440\u044B\u0432</p>`);
      } else {
        _push(`<p class="mt-1 text-sm text-sber-gray" data-v-b2a1fd71>${ssrInterpolate(unref(pomodoroStore).state === "running" ? "\u0424\u043E\u043A\u0443\u0441" : "\u0413\u043E\u0442\u043E\u0432")}</p>`);
      }
      _push(`</div></div><div class="flex items-center gap-6" data-v-b2a1fd71><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid disabled:opacity-50"${ssrIncludeBooleanAttr(unref(pomodoroStore).state === "idle") ? " disabled" : ""} data-v-b2a1fd71>`);
      _push(ssrRenderComponent(unref(Square), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><button class="${ssrRenderClass([unref(pomodoroStore).state === "running" ? "bg-sber-blue" : "bg-sber-green", "flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"])}" data-v-b2a1fd71>`);
      if (unref(pomodoroStore).state === "running") {
        _push(ssrRenderComponent(unref(Pause), { class: "h-8 w-8 text-white" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Play), { class: "ml-1 h-8 w-8 text-white" }, null, _parent));
      }
      _push(`</button><button class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid" data-v-b2a1fd71>`);
      _push(ssrRenderComponent(unref(SkipForward), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button></div></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(taskPickerOpen)) {
          _push2(`<div class="overlay" data-v-b2a1fd71></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(taskPickerOpen)) {
          _push2(`<div class="app-modal px-4 py-5" style="${ssrRenderStyle({ "max-height": "75dvh", "overflow-y": "auto" })}" data-v-b2a1fd71><h3 class="text-lg font-bold text-sber-black mb-3" data-v-b2a1fd71>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443</h3><div class="relative mb-4" data-v-b2a1fd71>`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(taskSearch))} placeholder="\u041F\u043E\u0438\u0441\u043A..." class="input-field pl-11 py-3 text-sm" data-v-b2a1fd71></div><button class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 bg-sber-gray-light text-sber-gray text-sm" data-v-b2a1fd71>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
          _push2(` \u0411\u0435\u0437 \u0437\u0430\u0434\u0430\u0447\u0438 </button><!--[-->`);
          ssrRenderList(unref(filteredTasks), (task) => {
            _push2(`<div class="${ssrRenderClass([unref(pomodoroStore).selectedTaskId === task.id ? "bg-sber-green-light" : "bg-white border border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 cursor-pointer transition-colors active:bg-sber-gray-light"])}" data-v-b2a1fd71><div class="w-3 h-3 rounded-full flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) })}" data-v-b2a1fd71></div><p class="text-sm text-sber-black font-medium flex-1 truncate" data-v-b2a1fd71>${ssrInterpolate(task.title)}</p>`);
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
          _push2(`<div class="overlay" data-v-b2a1fd71></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(settingsOpen)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-b2a1fd71><h3 class="text-lg font-bold text-sber-black mb-5" data-v-b2a1fd71>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E</h3><div class="mb-5" data-v-b2a1fd71><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-b2a1fd71> \u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: ${ssrInterpolate(unref(pomodoroStore).settings.duration)} \u043C\u0438\u043D </label><div class="flex gap-2 flex-wrap" data-v-b2a1fd71><!--[-->`);
          ssrRenderList([15, 20, 25, 30, 45, 60], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.duration === d ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}" data-v-b2a1fd71>${ssrInterpolate(d)} \u043C\u0438\u043D </button>`);
          });
          _push2(`<!--]--></div></div><div class="mb-5" data-v-b2a1fd71><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-b2a1fd71> \u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0440\u044B\u0432: ${ssrInterpolate(unref(pomodoroStore).settings.shortBreak)} \u043C\u0438\u043D </label><div class="flex gap-2" data-v-b2a1fd71><!--[-->`);
          ssrRenderList([3, 5, 7, 10], (d) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.shortBreak === d ? "bg-sber-blue text-white border-sber-blue" : "border-sber-gray-mid text-sber-black", "px-4 py-2 rounded-xl text-sm font-medium border transition-colors"])}" data-v-b2a1fd71>${ssrInterpolate(d)} \u043C\u0438\u043D </button>`);
          });
          _push2(`<!--]--></div></div><div class="flex items-center justify-between py-3 border-b border-sber-gray-light mb-5" data-v-b2a1fd71><div data-v-b2a1fd71><p class="text-sm font-medium text-sber-black" data-v-b2a1fd71>\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043F\u0440\u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0435</p><p class="text-xs text-sber-gray" data-v-b2a1fd71>\u041D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0441\u043C\u0430\u0440\u0442\u0444\u043E\u043D\u0430</p></div><button class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-b2a1fd71><div class="${ssrRenderClass([unref(pomodoroStore).settings.showOnLockScreen ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-b2a1fd71></div></button></div><div class="mb-5" data-v-b2a1fd71><label class="text-sm font-semibold text-sber-black mb-3 block" data-v-b2a1fd71>\u0417\u0432\u0443\u043A \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F</label><div class="flex gap-2 flex-wrap" data-v-b2a1fd71><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([unref(pomodoroStore).settings.sound === s.id ? "bg-sber-green text-white border-sber-green" : "border-sber-gray-mid text-sber-black", "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"])}" data-v-b2a1fd71>${ssrInterpolate(s.icon)} ${ssrInterpolate(s.name)}</button>`);
          });
          _push2(`<!--]--></div></div><button class="btn-primary" data-v-b2a1fd71>\u0413\u043E\u0442\u043E\u0432\u043E</button></div>`);
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
const pomodoro = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b2a1fd71"]]);

export { pomodoro as default };
//# sourceMappingURL=pomodoro-D8mUP6LD.mjs.map
