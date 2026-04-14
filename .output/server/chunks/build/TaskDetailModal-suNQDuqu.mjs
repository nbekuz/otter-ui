import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { Calendar, Clock, Timer, RefreshCw, Bell, CheckCircle, Trash2 } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { u as useTasksStore } from './tasks-BcYdj5cJ.mjs';

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
      var _a;
      const labels = {
        daily: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C",
        weekly: "\u041A\u0430\u0436\u0434\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E",
        monthly: "\u041A\u0430\u0436\u0434\u044B\u0439 \u043C\u0435\u0441\u044F\u0446",
        yearly: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0433\u043E\u0434"
      };
      return labels[((_a = task.value) == null ? void 0 : _a.repeat) || ""] || "";
    });
    const notifyLabel = computed(() => {
      var _a;
      const v = (_a = task.value) == null ? void 0 : _a.notification;
      if (!v || v === "0") return "\u0432 \u043C\u043E\u043C\u0435\u043D\u0442 \u0441\u0440\u043E\u043A\u0430";
      if (v === "5") return "5 \u043C\u0438\u043D\u0443\u0442";
      if (v === "15") return "15 \u043C\u0438\u043D\u0443\u0442";
      if (v === "30") return "30 \u043C\u0438\u043D\u0443\u0442";
      if (v === "60") return "1 \u0447\u0430\u0441";
      if (v === "1440") return "1 \u0434\u0435\u043D\u044C";
      return `${v} \u043C\u0438\u043D\u0443\u0442`;
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
            _push2(`<span class="text-sm text-sber-black">${ssrInterpolate(unref(task).duration.start)} \u2013 ${ssrInterpolate(unref(task).duration.end)}</span></div>`);
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
            _push2(`<span class="text-sm text-sber-black">\u0417\u0430 ${ssrInterpolate(unref(notifyLabel))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="px-4 pb-6 flex flex-col gap-2"><button class="${ssrRenderClass([unref(task).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors"])}">`);
          _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5" }, null, _parent));
          _push2(` ${ssrInterpolate(unref(task).completed ? "\u0421\u043D\u044F\u0442\u044C \u043E\u0442\u043C\u0435\u0442\u043A\u0443" : "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0439")}</button><button class="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm">`);
          _push2(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent));
          _push2(` \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 </button></div></div>`);
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
//# sourceMappingURL=TaskDetailModal-suNQDuqu.mjs.map
