import { defineComponent, computed, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { Calendar, Clock, Timer, RefreshCw, Bell, CheckCircle, Trash2 } from "lucide-vue-next";
import dayjs from "dayjs";
import { u as useTasksStore } from "./tasks-BcYdj5cJ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TaskDetailModal",
  __ssrInlineRender: true,
  props: {
    taskId: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const tasksStore = useTasksStore();
    const task = computed(() => tasksStore.tasks.find((t) => t.id === props.taskId));
    const priorityColor = computed(() => {
      switch (task.value?.priority) {
        case "high":
          return "#FF3B30";
        case "medium":
          return "#FF9500";
        case "low":
          return "#34C759";
        default:
          return "#C7C7CC";
      }
    });
    const priorityLabel = computed(() => {
      switch (task.value?.priority) {
        case "high":
          return "Высокий приоритет";
        case "medium":
          return "Средний приоритет";
        case "low":
          return "Низкий приоритет";
        default:
          return "Без приоритета";
      }
    });
    const formatDate = computed(() => {
      if (!task.value?.dueDate) return "";
      return dayjs(task.value.dueDate).format("D MMMM YYYY");
    });
    const repeatLabel = computed(() => {
      const labels = {
        daily: "Каждый день",
        weekly: "Каждую неделю",
        monthly: "Каждый месяц",
        yearly: "Каждый год"
      };
      return labels[task.value?.repeat || ""] || "";
    });
    const notifyLabel = computed(() => {
      const v = task.value?.notification;
      if (!v || v === "0") return "в момент срока";
      if (v === "5") return "5 минут";
      if (v === "15") return "15 минут";
      if (v === "30") return "30 минут";
      if (v === "60") return "1 час";
      if (v === "1440") return "1 день";
      return `${v} минут`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="overlay"></div>`);
        if (unref(task)) {
          _push2(`<div class="app-modal" style="${ssrRenderStyle({ "max-height": "80dvh", "overflow-y": "auto" })}"><div class="mx-4 rounded-2xl px-4 py-2 mb-4 flex items-center gap-2" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor) + "20" })}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor) })}"></div><span class="text-xs font-medium" style="${ssrRenderStyle({ color: unref(priorityColor) })}">${ssrInterpolate(unref(priorityLabel))}</span></div><div class="px-4 mb-4"><h2 class="text-lg font-bold text-sber-black leading-snug">${ssrInterpolate(unref(task).title)}</h2>`);
          if (unref(task).description) {
            _push2(`<p class="text-sm text-sber-gray mt-1">${ssrInterpolate(unref(task).description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="px-4 space-y-3 mb-6">`);
          if (unref(task).dueDate) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Calendar), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-black">${ssrInterpolate(unref(formatDate))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).dueTime) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-black">${ssrInterpolate(unref(task).dueTime)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).duration) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Timer), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-black">${ssrInterpolate(unref(task).duration.start)} – ${ssrInterpolate(unref(task).duration.end)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).repeat !== "none") {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(RefreshCw), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-black">${ssrInterpolate(unref(repeatLabel))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).notification) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Bell), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-black">За ${ssrInterpolate(unref(notifyLabel))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="px-4 pb-6 flex flex-col gap-2"><button class="${ssrRenderClass([unref(task).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors"])}">`);
          _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5" }, null, _parent));
          _push2(` ${ssrInterpolate(unref(task).completed ? "Снять отметку" : "Отметить выполненной")}</button><button class="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm">`);
          _push2(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent));
          _push2(` Удалить задачу </button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tasks/TaskDetailModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=TaskDetailModal-suNQDuqu.js.map
