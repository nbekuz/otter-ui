import { defineComponent, useId, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { Check } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OtterCheckbox",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    align: { default: "start" },
    wrapperClass: { default: "" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const uid = useId();
    const inputId = `${uid}-cb`;
    const labelId = `${uid}-label`;
    const alignClass = computed(
      () => props.align === "center" ? "items-center" : "items-start"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex gap-3", [unref(alignClass), __props.wrapperClass]]
      }, _attrs))}><button${ssrRenderAttr("id", inputId)} type="button" class="${ssrRenderClass([__props.modelValue ? "border-sber-green bg-sber-green" : "border-sber-gray-mid bg-white", "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sber-green focus-visible:ring-offset-2"])}" role="checkbox"${ssrRenderAttr("aria-checked", __props.modelValue)}${ssrRenderAttr("aria-labelledby", labelId)}>`);
      if (__props.modelValue) {
        _push(ssrRenderComponent(unref(Check), {
          class: "h-4 w-4 text-white",
          "stroke-width": "3"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><div${ssrRenderAttr("id", labelId)} class="min-w-0 flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OtterCheckbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=OtterCheckbox-DjcHwVCQ.js.map
