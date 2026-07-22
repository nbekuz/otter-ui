import { _ as _sfc_main$1 } from "./OtterCheckbox-DjcHwVCQ.js";
import { _ as __nuxt_component_1 } from "./nuxt-link-WHGTxQvm.js";
import { defineComponent, ref, computed, watch, unref, isRef, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderTeleport } from "vue/server-renderer";
import { Check } from "lucide-vue-next";
import { a as PREMIUM_SUBSCRIPTION } from "../server.mjs";
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
      () => !!selectedTariff.value?.is_recurring
    );
    const canCancel = computed(
      () => props.isPremium && !!props.subscription?.recurring_enabled && !props.subscription?.cancelled_at
    );
    const isLifetime = computed(
      () => props.subscription?.status === "active" && !props.subscription?.premium_until && props.subscription?.tariff?.duration_days === 0
    );
    const statusLabel = computed(() => {
      const status = props.subscription?.status;
      if (status === "trial") return "Пробный период активен";
      if (status === "cancelled") return "Premium активен (без автопродления)";
      if (status === "active") return "Premium активен";
      return "Premium активен";
    });
    const statusText = computed(() => {
      const map = {
        none: "Нет подписки",
        trial: "Пробный период",
        active: "Оплачен",
        past_due: "Просрочен",
        cancelled: "Отменён (доступ сохранён)",
        expired: "Истёк"
      };
      const status = props.subscription?.status;
      return status ? map[status] || status : "";
    });
    const promoUntilLabel = computed(() => {
      if (props.subscription?.status !== "trial") return "";
      return formatDate(props.subscription?.promo_until);
    });
    const payButtonLabel = computed(() => {
      const tariff = selectedTariff.value;
      if (!tariff) return `Оплатить ${PREMIUM_SUBSCRIPTION.price} ₽`;
      return `Оплатить ${formatPrice(tariff)}`;
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
      if (tariff.duration_days === 0) return `${price} ₽`;
      if (tariff.duration_days >= 365) return `${price} ₽/год`;
      return `${price} ₽/мес`;
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
      const _component_OtterCheckbox = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.featuresLoading || __props.tariffsLoading || __props.subscriptionLoading && !__props.subscription) {
        _push(`<p class="mb-4 text-center text-sm text-sber-gray"> Загрузка… </p>`);
      } else if (__props.isPremium) {
        _push(`<!--[--><div class="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50/80 px-4 py-4"><p class="text-center text-sm font-semibold text-sber-green">${ssrInterpolate(unref(statusLabel))}</p><div class="mt-3 space-y-2 text-sm text-sber-black">`);
        if (__props.subscription?.tariff) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Тариф</span><span class="text-right font-semibold">${ssrInterpolate(__props.subscription.tariff.title)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.subscription?.tariff) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Стоимость</span><span class="text-right font-semibold">${ssrInterpolate(formatPrice(__props.subscription.tariff))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(statusText)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Статус</span><span class="text-right font-semibold">${ssrInterpolate(unref(statusText))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.expiresLabel || unref(isLifetime)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Действует до</span><span class="text-right font-semibold">${ssrInterpolate(unref(isLifetime) ? "Бессрочно" : __props.expiresLabel)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(promoUntilLabel)) {
          _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Пробный период до</span><span class="text-right font-semibold">${ssrInterpolate(unref(promoUntilLabel))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-start justify-between gap-3"><span class="text-sber-gray">Автопродление</span><span class="text-right font-semibold">${ssrInterpolate(__props.subscription?.recurring_enabled ? "Включено" : "Выключено")}</span></div></div>`);
        if (__props.subscription?.cancelled_at) {
          _push(`<p class="mt-3 text-xs leading-relaxed text-sber-gray"> Автопродление отключено. Доступ сохранится до конца оплаченного периода. </p>`);
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
          _push(`<button class="w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "Отмена…" : "Отменить автопродление")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(__props.refreshLoading) ? " disabled" : ""}>${ssrInterpolate(__props.refreshLoading ? "Обновление…" : "Обновить статус")}</button><!--]-->`);
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
              _push(`<p class="mt-1 text-xs font-medium text-sber-green">${ssrInterpolate(tariff.promo_days)} дней бесплатно </p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="shrink-0 text-sm font-bold text-sber-black">${ssrInterpolate(formatPrice(tariff))}</p></div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="mb-4 rounded-2xl border border-yellow-200/80 bg-yellow-50/60 px-4 py-3"><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).price)} ₽ / ${ssrInterpolate(unref(PREMIUM_SUBSCRIPTION).period)}</p><p class="mt-1 text-xs leading-relaxed text-sber-gray"> Оплата через Robokassa. </p></div>`);
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
                      _push3(` оферты `);
                    } else {
                      return [
                        createTextVNode(" оферты ")
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
                        createTextVNode(" оферты ")
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
        if (unref(selectedTariff)?.promo_days) {
          _push(`<button class="mb-2 w-full rounded-2xl border border-sber-green bg-sber-green-light py-3.5 text-sm font-semibold text-sber-green disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "Активация…" : `Попробовать бесплатно (${unref(selectedTariff).promo_days} дн.)`)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "Открываем оплату…" : unref(payButtonLabel))}</button><button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(__props.refreshLoading) ? " disabled" : ""}>${ssrInterpolate(__props.refreshLoading ? "Проверяем…" : "Я оплатил — обновить статус")}</button><p class="mt-3 text-center text-xs text-sber-gray"> После оплаты на Robokassa Premium включается автоматически. Если статус не обновился — нажмите «обновить статус». </p><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(cancelModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(cancelModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black">Отменить автопродление?</h3><p class="mt-2 text-sm leading-relaxed text-sber-gray"> Автоматические списания прекратятся. Доступ к Premium сохранится до конца оплаченного периода. </p><button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(__props.actionLoading) ? " disabled" : ""}>${ssrInterpolate(__props.actionLoading ? "Отмена…" : "Да, отменить")}</button><button class="btn-secondary mt-3 w-full" type="button"> Не отменять </button></div>`);
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
export {
  _sfc_main as _
};
//# sourceMappingURL=PremiumSubscriptionPanel-BTEAcrnF.js.map
