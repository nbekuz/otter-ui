import { u as useTaskTimeSync, _ as _sfc_main$1, a as _sfc_main$2 } from "./useTaskTimeSync-CwnXrEZt.js";
import { defineComponent, computed, ref, reactive, watch, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { p as priorityColor } from "./priority-colors-BPjPHsbX.js";
import { c as useTasksStore } from "../server.mjs";
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
      if (!t) return;
      form.title = t.title;
      form.description = t.description || "";
      form.dueDate = t.dueDate || "";
      form.dueTime = t.dueTime || "";
      form.durationStart = t.duration?.start || "";
      form.durationEnd = t.duration?.end || "";
      form.priority = t.priority || "none";
    }
    watch(task, syncFormFromTask, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DateFieldRu = _sfc_main$1;
      const _component_TimeFieldRu = _sfc_main$2;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="overlay"></div>`);
        if (unref(task)) {
          _push2(`<div class="app-modal px-4 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}"><div class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) + "20" })}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) })}"></div><select class="bg-transparent text-xs font-medium outline-none" style="${ssrRenderStyle({ color: unref(priorityColor)(unref(form).priority) })}"><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>Высокий</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>Средний</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>Низкий</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "none") : ssrLooseEqual(unref(form).priority, "none")) ? " selected" : ""}>Без приоритета</option></select></div><div class="space-y-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label><input${ssrRenderAttr("value", unref(form).title)} class="input-field py-3" type="text"></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label><textarea class="input-field min-h-[72px] resize-none py-3">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>`);
          _push2(ssrRenderComponent(_component_DateFieldRu, {
            modelValue: unref(form).dueDate,
            "onUpdate:modelValue": ($event) => unref(form).dueDate = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Время срока</label>`);
          _push2(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(form).dueTime,
            "onUpdate:modelValue": ($event) => unref(form).dueTime = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Начало</label>`);
          _push2(ssrRenderComponent(_component_TimeFieldRu, {
            modelValue: unref(form).durationStart,
            "onUpdate:modelValue": ($event) => unref(form).durationStart = $event,
            "field-class": "py-3"
          }, null, _parent));
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Конец</label>`);
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
          _push2(`</div><div class="mt-5 grid grid-cols-3 gap-2"><button class="btn-primary !w-auto col-span-1 !py-3 text-sm" type="button"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "…" : "Сохранить")}</button><button class="btn-secondary !w-auto col-span-1 !py-3 text-sm" type="button"> Отмена </button>`);
          if (unref(task).completed) {
            _push2(`<button class="col-span-1 rounded-2xl bg-sber-blue-light px-3 py-3 text-sm font-semibold text-sber-blue" type="button"> Восстановить </button>`);
          } else {
            _push2(`<button class="col-span-1 rounded-2xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-500" type="button"> Удалить </button>`);
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
export {
  _sfc_main as _
};
//# sourceMappingURL=TaskDetailModal-D3aJuBg_.js.map
