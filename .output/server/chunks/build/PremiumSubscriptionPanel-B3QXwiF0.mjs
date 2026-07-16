import { _ as _sfc_main$1 } from './OtterCheckbox-DjcHwVCQ.mjs';
import { _ as __nuxt_component_1 } from './nuxt-link-B5MQUkCR.mjs';
import { defineComponent, ref, watch, unref, isRef, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { Check } from 'lucide-vue-next';
import { a as PREMIUM_SUBSCRIPTION } from './site-info-BLRUyLP_.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PremiumSubscriptionPanel",
  __ssrInlineRender: true,
  props: {
    features: {},
    featuresLoading: { type: Boolean },
    isPremium: { type: Boolean },
    expiresLabel: {},
    checkoutLoading: { type: Boolean },
    activateLoading: { type: Boolean },
    cancelLoading: { type: Boolean }
  },
  emits: ["checkout", "activate", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const recurringConsent = ref(false);
    const consentError = ref("");
    const cancelModal = ref(false);
    watch(recurringConsent, (value) => {
      if (value) consentError.value = "";
    });
    watch(
      () => props.isPremium,
      (premium) => {
        if (!premium) recurringConsent.value = false;
      }
    );
    watch(
      () => props.cancelLoading,
      (loading, wasLoading) => {
        if (wasLoading && !loading && !props.isPremium) cancelModal.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OtterCheckbox = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.featuresLoading) {
        _push(`<p class="mb-4 text-center text-sm text-sber-gray"> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0435\u0439\u2026 </p>`);
      } else {
        _push(`<div class="mb-4 max-h-48 space-y-3 overflow-y-auto"><!--[-->`);
        ssrRenderList(__props.features, (feat) => {
          _push(`<div class="flex items-center gap-3"><div class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">`);
          _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5 text-yellow-600" }, null, _parent));
          _push(`</div><span class="text-sm text-sber-black">${ssrInterpolate(feat.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (__props.isPremium) {
        _push(`<!--[--><p class="text-center text-sm font-semibold text-sber-green"> Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D </p>`);
        if (__props.expiresLabel) {
          _push(`<p class="mt-1 text-center text-xs text-sber-gray"> \u0421\u0440\u043E\u043A \u0434\u043E ${ssrInterpolate(__props.expiresLabel)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="mt-4 rounded-2xl bg-sber-gray-light px-4 py-3 text-xs leading-relaxed text-sber-gray"> \u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043F\u0440\u043E\u0434\u043B\u0435\u0432\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438: ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).price)} \u20BD/ ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).period)}. \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435 \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u2014 ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).chargeSchedule)}. </p><button class="mt-4 w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.cancelLoading) ? " disabled" : ""}>${ssrInterpolate(__props.cancelLoading ? "\u041E\u0442\u043C\u0435\u043D\u0430\u2026" : "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443")}</button><!--]-->`);
      } else {
        _push(`<!--[--><div class="mb-4 rounded-2xl border border-yellow-200/80 bg-yellow-50/60 px-4 py-3"><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).price)} \u20BD / ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).period)}</p><p class="mt-1 text-xs leading-relaxed text-sber-gray"> \u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u0441 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435\u043C. \u0421\u043F\u0438\u0441\u0430\u043D\u0438\u044F: ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).chargeSchedule)}. \u041E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 Robokassa. </p></div>`);
        _push(ssrRenderComponent(_component_OtterCheckbox, {
          modelValue: unref(recurringConsent),
          "onUpdate:modelValue": ($event) => isRef(recurringConsent) ? recurringConsent.value = $event : null,
          class: "mb-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-sm leading-relaxed text-sber-gray"${_scopeId}>${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).consentText)} `);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/legal/${unref(PREMIUM_SUBSCRIPTION).offerSlug}`,
                class: "font-medium text-sber-green underline",
                onClick: () => {
                }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u043E\u0444\u0435\u0440\u0442\u044B `);
                  } else {
                    return [
                      createTextVNode(" \u043E\u0444\u0435\u0440\u0442\u044B ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p>`);
            } else {
              return [
                createVNode("p", { class: "text-sm leading-relaxed text-sber-gray" }, [
                  createTextVNode(toDisplayString(unref(PREMIUM_SUBSCRIPTION).consentText) + " ", 1),
                  createVNode(_component_NuxtLink, {
                    to: `/legal/${unref(PREMIUM_SUBSCRIPTION).offerSlug}`,
                    class: "font-medium text-sber-green underline",
                    onClick: withModifiers(() => {
                    }, ["stop"])
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u043E\u0444\u0435\u0440\u0442\u044B ")
                    ]),
                    _: 1
                  }, 8, ["to", "onClick"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(consentError)) {
          _push(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(consentError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.checkoutLoading) ? " disabled" : ""}>${ssrInterpolate(__props.checkoutLoading ? "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u043E\u043F\u043B\u0430\u0442\u0443\u2026" : `\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C ${unref(PREMIUM_SUBSCRIPTION).price} \u20BD/${unref(PREMIUM_SUBSCRIPTION).period}`)}</button><button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(__props.activateLoading) ? " disabled" : ""}>${ssrInterpolate(__props.activateLoading ? "\u0410\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u044F\u2026" : "\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C")}</button><p class="mt-3 text-center text-xs text-sber-gray"> \u041F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C\xBB, \u0435\u0441\u043B\u0438 Premium \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438. </p><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(cancelModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(cancelModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black">\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443?</h3><p class="mt-2 text-sm leading-relaxed text-sber-gray"> \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u0440\u0435\u043A\u0440\u0430\u0442\u044F\u0442\u0441\u044F. \u0414\u043E\u0441\u0442\u0443\u043F \u043A Premium \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430. </p><button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.cancelLoading) ? " disabled" : ""}>${ssrInterpolate(__props.cancelLoading ? "\u041E\u0442\u043C\u0435\u043D\u0430\u2026" : "\u0414\u0430, \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443")}</button><button class="btn-secondary mt-3 w-full" type="button"> \u041D\u0435 \u043E\u0442\u043C\u0435\u043D\u044F\u0442\u044C </button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PremiumSubscriptionPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PremiumSubscriptionPanel-B3QXwiF0.mjs.map
