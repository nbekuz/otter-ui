import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-vue-next';

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
    const props = __props;
    const nativeRef = ref(null);
    const displayText = computed(() => {
      if (!props.modelValue) return "";
      const d = dayjs(props.modelValue);
      return d.isValid() ? d.format("DD.MM.YYYY") : "";
    });
    __expose({
      focus: () => {
        const el = nativeRef.value;
        if (!el) return;
        if (typeof el.showPicker === "function") {
          try {
            el.showPicker();
            return;
          } catch {
          }
        }
        el.focus();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20", __props.wrapperClass]
      }, _attrs))}><div class="${ssrRenderClass([__props.fieldClass, "input-field pointer-events-none flex min-h-0 items-center pr-9 text-left"])}"><span class="${ssrRenderClass(unref(displayText) ? "text-sber-black" : "text-sber-gray")}">${ssrInterpolate(unref(displayText) || "__.__.____")}</span></div><input type="date" class="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"${ssrRenderAttr("value", __props.modelValue)}>`);
      _push(ssrRenderComponent(unref(Calendar), { class: "pointer-events-none absolute right-2 top-1/2 z-[2] h-3.5 w-3.5 -translate-y-1/2 text-sber-green lg:right-4 lg:h-4 lg:w-4" }, null, _parent));
      _push(`</div>`);
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
    const nativeRef = ref(null);
    function formatHHMM(v) {
      if (!(v == null ? void 0 : v.trim())) return "";
      const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(v.trim());
      if (!m) return "";
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
    const displayText = computed(() => formatHHMM(props.modelValue));
    __expose({
      focus: () => {
        const el = nativeRef.value;
        if (!el) return;
        if (typeof el.showPicker === "function") {
          try {
            el.showPicker();
            return;
          } catch {
          }
        }
        el.focus();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative rounded-2xl focus-within:border-sber-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sber-green/20", __props.wrapperClass]
      }, _attrs))}><div class="${ssrRenderClass([__props.fieldClass, "input-field pointer-events-none flex min-h-0 items-center pr-9 text-left tabular-nums"])}"><span class="${ssrRenderClass(unref(displayText) ? "text-sber-black" : "text-sber-gray")}">${ssrInterpolate(unref(displayText) || "__:__")}</span></div><input type="time" lang="ru-RU" step="60" class="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"${ssrRenderAttr("value", __props.modelValue)}>`);
      _push(ssrRenderComponent(unref(Clock), { class: "pointer-events-none absolute right-2 top-1/2 z-[2] h-3.5 w-3.5 -translate-y-1/2 text-sber-green lg:right-4 lg:h-4 lg:w-4" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimeFieldRu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
//# sourceMappingURL=TimeFieldRu-CPDZOlfK.mjs.map
