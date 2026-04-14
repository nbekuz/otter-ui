import { _ as __nuxt_component_1 } from "./nuxt-link-CVKuvMWS.js";
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { CheckCircle, Trash2, Check, Clock, Bell, RefreshCw, ChevronDown, AlertCircle, Sun, Sunset, Calendar, CheckCircle2, Search, X } from "lucide-vue-next";
import dayjs from "dayjs";
import { u as useTasksStore } from "./tasks-BcYdj5cJ.js";
import { _ as _sfc_main$3 } from "./TaskDetailModal-suNQDuqu.js";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-CYHEneUG.js";
import { u as useSettingsStore } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
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
    const today = dayjs().format("YYYY-MM-DD");
    const isOverdue = computed(
      () => !props.task.completed && props.task.dueDate && props.task.dueDate < today
    );
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
        _push(`<span class="${ssrRenderClass([unref(isOverdue) ? "text-red-500" : "text-sber-gray", "flex items-center gap-1 text-xs"])}">`);
        _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3" }, null, _parent));
        _push(` ${ssrInterpolate(unref(formatDateTime))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.task.duration) {
        _push(`<span class="text-xs text-sber-blue font-medium">${ssrInterpolate(__props.task.duration.start)}–${ssrInterpolate(__props.task.duration.end)}</span>`);
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
    const authStore = useAuthStore();
    const tasksStore = useTasksStore();
    const settingsStore = useSettingsStore();
    const showSearch = ref(false);
    const searchQuery = ref("");
    const selectedTaskId = ref(null);
    const hour = dayjs().hour();
    const greeting = computed(() => {
      if (hour < 6) return "Доброй ночи 🌙";
      if (hour < 12) return "Доброе утро ☀️";
      if (hour < 18) return "Добрый день 🌤";
      return "Добрый вечер 🌆";
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
    const searchResults = computed(() => tasksStore.searchTasks(searchQuery.value));
    function openTask(id) {
      selectedTaskId.value = id;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_TasksTaskItem = _sfc_main$2;
      const _component_TasksTaskGroup = _sfc_main$1;
      const _component_TasksTaskDetailModal = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="sticky top-0 z-20 bg-sber-gray-light px-4 pt-14 pb-3 lg:px-6"><div class="flex items-center justify-between mb-3"><div><p class="text-xs text-sber-gray">${ssrInterpolate(unref(greeting))}</p><h1 class="text-xl font-bold text-sber-black">Мои задачи</h1></div><div class="flex items-center gap-2"><button class="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/profile",
        class: "w-10 h-10 overflow-hidden rounded-full bg-sber-green flex items-center justify-center shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(authStore).user?.avatar) {
              _push2(`<span class="text-white font-bold text-sm"${_scopeId}>${ssrInterpolate(unref(authStore).user?.name?.[0]?.toUpperCase() || "A")}</span>`);
            } else {
              _push2(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover"${_scopeId}>`);
            }
          } else {
            return [
              !unref(authStore).user?.avatar ? (openBlock(), createBlock("span", {
                key: 0,
                class: "text-white font-bold text-sm"
              }, toDisplayString(unref(authStore).user?.name?.[0]?.toUpperCase() || "A"), 1)) : (openBlock(), createBlock("img", {
                key: 1,
                src: unref(authStore).user.avatar,
                class: "w-full h-full object-cover"
              }, null, 8, ["src"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
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
        _push(`<div class="grid grid-cols-3 gap-2 lg:max-w-[520px] lg:gap-3"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm lg:px-5 lg:py-4"><p class="text-lg font-bold" style="${ssrRenderStyle({ color: stat.color })}">${ssrInterpolate(stat.count)}</p><p class="text-[10px] text-sber-gray font-medium">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showSearch) && unref(searchQuery)) {
        _push(`<div class="px-4 pb-4 lg:px-6"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide"> Результаты (${ssrInterpolate(unref(searchResults).length)}) </p>`);
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
        _push(`<div class="px-4 pb-4 lg:px-6"><div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3 lg:gap-4"><!--[-->`);
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
        _push(`<!--]--></div></div>`);
      }
      if (unref(selectedTaskId)) {
        _push(ssrRenderComponent(_component_TasksTaskDetailModal, {
          "task-id": unref(selectedTaskId),
          onClose: ($event) => selectedTaskId.value = null
        }, null, _parent));
      } else {
        _push(`<!---->`);
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
//# sourceMappingURL=index-C08pjAvz.js.map
