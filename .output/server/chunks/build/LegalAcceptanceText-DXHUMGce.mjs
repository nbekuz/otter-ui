import { _ as __nuxt_component_1 } from './nuxt-link-B5MQUkCR.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LegalAcceptanceText",
  __ssrInlineRender: true,
  props: {
    prefix: { default: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044F, \u0432\u044B \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442\u0435" },
    suffix: { default: "." },
    termsLabel: { default: "\u0443\u0441\u043B\u043E\u0432\u0438\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F" },
    privacyLabel: { default: "\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0443 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" },
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
        _push(`<!--[--> \u0438 `);
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

export { _sfc_main as _ };
//# sourceMappingURL=LegalAcceptanceText-DXHUMGce.mjs.map
