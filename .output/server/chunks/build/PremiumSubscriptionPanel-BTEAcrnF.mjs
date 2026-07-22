import { _ as _sfc_main$1 } from './OtterCheckbox-DjcHwVCQ.mjs';
import { _ as __nuxt_component_1 } from './nuxt-link-WHGTxQvm.mjs';
import { defineComponent, ref, computed, watch, unref, isRef, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { Check } from 'lucide-vue-next';
import { a as PREMIUM_SUBSCRIPTION } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PremiumSubscriptionPanel",
  __ssrInlineRender: true,
  props: {
    features: {},
    featuresLoading: { type: Boolean },
    tariffs: {},
    tariffsLoading: { type: Boolean },
    selectedTariffCode: {},
    subscription: {},
    subscriptionLoading: { type: Boolean },
    isPremium: { type: Boolean },
    expiresLabel: {},
    actionLoading: { type: Boolean },
    refreshLoading: { type: Boolean }
  },
  emits: ["select-tariff", "trial", "checkout", "refresh", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const recurringConsent = ref(false);
    const consentError = ref("");
    const cancelModal = ref(false);
    const selectedTariff = computed(
      () => props.tariffs.find((t) => t.code === props.selectedTariffCode) || props.tariffs[0] || null
    );
    const needsRecurringConsent = computed(
      () => {
        var _a;
        return !!((_a = selectedTariff.value) == null ? void 0 : _a.is_recurring);
      }
    );
    const canCancel = computed(
      () => {
        var _a, _b;
        return props.isPremium && !!((_a = props.subscription) == null ? void 0 : _a.recurring_enabled) && !((_b = props.subscription) == null ? void 0 : _b.cancelled_at);
      }
    );
    const isLifetime = computed(
      () => {
        var _a, _b, _c, _d;
        return ((_a = props.subscription) == null ? void 0 : _a.status) === "active" && !((_b = props.subscription) == null ? void 0 : _b.premium_until) && ((_d = (_c = props.subscription) == null ? void 0 : _c.tariff) == null ? void 0 : _d.duration_days) === 0;
      }
    );
    const statusLabel = computed(() => {
      var _a;
      const status = (_a = props.subscription) == null ? void 0 : _a.status;
      if (status === "trial") return "\u041F\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 \u0430\u043A\u0442\u0438\u0432\u0435\u043D";
      if (status === "cancelled") return "Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D (\u0431\u0435\u0437 \u0430\u0432\u0442\u043E\u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u044F)";
      if (status === "active") return "Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D";
      return "Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D";
    });
    const statusText = computed(() => {
      var _a;
      const map = {
        none: "\u041D\u0435\u0442 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438",
        trial: "\u041F\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434",
        active: "\u041E\u043F\u043B\u0430\u0447\u0435\u043D",
        past_due: "\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D",
        cancelled: "\u041E\u0442\u043C\u0435\u043D\u0451\u043D (\u0434\u043E\u0441\u0442\u0443\u043F \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D)",
        expired: "\u0418\u0441\u0442\u0451\u043A"
      };
      const status = (_a = props.subscription) == null ? void 0 : _a.status;
      return status ? map[status] || status : "";
    });
    const promoUntilLabel = computed(() => {
      var _a, _b;
      if (((_a = props.subscription) == null ? void 0 : _a.status) !== "trial") return "";
      return formatDate((_b = props.subscription) == null ? void 0 : _b.promo_until);
    });
    const payButtonLabel = computed(() => {
      const tariff = selectedTariff.value;
      if (!tariff) return `\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C ${PREMIUM_SUBSCRIPTION.price} \u20BD`;
      return `\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C ${formatPrice(tariff)}`;
    });
    function formatDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    }
    function formatPrice(tariff) {
      const amount = Number(tariff.price);
      const price = Number.isFinite(amount) ? amount.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) : tariff.price;
      if (tariff.duration_days === 0) return `${price} \u20BD`;
      if (tariff.duration_days >= 365) return `${price} \u20BD/\u0433\u043E\u0434`;
      return `${price} \u20BD/\u043C\u0435\u0441`;
    }
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
      () => props.actionLoading,
      (loading, wasLoading) => {
        if (wasLoading && !loading) cancelModal.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_OtterCheckbox = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.featuresLoading || __props.tariffsLoading || __props.subscriptionLoading && !__props.subscription) {
        _push(`<p class="mb-4 text-center text-sm text-sber-gray"> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026 </p>`);
      } else if (__props.isPremium) {
        _push(`<!--[--><div class="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50/80 px-4 py-4"><p class="text-center text-sm font-semibold text-sber-green">${ssrInterpolate(unref(statusLabel))}</p><div class="mt-3 space-y-2 text-sm text-sber-black">`);
        if ((_a = __props.subscription) == null ? void 0 : _a.tariff) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u0422\u0430\u0440\u0438\u0444</span><span class="text-right font-semibold">${ssrInterpolate(__props.subscription.tariff.title)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_b = __props.subscription) == null ? void 0 : _b.tariff) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</span><span class="text-right font-semibold">${ssrInterpolate(formatPrice(__props.subscription.tariff))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(statusText)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u0421\u0442\u0430\u0442\u0443\u0441</span><span class="text-right font-semibold">${ssrInterpolate(unref(statusText))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.expiresLabel || unref(isLifetime)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0434\u043E</span><span class="text-right font-semibold">${ssrInterpolate(unref(isLifetime) ? "\u0411\u0435\u0441\u0441\u0440\u043E\u0447\u043D\u043E" : __props.expiresLabel)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(promoUntilLabel)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u041F\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 \u0434\u043E</span><span class="text-right font-semibold">${ssrInterpolate(unref(promoUntilLabel))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">\u0410\u0432\u0442\u043E\u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435</span><span class="text-right font-semibold">${ssrInterpolate(((_c = __props.subscription) == null ? void 0 : _c.recurring_enabled) ? "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E" : "\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E")}</span></div></div>`);
        if ((_d = __props.subscription) == null ? void 0 : _d.cancelled_at) {
          _push(`<p class="mt-3 text-xs leading-relaxed text-sber-gray"> \u0410\u0432\u0442\u043E\u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E. \u0414\u043E\u0441\u0442\u0443\u043F \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.features.length) {
          _push(`<div class="mb-4 max-h-32 space-y-2 overflow-y-auto"><!--[-->`);
          ssrRenderList(__props.features, (feat) => {
            _push(`<div class="flex items-center gap-3"><div class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">`);
            _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5 text-yellow-600" }, null, _parent));
            _push(`</div><span class="text-sm text-sber-black">${ssrInterpolate(feat.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canCancel)) {
          _push(`<button class="w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "\u041E\u0442\u043C\u0435\u043D\u0430\u2026" : "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0430\u0432\u0442\u043E\u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(__props.refreshLoading) ? " disabled" : ""}>${ssrInterpolate(__props.refreshLoading ? "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435\u2026" : "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441")}</button><!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (__props.features.length) {
          _push(`<div class="mb-4 max-h-40 space-y-3 overflow-y-auto"><!--[-->`);
          ssrRenderList(__props.features, (feat) => {
            _push(`<div class="flex items-center gap-3"><div class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">`);
            _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5 text-yellow-600" }, null, _parent));
            _push(`</div><span class="text-sm text-sber-black">${ssrInterpolate(feat.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.tariffs.length) {
          _push(`<div class="mb-4 space-y-2"><!--[-->`);
          ssrRenderList(__props.tariffs, (tariff) => {
            _push(`<button type="button" class="${ssrRenderClass([__props.selectedTariffCode === tariff.code ? "border-yellow-500 bg-yellow-50" : "border-sber-gray-light bg-white", "w-full rounded-2xl border px-4 py-3 text-left transition-colors"])}"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(tariff.title)}</p><p class="mt-0.5 text-xs text-sber-gray">${ssrInterpolate(tariff.description)}</p>`);
            if (tariff.promo_days > 0) {
              _push(`<p class="mt-1 text-xs font-medium text-sber-green">${ssrInterpolate(tariff.promo_days)} \u0434\u043D\u0435\u0439 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E </p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="shrink-0 text-sm font-bold text-sber-black">${ssrInterpolate(formatPrice(tariff))}</p></div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="mb-4 rounded-2xl border border-yellow-200/80 bg-yellow-50/60 px-4 py-3"><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).price)} \u20BD / ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).period)}</p><p class="mt-1 text-xs leading-relaxed text-sber-gray"> \u041E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 Robokassa. </p></div>`);
        }
        if (unref(needsRecurringConsent)) {
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
        } else {
          _push(`<!---->`);
        }
        if (unref(consentError)) {
          _push(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(consentError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if ((_e = unref(selectedTariff)) == null ? void 0 : _e.promo_days) {
          _push(`<button class="mb-2 w-full rounded-2xl border border-sber-green bg-sber-green-light py-3.5 text-sm font-semibold text-sber-green disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "\u0410\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u044F\u2026" : `\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E (${unref(selectedTariff).promo_days} \u0434\u043D.)`)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u043E\u043F\u043B\u0430\u0442\u0443\u2026" : unref(payButtonLabel))}</button><button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(__props.refreshLoading) ? " disabled" : ""}>${ssrInterpolate(__props.refreshLoading ? "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C\u2026" : "\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441")}</button><p class="mt-3 text-center text-xs text-sber-gray"> \u041F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u043D\u0430 Robokassa Premium \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438. \u0415\u0441\u043B\u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u043D\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u043B\u0441\u044F \u2014 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441\xBB. </p><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(cancelModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(cancelModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black">\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0430\u0432\u0442\u043E\u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435?</h3><p class="mt-2 text-sm leading-relaxed text-sber-gray"> \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u0440\u0435\u043A\u0440\u0430\u0442\u044F\u0442\u0441\u044F. \u0414\u043E\u0441\u0442\u0443\u043F \u043A Premium \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430. </p><button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "\u041E\u0442\u043C\u0435\u043D\u0430\u2026" : "\u0414\u0430, \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary mt-3 w-full" type="button"> \u041D\u0435 \u043E\u0442\u043C\u0435\u043D\u044F\u0442\u044C </button></div>`);
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
//# sourceMappingURL=PremiumSubscriptionPanel-BTEAcrnF.mjs.map
