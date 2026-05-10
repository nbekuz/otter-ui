import { defineComponent, computed, ref, mergeProps, unref, useSSRContext, createVNode, resolveDynamicComponent, reactive, watch } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { CheckCircle, Trash2, Check, Clock, Bell, RefreshCw, ChevronDown, AlertCircle, Sun, Sunset, Calendar, CheckCircle2, Search, X } from "lucide-vue-next";
import dayjs from "dayjs";
import { u as useTasksStore } from "./tasks-BRvQftZO.js";
import { _ as _sfc_main$3, a as _sfc_main$4 } from "./TimeFieldRu-CPDZOlfK.js";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-CDZnEywe.js";
import { a as useSettingsStore, n as navigateTo } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TaskItem",
  __ssrInlineRender: true,
  props: {
    task: {}
  },
  emits: ["complete", "delete", "open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const priorityCheckboxClass = computed(() => {
      switch (props.task.priority) {
        case "high":
          return "border-red-400 bg-red-50";
        case "medium":
          return "border-orange-400 bg-orange-50";
        case "low":
          return "border-green-400 bg-green-50";
        default:
          return "border-sber-gray-mid bg-white";
      }
    });
    const priorityDotClass = computed(() => {
      switch (props.task.priority) {
        case "high":
          return "bg-red-400";
        case "medium":
          return "bg-orange-400";
        case "low":
          return "bg-green-400";
        default:
          return "bg-transparent";
      }
    });
    const formatDateTime = computed(() => {
      if (!props.task.dueDate) return "";
      const d = dayjs(props.task.dueDate);
      const dateStr = d.format("D MMM");
      return props.task.dueTime ? `${dateStr}, ${props.task.dueTime}` : dateStr;
    });
    const swipeOffset = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative mb-2 h-full overflow-hidden rounded-2xl" }, _attrs))}><div class="swipe-complete" style="${ssrRenderStyle({ width: unref(swipeOffset) > 0 ? `${Math.min(unref(swipeOffset), 100)}px` : "0" })}">`);
      _push(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5" }, null, _parent));
      if (unref(swipeOffset) > 50) {
        _push(`<span class="ml-2 text-sm">Готово</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="swipe-delete" style="${ssrRenderStyle({ width: unref(swipeOffset) < 0 ? `${Math.min(-unref(swipeOffset), 100)}px` : "0" })}">`);
      if (unref(swipeOffset) < -50) {
        _push(`<span class="mr-2 text-sm">Удалить</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent));
      _push(`</div><div class="bg-white rounded-2xl px-4 py-3 flex items-start gap-3 relative z-10 transition-transform active:scale-[0.99]" style="${ssrRenderStyle({ transform: `translateX(${unref(swipeOffset)}px)` })}"><button class="${ssrRenderClass([[
        __props.task.completed ? "border-sber-green bg-sber-green" : `border-2 ${unref(priorityCheckboxClass)}`
      ], "w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"])}">`);
      if (__props.task.completed) {
        _push(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-white" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><div class="flex-1 min-w-0"><p class="${ssrRenderClass([__props.task.completed ? "line-through text-sber-gray" : "text-sber-black", "text-sm font-medium leading-snug line-clamp-2"])}">${ssrInterpolate(__props.task.title)}</p><div class="flex items-center gap-2 mt-1.5 flex-wrap">`);
      if (__props.task.dueDate) {
        _push(`<span class="flex items-center gap-1 text-xs text-sber-gray">`);
        _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3" }, null, _parent));
        _push(` ${ssrInterpolate(unref(formatDateTime))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.task.duration) {
        _push(`<span class="text-xs text-sber-gray font-medium">${ssrInterpolate(__props.task.duration.start)}–${ssrInterpolate(__props.task.duration.end)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.task.notification) {
        _push(`<span class="text-sber-gray">`);
        _push(ssrRenderComponent(unref(Bell), { class: "w-3 h-3" }, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.task.repeat && __props.task.repeat !== "none") {
        _push(`<span class="text-sber-gray">`);
        _push(ssrRenderComponent(unref(RefreshCw), { class: "w-3 h-3" }, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="${ssrRenderClass([unref(priorityDotClass), "w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"])}"></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tasks/TaskItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TaskGroup",
  __ssrInlineRender: true,
  props: {
    title: {},
    tasks: {},
    color: {},
    icon: {}
  },
  emits: ["openTask"],
  setup(__props) {
    const tasksStore = useTasksStore();
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskItem = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-3 h-fit lg:mb-0" }, _attrs))}><button class="${ssrRenderClass([unref(isOpen) ? "rounded-b-none rounded-t-2xl shadow-none border-b border-sber-gray-light" : "rounded-2xl", "task-group-header w-full shadow-sm mb-0"])}"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-xl flex items-center justify-center" style="${ssrRenderStyle({ backgroundColor: __props.color + "20" })}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.icon), {
        class: "w-4 h-4",
        style: { color: __props.color }
      }, null), _parent);
      _push(`</div><div class="text-left"><span class="text-sm font-semibold text-sber-black">${ssrInterpolate(__props.title)}</span><span class="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style="${ssrRenderStyle({ backgroundColor: __props.color + "20", color: __props.color })}">${ssrInterpolate(__props.tasks.length)}</span></div></div>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["w-5 h-5 text-sber-gray transition-transform duration-200", unref(isOpen) ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button>`);
      if (unref(isOpen)) {
        _push(`<div class="bg-white rounded-b-2xl px-3 pb-3 pt-2 shadow-sm"><!--[-->`);
        ssrRenderList(__props.tasks, (task) => {
          _push(ssrRenderComponent(_component_TasksTaskItem, {
            key: task.id,
            task,
            onComplete: ($event) => unref(tasksStore).completeTask($event),
            onDelete: ($event) => unref(tasksStore).deleteTask($event),
            onOpen: ($event) => _ctx.$emit("openTask", $event)
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (__props.tasks.length === 0) {
          _push(`<div class="text-center py-4 text-sber-gray text-sm"> Нет задач </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tasks/TaskGroup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const tasksStore = useTasksStore();
    const settingsStore = useSettingsStore();
    const showSearch = ref(false);
    const searchQuery = ref("");
    const desktopSelectedTaskId = ref(null);
    ref(null);
    const isDesktop = ref(false);
    ref(null);
    const leftPaneWidth = ref(52);
    const hour = dayjs().hour();
    const greeting = computed(() => {
      if (hour < 16) return "Доброй ночи 🌙";
      if (hour < 12) return "Доброе утро ☀️";
      if (hour < 18) return "Добрый день 🌤";
      return "Добрый вечер 🌙";
    });
    const stats = computed(() => [
      { label: "Просрочено", count: tasksStore.overdueTasks.length, color: "#FF3B30" },
      { label: "Сегодня", count: tasksStore.todayTasks.length, color: "#FF9500" },
      { label: "Выполнено", count: tasksStore.completedTasks.length, color: "#21A038" }
    ]);
    const allGroups = computed(() => [
      {
        id: "overdue",
        title: "Просрочено",
        tasks: tasksStore.overdueTasks,
        color: "#FF3B30",
        icon: AlertCircle
      },
      {
        id: "today",
        title: "Сегодня",
        tasks: tasksStore.todayTasks,
        color: "#FF9500",
        icon: Sun
      },
      {
        id: "tomorrow",
        title: "Завтра",
        tasks: tasksStore.tomorrowTasks,
        color: "#007AFF",
        icon: Sunset
      },
      {
        id: "later",
        title: "Позже",
        tasks: tasksStore.laterTasks,
        color: "#AF52DE",
        icon: Calendar
      },
      {
        id: "nodate",
        title: "Без срока",
        tasks: tasksStore.noDateTasks,
        color: "#8E8E93",
        icon: Clock
      },
      {
        id: "completed",
        title: "Выполнено",
        tasks: tasksStore.completedTasks,
        color: "#21A038",
        icon: CheckCircle2
      }
    ]);
    const visibleGroups = computed(
      () => allGroups.value.filter((g) => settingsStore.isGroupVisible(g.id))
    );
    const desktopGroups = computed(() => [
      { id: "overdue", title: "Просрочено", color: "#FF3B30", tasks: tasksStore.overdueTasks },
      { id: "today", title: "Сегодня", color: "#FF9500", tasks: tasksStore.todayTasks },
      { id: "tomorrow", title: "Завтра", color: "#007AFF", tasks: tasksStore.tomorrowTasks },
      { id: "later", title: "Позже", color: "#AF52DE", tasks: tasksStore.laterTasks },
      { id: "nodate", title: "Без срока", color: "#8E8E93", tasks: tasksStore.noDateTasks },
      { id: "completed", title: "Готово", color: "#21A038", tasks: tasksStore.completedTasks }
    ]);
    const activeDesktopGroupId = ref("overdue");
    const activeDesktopGroup = computed(
      () => desktopGroups.value.find((group) => group.id === activeDesktopGroupId.value) || desktopGroups.value[0]
    );
    const activeDesktopTasks = computed(() => activeDesktopGroup.value?.tasks || []);
    const desktopSelectedTask = computed(
      () => tasksStore.tasks.find((task) => task.id === desktopSelectedTaskId.value) || null
    );
    const searchResults = computed(() => tasksStore.searchTasks(searchQuery.value));
    const editorForm = reactive({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      durationStart: "",
      durationEnd: "",
      priority: "none",
      notification: "",
      repeat: "none"
    });
    const desktopCustomRepeat = reactive({
      interval: 1,
      unit: "week",
      weekdays: [1],
      monthDay: dayjs().date()
    });
    const weekDays = [
      { label: "Пн", value: 1 },
      { label: "Вт", value: 2 },
      { label: "Ср", value: 3 },
      { label: "Чт", value: 4 },
      { label: "Пт", value: 5 },
      { label: "Сб", value: 6 },
      { label: "Вс", value: 7 }
    ];
    function openTask(id) {
      if (isDesktop.value) {
        desktopSelectedTaskId.value = id;
        return;
      }
      navigateTo({ path: "/app/new-task", query: { id, returnTo: "/app" } });
    }
    function syncEditorForm(task) {
      editorForm.title = task?.title || "";
      editorForm.description = task?.description || "";
      editorForm.dueDate = task?.dueDate || "";
      editorForm.dueTime = task?.dueTime || "";
      editorForm.durationStart = task?.duration?.start || "";
      editorForm.durationEnd = task?.duration?.end || "";
      editorForm.priority = task?.priority || "none";
      editorForm.notification = task?.notification || "";
      editorForm.repeat = task?.repeat || "none";
      desktopCustomRepeat.interval = task?.repeatCustom?.interval || 1;
      desktopCustomRepeat.unit = task?.repeatCustom?.unit || (task?.repeatDays?.length ? "week" : "week");
      desktopCustomRepeat.weekdays = task?.repeatCustom?.weekdays?.length ? [...task.repeatCustom.weekdays] : task?.repeatDays?.length ? [...task.repeatDays] : [1];
      desktopCustomRepeat.monthDay = task?.repeatCustom?.monthDay || dayjs().date();
    }
    function formatTaskDate(task) {
      if (!task.dueDate) return "";
      return dayjs(task.dueDate).format("DD.MM.YY");
    }
    function formatNotification(value) {
      if (!value) return "";
      if (value === "0") return "в срок";
      if (value === "60") return "за 1ч";
      if (value === "1440") return "за 1д";
      return `за ${value}м`;
    }
    function formatRepeat(task) {
      const labels = {
        daily: "ежедневно",
        weekly: "еженед.",
        monthly: "ежемес.",
        yearly: "ежегодно",
        custom: "кастом"
      };
      return labels[task.repeat] || "";
    }
    function formatPriority(priority) {
      const labels = {
        high: "Высокий",
        medium: "Средний",
        low: "Низкий",
        none: "Без приор."
      };
      return labels[priority];
    }
    watch(desktopSelectedTask, (task) => {
      syncEditorForm(task);
    }, { immediate: true });
    watch(() => editorForm.dueTime, (newTime, oldTime) => {
      if (!newTime) return;
      if (!editorForm.durationStart || editorForm.durationStart === oldTime) {
        editorForm.durationStart = newTime;
      }
    });
    watch(() => editorForm.dueDate, (newDate) => {
      if (newDate !== "") return;
      editorForm.dueTime = "";
      editorForm.durationStart = "";
      editorForm.durationEnd = "";
    });
    watch(activeDesktopTasks, (tasks) => {
      if (!desktopSelectedTaskId.value) return;
      if (!tasks.some((task) => task.id === desktopSelectedTaskId.value)) {
        desktopSelectedTaskId.value = null;
      }
    });
    watch(desktopGroups, (groups) => {
      if (groups.some((group) => group.id === activeDesktopGroupId.value)) return;
      activeDesktopGroupId.value = groups[0]?.id || "overdue";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskItem = _sfc_main$2;
      const _component_TasksTaskGroup = _sfc_main$1;
      const _component_DateFieldRu = _sfc_main$3;
      const _component_TimeFieldRu = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="sticky top-0 z-20 bg-sber-gray-light px-4 pt-14 pb-3 lg:px-6"><div class="flex items-center justify-between mb-3"><div><p class="text-xs text-sber-gray">${ssrInterpolate(unref(greeting))}</p><h1 class="text-xl font-bold text-sber-black">Мои задачи</h1></div><div class="flex items-center gap-2"><button class="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(showSearch)) {
        _push(`<div class="relative mb-1">`);
        _push(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Поиск задач..." class="input-field pl-11 py-3 text-sm">`);
        if (unref(searchQuery)) {
          _push(`<button class="absolute right-4 top-1/2 -translate-y-1/2">`);
          _push(ssrRenderComponent(unref(X), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(showSearch)) {
        _push(`<div class="grid grid-cols-3 gap-2 lg:hidden"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm lg:px-5 lg:py-4"><p class="text-lg font-bold" style="${ssrRenderStyle({ color: stat.color })}">${ssrInterpolate(stat.count)}</p><p class="text-[10px] text-sber-gray font-medium">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(showSearch)) {
        _push(`<div class="hidden lg:grid lg:grid-cols-6 lg:gap-3"><!--[-->`);
        ssrRenderList(unref(desktopGroups), (group) => {
          _push(`<button class="${ssrRenderClass([unref(activeDesktopGroupId) === group.id ? "border-sber-green bg-sber-green-light/40" : "border-transparent hover:border-sber-gray-mid", "rounded-2xl border bg-white px-3 py-3 text-left shadow-sm transition-colors"])}" type="button"><p class="text-lg font-bold" style="${ssrRenderStyle({ color: group.color })}">${ssrInterpolate(group.tasks.length)}</p><p class="text-[11px] font-semibold text-sber-gray">${ssrInterpolate(group.title)}</p></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showSearch) && unref(searchQuery)) {
        _push(`<div class="px-4 pb-8 lg:px-6 lg:pb-10"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide"> Результаты (${ssrInterpolate(unref(searchResults).length)}) </p>`);
        if (unref(searchResults).length === 0) {
          _push(`<div class="text-center py-8 text-sber-gray text-sm"> Ничего не найдено </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(searchResults), (task) => {
          _push(ssrRenderComponent(_component_TasksTaskItem, {
            key: task.id,
            task,
            onComplete: ($event) => unref(tasksStore).completeTask($event),
            onDelete: ($event) => unref(tasksStore).deleteTask($event),
            onOpen: openTask
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="px-4 pb-8 lg:px-6 lg:pb-10"><div class="grid grid-cols-1 gap-3 lg:hidden"><!--[-->`);
        ssrRenderList(unref(visibleGroups), (group) => {
          _push(ssrRenderComponent(_component_TasksTaskGroup, {
            key: group.id,
            title: group.title,
            tasks: group.tasks,
            color: group.color,
            icon: group.icon,
            onOpenTask: openTask
          }, null, _parent));
        });
        _push(`<!--]--></div><div class="hidden lg:flex lg:min-h-[62dvh] lg:rounded-3xl lg:border lg:border-sber-gray-mid/60 lg:bg-white lg:shadow-card"><section class="min-w-[360px] border-r border-sber-gray-light px-4 py-4" style="${ssrRenderStyle({ width: `${unref(leftPaneWidth)}%` })}"><div class="mb-3 flex items-center justify-between"><div class="flex items-center gap-2"><div class="h-2.5 w-2.5 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(activeDesktopGroup)?.color || "#8E8E93" })}"></div><p class="text-sm font-bold text-sber-black">${ssrInterpolate(unref(activeDesktopGroup)?.title)}</p><span class="rounded-full bg-sber-gray-light px-2 py-0.5 text-xs font-semibold text-sber-gray">${ssrInterpolate(unref(activeDesktopTasks).length)}</span></div><button class="text-xs font-semibold text-sber-green" type="button"> Снять выбор </button></div><div class="space-y-2 overflow-y-auto pr-1" style="${ssrRenderStyle({ "max-height": "calc(62dvh - 3.5rem)" })}"><!--[-->`);
        ssrRenderList(unref(activeDesktopTasks), (task) => {
          _push(`<button class="${ssrRenderClass([unref(desktopSelectedTaskId) === task.id ? "border-sber-green bg-sber-green-light/25" : "border-sber-gray-light bg-white hover:bg-sber-gray-light/60", "w-full rounded-2xl border px-3 py-3 text-left transition-colors"])}" type="button"><p class="${ssrRenderClass([task.completed ? "text-sber-gray line-through" : "text-sber-black", "line-clamp-1 text-sm font-semibold"])}">${ssrInterpolate(task.title)}</p><div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sber-gray">`);
          if (task.dueDate) {
            _push(`<span>${ssrInterpolate(formatTaskDate(task))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (task.dueTime) {
            _push(`<span>${ssrInterpolate(task.dueTime)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (task.duration) {
            _push(`<span>${ssrInterpolate(task.duration.start)}-${ssrInterpolate(task.duration.end)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (task.notification) {
            _push(`<span>🔔 ${ssrInterpolate(formatNotification(task.notification))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (task.repeat !== "none") {
            _push(`<span>↻ ${ssrInterpolate(formatRepeat(task))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(formatPriority(task.priority))}</span></div></button>`);
        });
        _push(`<!--]-->`);
        if (unref(activeDesktopTasks).length === 0) {
          _push(`<div class="rounded-2xl border border-dashed border-sber-gray-mid py-10 text-center text-sm text-sber-gray"> В этом разделе пока нет задач </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section><button class="w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-sber-green/20" type="button"></button><section class="min-w-0 flex-1 px-5 py-4">`);
        if (unref(desktopSelectedTask)) {
          _push(`<div class="flex h-full flex-col"><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-sber-gray">Редактирование задачи</p><h2 class="mb-4 line-clamp-1 text-xl font-bold text-sber-black">${ssrInterpolate(unref(desktopSelectedTask).title)}</h2><div class="grid grid-cols-1 gap-3 md:grid-cols-2"><div class="md:col-span-2"><label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label><input${ssrRenderAttr("value", unref(editorForm).title)} class="input-field py-3" type="text"></div><div class="md:col-span-2"><label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label><textarea class="input-field min-h-[92px] resize-none py-3">${ssrInterpolate(unref(editorForm).description)}</textarea></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>`);
          _push(ssrRenderComponent(_component_DateFieldRu, {
            modelValue: unref(editorForm).dueDate,
            "onUpdate:modelValue": ($event) => unref(editorForm).dueDate = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Время</label>`);
          _push(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(editorForm).dueTime,
            "onUpdate:modelValue": ($event) => unref(editorForm).dueTime = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Начало</label>`);
          _push(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(editorForm).durationStart,
            "onUpdate:modelValue": ($event) => unref(editorForm).durationStart = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Конец</label>`);
          _push(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(editorForm).durationEnd,
            "onUpdate:modelValue": ($event) => unref(editorForm).durationEnd = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Приоритет</label><select class="input-field py-3"><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).priority) ? ssrLooseContain(unref(editorForm).priority, "high") : ssrLooseEqual(unref(editorForm).priority, "high")) ? " selected" : ""}>Высокий</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).priority) ? ssrLooseContain(unref(editorForm).priority, "medium") : ssrLooseEqual(unref(editorForm).priority, "medium")) ? " selected" : ""}>Средний</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).priority) ? ssrLooseContain(unref(editorForm).priority, "low") : ssrLooseEqual(unref(editorForm).priority, "low")) ? " selected" : ""}>Низкий</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).priority) ? ssrLooseContain(unref(editorForm).priority, "none") : ssrLooseEqual(unref(editorForm).priority, "none")) ? " selected" : ""}>Без приоритета</option></select></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Уведомление</label><select class="input-field py-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "") : ssrLooseEqual(unref(editorForm).notification, "")) ? " selected" : ""}>Без уведомления</option><option value="0"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "0") : ssrLooseEqual(unref(editorForm).notification, "0")) ? " selected" : ""}>В момент срока</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "5") : ssrLooseEqual(unref(editorForm).notification, "5")) ? " selected" : ""}>За 5 минут</option><option value="15"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "15") : ssrLooseEqual(unref(editorForm).notification, "15")) ? " selected" : ""}>За 15 минут</option><option value="30"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "30") : ssrLooseEqual(unref(editorForm).notification, "30")) ? " selected" : ""}>За 30 минут</option><option value="60"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "60") : ssrLooseEqual(unref(editorForm).notification, "60")) ? " selected" : ""}>За 1 час</option><option value="1440"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).notification) ? ssrLooseContain(unref(editorForm).notification, "1440") : ssrLooseEqual(unref(editorForm).notification, "1440")) ? " selected" : ""}>За 1 день</option></select></div><div class="md:col-span-2"><label class="mb-1 block text-xs font-semibold text-sber-gray">Повтор</label><select class="input-field py-3"><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "none") : ssrLooseEqual(unref(editorForm).repeat, "none")) ? " selected" : ""}>Не повторять</option><option value="daily"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "daily") : ssrLooseEqual(unref(editorForm).repeat, "daily")) ? " selected" : ""}>Каждый день</option><option value="weekly"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "weekly") : ssrLooseEqual(unref(editorForm).repeat, "weekly")) ? " selected" : ""}>Каждую неделю</option><option value="monthly"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "monthly") : ssrLooseEqual(unref(editorForm).repeat, "monthly")) ? " selected" : ""}>Каждый месяц</option><option value="yearly"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "yearly") : ssrLooseEqual(unref(editorForm).repeat, "yearly")) ? " selected" : ""}>Каждый год</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(unref(editorForm).repeat) ? ssrLooseContain(unref(editorForm).repeat, "custom") : ssrLooseEqual(unref(editorForm).repeat, "custom")) ? " selected" : ""}>Настроить повторение</option></select></div>`);
          if (unref(editorForm).repeat === "custom") {
            _push(`<div class="md:col-span-2 rounded-2xl border border-sber-green/30 bg-sber-green-light/30 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p><div class="mt-3 flex flex-wrap items-center gap-2"><span class="text-sm text-sber-gray">Каждые</span><input${ssrRenderAttr("value", unref(desktopCustomRepeat).interval)} type="number" min="1" max="31" class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"><button type="button" class="${ssrRenderClass([unref(desktopCustomRepeat).unit === "week" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> Недели </button><button type="button" class="${ssrRenderClass([unref(desktopCustomRepeat).unit === "month" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> Месяца </button></div>`);
            if (unref(desktopCustomRepeat).unit === "week") {
              _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p><div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(weekDays, (day) => {
                _push(`<button type="button" class="${ssrRenderClass([unref(desktopCustomRepeat).weekdays.includes(day.value) ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-gray", "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"])}">${ssrInterpolate(day.label)}</button>`);
              });
              _push(`<!--]--></div></div>`);
            } else {
              _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p><input${ssrRenderAttr("value", unref(desktopCustomRepeat).monthDay)} type="number" min="1" max="31" class="w-28 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"></div>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mt-auto grid grid-cols-3 gap-3 pt-5"><button class="btn-primary col-span-1" type="button"> Сохранить </button><button class="${ssrRenderClass([unref(desktopSelectedTask).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "col-span-1 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors"])}" type="button"> Выполнено </button><button class="col-span-1 rounded-2xl bg-red-50 px-4 py-4 text-sm font-semibold text-red-500" type="button"> Удалить </button></div></div>`);
        } else {
          _push(`<div class="flex h-full items-center justify-center rounded-3xl border border-dashed border-sber-gray-mid text-sm text-sber-gray"> Выберите задачу слева, чтобы открыть редактирование </div>`);
        }
        _push(`</section></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-C9cSpw4S.js.map
