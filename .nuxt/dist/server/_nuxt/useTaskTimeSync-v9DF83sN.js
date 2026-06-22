import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Calendar, Clock } from "lucide-vue-next";
import { j as addMinutesToTime } from "../server.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DateFieldRu",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    fieldClass: { default: "" },
    wrapperClass: { default: "" }
  },
  emits: ["update:modelValue", "keydown"],
  setup(__props, { expose: __expose, emit: __emit }) {
    dayjs.extend(customParseFormat);
    const props = __props;
    const textRef = ref(null);
    ref(null);
    const textValue = ref("");
    watch(() => props.modelValue, (v) => {
      if (!v) {
        textValue.value = "";
        return;
      }
      const d = dayjs(v);
      textValue.value = d.isValid() ? d.format("DD.MM.YYYY") : "";
    }, { immediate: true });
    __expose({
      focus: () => textRef.value?.focus()
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20", __props.wrapperClass]
      }, _attrs))}><input type="text" inputmode="numeric" placeholder="ДД.ММ.ГГГГ" class="${ssrRenderClass([__props.fieldClass, "input-field w-full cursor-text pr-9 text-left"])}"${ssrRenderAttr("value", unref(textValue))}><input type="date" class="sr-only" tabindex="-1"${ssrRenderAttr("value", __props.modelValue)}><button type="button" class="absolute right-2 top-1/2 z-[2] -translate-y-1/2 rounded-lg p-0.5 text-sber-green hover:bg-sber-green-light lg:right-4" tabindex="-1">`);
      _push(ssrRenderComponent(unref(Calendar), { class: "h-3.5 w-3.5 lg:h-4 lg:w-4" }, null, _parent));
      _push(`</button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DateFieldRu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimeFieldRu",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    fieldClass: { default: "" },
    wrapperClass: { default: "" }
  },
  emits: ["update:modelValue", "keydown"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const textRef = ref(null);
    ref(null);
    const textValue = ref("");
    function formatHHMM(v) {
      if (!v?.trim()) return "";
      const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(v.trim());
      if (!m) return "";
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
    watch(() => props.modelValue, (v) => {
      textValue.value = formatHHMM(v);
    }, { immediate: true });
    __expose({
      focus: () => textRef.value?.focus()
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20", __props.wrapperClass]
      }, _attrs))}><input type="text" inputmode="numeric" placeholder="ЧЧ:ММ" maxlength="5" class="${ssrRenderClass([__props.fieldClass, "input-field w-full cursor-text pr-9 text-left tabular-nums"])}"${ssrRenderAttr("value", unref(textValue))}><input type="time" lang="ru-RU" step="60" class="sr-only" tabindex="-1"${ssrRenderAttr("value", __props.modelValue)}><button type="button" class="absolute right-2 top-1/2 z-[2] -translate-y-1/2 rounded-lg p-0.5 text-sber-green hover:bg-sber-green-light lg:right-4" tabindex="-1">`);
      _push(ssrRenderComponent(unref(Clock), { class: "h-3.5 w-3.5 lg:h-4 lg:w-4" }, null, _parent));
      _push(`</button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimeFieldRu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
function useTaskTimeSync(form) {
  let syncing = false;
  watch(() => form.dueTime, (val) => {
    if (syncing || !val) return;
    syncing = true;
    form.durationStart = val;
    form.durationEnd = addMinutesToTime(val, 60);
    syncing = false;
  });
  watch(() => form.durationStart, (val) => {
    if (syncing) return;
    syncing = true;
    if (val) {
      form.dueTime = val;
      if (!form.durationEnd || form.durationEnd === form.dueTime) {
        form.durationEnd = addMinutesToTime(val, 60);
      }
    }
    syncing = false;
  });
}
export {
  _sfc_main$1 as _,
  _sfc_main as a,
  useTaskTimeSync as u
};
//# sourceMappingURL=useTaskTimeSync-v9DF83sN.js.map
