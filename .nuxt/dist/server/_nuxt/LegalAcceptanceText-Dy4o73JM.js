import { _ as __nuxt_component_1 } from "./nuxt-link-B4h1IE6Y.js";
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LegalAcceptanceText",
  __ssrInlineRender: true,
  props: {
    prefix: { default: "Продолжая, вы принимаете" },
    suffix: { default: "." },
    termsLabel: { default: "условия использования" },
    privacyLabel: { default: "политику конфиденциальности" },
    termsTo: { default: "/legal/terms-of-use" },
    privacyTo: { default: "/legal/privacy-policy" },
    align: { default: "center" },
    inlinePrivacy: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const alignClass = computed(
      () => props.align === "left" ? "text-left" : "text-center"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(alignClass) }, _attrs))}><p class="text-xs leading-relaxed text-sber-gray">`);
      if (__props.prefix) {
        _push(`<!--[-->${ssrInterpolate(__props.prefix)}<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.termsTo,
        class: "font-medium text-sber-green underline",
        onClick: () => {
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.termsLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.termsLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.inlinePrivacy) {
        _push(`<!--[--> и `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.privacyTo,
          class: "font-medium text-sber-green underline",
          onClick: () => {
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.privacyLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.privacyLabel), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (__props.suffix) {
        _push(`<!--[-->${ssrInterpolate(__props.suffix)}<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LegalAcceptanceText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=LegalAcceptanceText-Dy4o73JM.js.map
