import { u as useTaskTimeSync, _ as _sfc_main$1, a as _sfc_main$2 } from "./useTaskTimeSync-BMCBFEST.js";
import { defineComponent, computed, ref, reactive, watch, nextTick, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { ChevronDown } from "lucide-vue-next";
import { p as priorityColor } from "./priority-colors-BPjPHsbX.js";
import { d as useTasksStore } from "../server.mjs";
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
    const task = computed(
      () => tasksStore.tasks.find((t) => t.id === props.taskId) || tasksStore.calendarTasks.find((t) => t.id === props.taskId)
    );
    const saving = ref(false);
    const saveError = ref("");
    const customNotifyMinutes = ref(10);
    const PRESET_NOTIFY = /* @__PURE__ */ new Set(["", "0", "5", "15", "30", "60", "1440"]);
    const form = reactive({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      durationStart: "",
      durationEnd: "",
      priority: "none",
      notification: "",
      repeat: "none",
      matrixBlock: "not-urgent-not-important"
    });
    const customRepeat = reactive({
      interval: 1,
      unit: "week"
    });
    const matrixBlocks = [
      { id: "urgent-important", title: "Срочно и важно", color: "#FF3B30" },
      { id: "not-urgent-important", title: "Не срочно, но важно", color: "#007AFF" },
      { id: "urgent-not-important", title: "Срочно, не важно", color: "#FF9500" },
      { id: "not-urgent-not-important", title: "Не срочно, не важно", color: "#8E8E93" }
    ];
    const isCustomNotification = computed(() => {
      const n = form.notification;
      return n !== "" && n !== "custom" && !PRESET_NOTIFY.has(n);
    });
    const { pauseSync, resumeSync } = useTaskTimeSync(form);
    function syncFormFromTask(t) {
      if (!t) return;
      pauseSync();
      form.title = t.title;
      form.description = t.description || "";
      form.dueDate = t.dueDate || "";
      form.dueTime = t.dueTime || "";
      form.durationStart = t.duration?.start || "";
      form.durationEnd = t.duration?.end || "";
      form.priority = t.priority || "none";
      const notify = t.notification ?? "";
      if (notify && !PRESET_NOTIFY.has(notify)) {
        form.notification = "custom";
        customNotifyMinutes.value = Number(notify) || 10;
      } else {
        form.notification = notify;
      }
      form.repeat = t.repeat || "none";
      form.matrixBlock = t.matrixBlock || "not-urgent-not-important";
      customRepeat.interval = t.repeatCustom?.interval || 1;
      customRepeat.unit = t.repeatCustom?.unit || "week";
      nextTick(() => resumeSync());
    }
    watch(task, syncFormFromTask, { immediate: true });
    const formSnapshot = ref("");
    const unsavedModal = ref(false);
    function captureSnapshot() {
      formSnapshot.value = JSON.stringify({
        ...form,
        customRepeat: { ...customRepeat },
        customNotifyMinutes: customNotifyMinutes.value
      });
    }
    watch(task, () => nextTick(captureSnapshot), { immediate: true });
    computed(() => {
      const current = JSON.stringify({
        ...form,
        customRepeat: { ...customRepeat },
        customNotifyMinutes: customNotifyMinutes.value
      });
      return current !== formSnapshot.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DateFieldRu = _sfc_main$1;
      const _component_TimeFieldRu = _sfc_main$2;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="overlay"></div>`);
        if (unref(task)) {
          _push2(`<div class="app-modal px-4 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}"><div class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) + "20" })}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(priorityColor)(unref(form).priority) })}"></div><div class="relative"><select class="appearance-none bg-transparent pr-5 text-xs font-medium outline-none" style="${ssrRenderStyle({ color: unref(priorityColor)(unref(form).priority) })}"><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>Высокий</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>Средний</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>Низкий</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "none") : ssrLooseEqual(unref(form).priority, "none")) ? " selected" : ""}>Без приоритета</option></select>`);
          _push2(ssrRenderComponent(unref(ChevronDown), { class: "pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sber-gray" }, null, _parent));
          _push2(`</div></div><div class="space-y-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label><input${ssrRenderAttr("value", unref(form).title)} class="input-field py-3" type="text"></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label><textarea class="input-field min-h-[72px] resize-none py-3">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-3"><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>`);
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
          _push2(`</div></div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Уведомление</label><div class="relative"><select class="input-field appearance-none py-3 pr-10"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "") : ssrLooseEqual(unref(form).notification, "")) ? " selected" : ""}>Без уведомления</option><option value="0"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "0") : ssrLooseEqual(unref(form).notification, "0")) ? " selected" : ""}>В момент срока</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "5") : ssrLooseEqual(unref(form).notification, "5")) ? " selected" : ""}>За 5 минут</option><option value="15"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "15") : ssrLooseEqual(unref(form).notification, "15")) ? " selected" : ""}>За 15 минут</option><option value="30"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "30") : ssrLooseEqual(unref(form).notification, "30")) ? " selected" : ""}>За 30 минут</option><option value="60"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "60") : ssrLooseEqual(unref(form).notification, "60")) ? " selected" : ""}>За 1 час</option><option value="1440"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "1440") : ssrLooseEqual(unref(form).notification, "1440")) ? " selected" : ""}>За 1 день</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(unref(form).notification) ? ssrLooseContain(unref(form).notification, "custom") : ssrLooseEqual(unref(form).notification, "custom")) ? " selected" : ""}>Своё время…</option></select>`);
          _push2(ssrRenderComponent(unref(ChevronDown), { class: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" }, null, _parent));
          _push2(`</div>`);
          if (unref(form).notification === "custom" || unref(isCustomNotification)) {
            _push2(`<div class="mt-2 flex items-center gap-2"><input${ssrRenderAttr("value", unref(customNotifyMinutes))} type="number" min="0" max="10080" class="input-field w-28 py-2 text-sm" placeholder="мин"><span class="text-xs text-sber-gray">минут до срока</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Повтор</label><div class="relative"><select class="input-field appearance-none py-3 pr-10"><option value="none"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "none") : ssrLooseEqual(unref(form).repeat, "none")) ? " selected" : ""}>Не повторять</option><option value="daily"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "daily") : ssrLooseEqual(unref(form).repeat, "daily")) ? " selected" : ""}>Каждый день</option><option value="weekly"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "weekly") : ssrLooseEqual(unref(form).repeat, "weekly")) ? " selected" : ""}>Каждую неделю</option><option value="monthly"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "monthly") : ssrLooseEqual(unref(form).repeat, "monthly")) ? " selected" : ""}>Каждый месяц</option><option value="yearly"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "yearly") : ssrLooseEqual(unref(form).repeat, "yearly")) ? " selected" : ""}>Каждый год</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(unref(form).repeat) ? ssrLooseContain(unref(form).repeat, "custom") : ssrLooseEqual(unref(form).repeat, "custom")) ? " selected" : ""}>Настроить повторение</option></select>`);
          _push2(ssrRenderComponent(unref(ChevronDown), { class: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" }, null, _parent));
          _push2(`</div>`);
          if (unref(form).repeat === "custom") {
            _push2(`<div class="mt-2 rounded-2xl border border-sber-green/30 bg-sber-green-light/30 p-3"><div class="flex flex-wrap items-center gap-2"><span class="text-sm text-sber-gray">Каждые</span><input${ssrRenderAttr("value", unref(customRepeat).interval)} type="number" min="1" max="31" class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold"><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "week" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white", "rounded-xl border px-3 py-2 text-sm font-medium"])}"> Недели </button><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "month" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white", "rounded-xl border px-3 py-2 text-sm font-medium"])}"> Месяца </button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div><label class="mb-1 block text-xs font-semibold text-sber-gray">Матрица Эйзенхауэра</label><div class="grid grid-cols-2 gap-1.5"><!--[-->`);
          ssrRenderList(matrixBlocks, (block) => {
            _push2(`<button type="button" class="${ssrRenderClass([unref(form).matrixBlock === block.id ? "border-current" : "border-sber-gray-light", "flex flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-left transition-all"])}" style="${ssrRenderStyle(unref(form).matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + "15" } : {})}"><div class="h-3 w-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-[10px] font-medium leading-tight text-sber-black">${ssrInterpolate(block.title)}</span></button>`);
          });
          _push2(`<!--]--></div></div>`);
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
        if (unref(unsavedModal)) {
          _push2(`<div class="overlay z-[60]"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(unsavedModal)) {
          _push2(`<div class="app-modal z-[70] px-5 py-5"><h3 class="mb-2 text-lg font-bold text-sber-black">Сохранить изменения?</h3><p class="mb-5 text-sm text-sber-gray">Есть несохранённые правки в задаче.</p><button class="btn-primary mb-2" type="button">Сохранить</button><button class="btn-secondary mb-2" type="button">Не сохранять</button><button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button">Отмена</button></div>`);
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
//# sourceMappingURL=TaskDetailModal-Bbs2rPRZ.js.map
