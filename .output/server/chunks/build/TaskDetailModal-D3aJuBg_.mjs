import { u as useTaskTimeSync, _ as _sfc_main$1, a as _sfc_main$2 } from './useTaskTimeSync-CwnXrEZt.mjs';
import { defineComponent, computed, ref, reactive, watch, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { p as priorityColor } from './priority-colors-BPjPHsbX.mjs';
import { c as useTasksStore } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TaskDetailModal",
  __ssrInlineRender: true,
  props: {
    taskId: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const tasksStore = useTasksStore();
    const task = computed(() => tasksStore.tasks.find((t) => t.id === props.taskId));
    const saving = ref(false);
    const saveError = ref("");
    const form = reactive({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      durationStart: "",
      durationEnd: "",
      priority: "none"
    });
    useTaskTimeSync(form);
    function syncFormFromTask(t) {
      var _a, _b;
      if (!t) return;
      form.title = t.title;
      form.description = t.description || "";
      form.dueDate = t.dueDate || "";
      form.dueTime = t.dueTime || "";
      form.durationStart = ((_a = t.duration) == null ? void 0 : _a.start) || "";
      form.durationEnd = ((_b = t.duration) == null ? void 0 : _b.end) || "";
      form.priority = t.priority || "none";
    }
    watch(task, syncFormFromTask, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DateFieldRu = _sfc_main$1;
      const _component_TimeFieldRu = _sfc_main$2;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="overlay"></div>`);
        if (unref(task)) {
          _push2(`<div class="app-modal px-4 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}"><div class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) + "20" })}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) })}"></div><select class="bg-transparent text-xs font-medium outline-none" style="${ssrRenderStyle({ color: unref(priorityColor)(unref(form).priority) })}"><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>\u0412\u044B\u0441\u043E\u043A\u0438\u0439</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>\u041D\u0438\u0437\u043A\u0438\u0439</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "none") : ssrLooseEqual(unref(form).priority, "none")) ? " selected" : ""}>\u0411\u0435\u0437 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430</option></select></div><div class="space-y-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</label><input${ssrRenderAttr("value", unref(form).title)} class="input-field py-3" type="text"></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label><textarea class="input-field min-h-[72px] resize-none py-3">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u0414\u0430\u0442\u0430</label>`);
          _push2(ssrRenderComponent(_component_DateFieldRu, {
            modelValue: unref(form).dueDate,
            "onUpdate:modelValue": ($event) => unref(form).dueDate = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u0412\u0440\u0435\u043C\u044F \u0441\u0440\u043E\u043A\u0430</label>`);
          _push2(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(form).dueTime,
            "onUpdate:modelValue": ($event) => unref(form).dueTime = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u041D\u0430\u0447\u0430\u043B\u043E</label>`);
          _push2(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(form).durationStart,
            "onUpdate:modelValue": ($event) => unref(form).durationStart = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">\u041A\u043E\u043D\u0435\u0446</label>`);
          _push2(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(form).durationEnd,
            "onUpdate:modelValue": ($event) => unref(form).durationEnd = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div></div>`);
          if (unref(saveError)) {
            _push2(`<p class="text-sm text-red-500">${ssrInterpolate(unref(saveError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="mt-5 grid grid-cols-3 gap-2"><button class="btn-primary !w-auto col-span-1 !py-3 text-sm" type="button"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary !w-auto col-span-1 !py-3 text-sm" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button>`);
          if (unref(task).completed) {
            _push2(`<button class="col-span-1 rounded-2xl bg-sber-blue-light px-3 py-3 text-sm font-semibold text-sber-blue" type="button"> \u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C </button>`);
          } else {
            _push2(`<button class="col-span-1 rounded-2xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-500" type="button"> \u0423\u0434\u0430\u043B\u0438\u0442\u044C </button>`);
          }
          _push2(`</div></div>`);
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
//# sourceMappingURL=TaskDetailModal-D3aJuBg_.mjs.map
