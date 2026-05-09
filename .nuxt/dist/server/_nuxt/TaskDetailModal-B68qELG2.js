import { defineComponent, computed, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { Calendar, Clock, Timer, RefreshCw, Bell, Paperclip, Trash2, Save } from "lucide-vue-next";
import dayjs from "dayjs";
import { u as useTasksStore } from "./tasks-BRvQftZO.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TaskDetailModal",
  __ssrInlineRender: true,
  props: {
    taskId: {}
  },
  emits: ["close", "edit"],
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
      if (task.value?.repeat === "custom" && task.value.repeatCustom) {
        const { interval, unit, weekdays, monthDay } = task.value.repeatCustom;
        if (unit === "week") {
          const dayNames = {
            1: "Пн",
            2: "Вт",
            3: "Ср",
            4: "Чт",
            5: "Пт",
            6: "Сб",
            7: "Вс"
          };
          const selectedDays = (weekdays || []).map((d) => dayNames[d]).filter(Boolean).join(", ");
          return selectedDays ? `Каждые ${interval} нед. (${selectedDays})` : `Каждые ${interval} нед.`;
        }
        return `Каждые ${interval} мес. (день ${monthDay || 1})`;
      }
      return labels[task.value?.repeat || ""] || "";
    });
    const notifyLabel = computed(() => {
      const v = task.value?.notification;
      if (!v || v === "0") return "В момент срока";
      if (v === "5") return "За 5 минут";
      if (v === "15") return "За 15 минут";
      if (v === "30") return "За 30 минут";
      if (v === "60") return "За 1 час";
      if (v === "1440") return "За 1 день";
      return `За ${v} минут`;
    });
    const isAttachmentImage = computed(
      () => task.value?.attachment?.mimeType?.startsWith("image/") ?? false
    );
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="overlay"></div>`);
        if (unref(task)) {
          _push2(`<div class="app-modal pt-4" style="${ssrRenderStyle({ "max-height": "80dvh", "overflow-y": "auto" })}"><div class="mx-4 mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor) + "20" })}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor) })}"></div><span class="text-xs font-medium" style="${ssrRenderStyle({ color: unref(priorityColor) })}">${ssrInterpolate(unref(priorityLabel))}</span></div><div class="px-4 mb-4"><h2 class="text-lg font-bold text-sber-black leading-snug">${ssrInterpolate(unref(task).title)}</h2>`);
          if (unref(task).description) {
            _push2(`<p class="text-sm text-sber-gray mt-1">${ssrInterpolate(unref(task).description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="px-4 space-y-3 mb-6">`);
          if (unref(task).dueDate) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Calendar), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(formatDate))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).dueTime) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(task).dueTime)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).duration) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Timer), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(task).duration.start)} – ${ssrInterpolate(unref(task).duration.end)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).repeat !== "none") {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(RefreshCw), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(repeatLabel))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).notification) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Bell), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(notifyLabel))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).attachment) {
            _push2(`<div class="flex items-center gap-3 py-2 border-b border-sber-gray-light">`);
            _push2(ssrRenderComponent(unref(Paperclip), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
            _push2(`<div class="min-w-0 flex-1"><p class="truncate text-sm text-sber-gray">${ssrInterpolate(unref(task).attachment.name)}</p></div><button type="button" class="rounded-lg bg-sber-green-light px-3 py-1 text-xs font-semibold text-sber-green"> Открыть </button></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).attachment && unref(isAttachmentImage)) {
            _push2(`<div class="overflow-hidden rounded-2xl border border-sber-gray-light"><img${ssrRenderAttr("src", unref(task).attachment.dataUrl)} alt="Вложение задачи" class="h-36 w-full object-cover"></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-2 px-4 pb-6"><button class="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition-colors" type="button">`);
          _push2(ssrRenderComponent(unref(Trash2), { class: "h-5 w-5" }, null, _parent));
          _push2(` Удалить </button><button class="btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-semibold" type="button">`);
          _push2(ssrRenderComponent(unref(Save), { class: "h-5 w-5" }, null, _parent));
          _push2(` Сохранить </button></div></div>`);
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
//# sourceMappingURL=TaskDetailModal-B68qELG2.js.map
