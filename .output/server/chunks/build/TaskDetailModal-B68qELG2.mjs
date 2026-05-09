import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { Calendar, Clock, Timer, RefreshCw, Bell, Paperclip, Trash2, Save } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { u as useTasksStore } from './tasks-BRvQftZO.mjs';

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
      var _a;
      switch ((_a = task.value) == null ? void 0 : _a.priority) {
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
      var _a;
      switch ((_a = task.value) == null ? void 0 : _a.priority) {
        case "high":
          return "\u0412\u044B\u0441\u043E\u043A\u0438\u0439 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442";
        case "medium":
          return "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442";
        case "low":
          return "\u041D\u0438\u0437\u043A\u0438\u0439 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442";
        default:
          return "\u0411\u0435\u0437 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430";
      }
    });
    const formatDate = computed(() => {
      var _a;
      if (!((_a = task.value) == null ? void 0 : _a.dueDate)) return "";
      return dayjs(task.value.dueDate).format("D MMMM YYYY");
    });
    const repeatLabel = computed(() => {
      var _a, _b;
      const labels = {
        daily: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C",
        weekly: "\u041A\u0430\u0436\u0434\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E",
        monthly: "\u041A\u0430\u0436\u0434\u044B\u0439 \u043C\u0435\u0441\u044F\u0446",
        yearly: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0433\u043E\u0434"
      };
      if (((_a = task.value) == null ? void 0 : _a.repeat) === "custom" && task.value.repeatCustom) {
        const { interval, unit, weekdays, monthDay } = task.value.repeatCustom;
        if (unit === "week") {
          const dayNames = {
            1: "\u041F\u043D",
            2: "\u0412\u0442",
            3: "\u0421\u0440",
            4: "\u0427\u0442",
            5: "\u041F\u0442",
            6: "\u0421\u0431",
            7: "\u0412\u0441"
          };
          const selectedDays = (weekdays || []).map((d) => dayNames[d]).filter(Boolean).join(", ");
          return selectedDays ? `\u041A\u0430\u0436\u0434\u044B\u0435 ${interval} \u043D\u0435\u0434. (${selectedDays})` : `\u041A\u0430\u0436\u0434\u044B\u0435 ${interval} \u043D\u0435\u0434.`;
        }
        return `\u041A\u0430\u0436\u0434\u044B\u0435 ${interval} \u043C\u0435\u0441. (\u0434\u0435\u043D\u044C ${monthDay || 1})`;
      }
      return labels[((_b = task.value) == null ? void 0 : _b.repeat) || ""] || "";
    });
    const notifyLabel = computed(() => {
      var _a;
      const v = (_a = task.value) == null ? void 0 : _a.notification;
      if (!v || v === "0") return "\u0412 \u043C\u043E\u043C\u0435\u043D\u0442 \u0441\u0440\u043E\u043A\u0430";
      if (v === "5") return "\u0417\u0430 5 \u043C\u0438\u043D\u0443\u0442";
      if (v === "15") return "\u0417\u0430 15 \u043C\u0438\u043D\u0443\u0442";
      if (v === "30") return "\u0417\u0430 30 \u043C\u0438\u043D\u0443\u0442";
      if (v === "60") return "\u0417\u0430 1 \u0447\u0430\u0441";
      if (v === "1440") return "\u0417\u0430 1 \u0434\u0435\u043D\u044C";
      return `\u0417\u0430 ${v} \u043C\u0438\u043D\u0443\u0442`;
    });
    const isAttachmentImage = computed(
      () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = task.value) == null ? void 0 : _a.attachment) == null ? void 0 : _b.mimeType) == null ? void 0 : _c.startsWith("image/")) != null ? _d : false;
      }
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
            _push2(`<span class="text-sm text-sber-gray">${ssrInterpolate(unref(task).duration.start)} \u2013 ${ssrInterpolate(unref(task).duration.end)}</span></div>`);
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
            _push2(`<div class="min-w-0 flex-1"><p class="truncate text-sm text-sber-gray">${ssrInterpolate(unref(task).attachment.name)}</p></div><button type="button" class="rounded-lg bg-sber-green-light px-3 py-1 text-xs font-semibold text-sber-green"> \u041E\u0442\u043A\u0440\u044B\u0442\u044C </button></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(task).attachment && unref(isAttachmentImage)) {
            _push2(`<div class="overflow-hidden rounded-2xl border border-sber-gray-light"><img${ssrRenderAttr("src", unref(task).attachment.dataUrl)} alt="\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438" class="h-36 w-full object-cover"></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-2 px-4 pb-6"><button class="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition-colors" type="button">`);
          _push2(ssrRenderComponent(unref(Trash2), { class: "h-5 w-5" }, null, _parent));
          _push2(` \u0423\u0434\u0430\u043B\u0438\u0442\u044C </button><button class="btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-semibold" type="button">`);
          _push2(ssrRenderComponent(unref(Save), { class: "h-5 w-5" }, null, _parent));
          _push2(` \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button></div></div>`);
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

export { _sfc_main as _ };
//# sourceMappingURL=TaskDetailModal-B68qELG2.mjs.map
