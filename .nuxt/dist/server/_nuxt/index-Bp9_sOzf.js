import { _ as _sfc_main$2 } from "./BrandLogo-DiFLmVoB.js";
import { defineComponent, mergeProps, unref, useSSRContext, ref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Crown, Check } from "lucide-vue-next";
import { P as PREMIUM_LANDING, B as BRAND_NAME } from "./site-info-a8Ok6ThT.js";
import { _ as _sfc_main$3 } from "./LegalAcceptanceText-DXHUMGce.js";
import { _ as _sfc_main$4 } from "./SiteFooter-BXtGDBF1.js";
import { l as logoUrl } from "./logo-UOpGVcxv.js";
import { u as useAuthStore } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "./nuxt-link-B5MQUkCR.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "./legal-static-Djb9ie0o.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LandingPremiumBlock",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full rounded-[20px] border border-yellow-200/80 bg-gradient-to-br from-yellow-50 via-white to-white px-4 py-4 shadow-sm lg:rounded-[18px] lg:px-4 lg:py-3.5" }, _attrs))}><div class="flex items-start gap-3"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700 lg:h-9 lg:w-9">`);
      _push(ssrRenderComponent(unref(Crown), { class: "h-5 w-5 lg:h-4 lg:w-4" }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1"><p class="text-[11px] font-semibold uppercase tracking-wide text-yellow-700 lg:text-[10px]">${ssrInterpolate(unref(PREMIUM_LANDING).title)}</p><p class="mt-0.5 text-xl font-bold text-sber-black lg:text-2xl">${ssrInterpolate(unref(PREMIUM_LANDING).price)} ₽ <span class="text-sm font-medium text-sber-gray">/ ${ssrInterpolate(unref(PREMIUM_LANDING).period)}</span></p><p class="mt-1 text-xs text-sber-gray lg:text-[13px]"> Расширенный доступ к разделам: </p><ul class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1"><!--[-->`);
      ssrRenderList(unref(PREMIUM_LANDING).features, (feature) => {
        _push(`<li class="flex items-center gap-1.5 text-sm font-medium text-sber-black lg:text-[13px]"><span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-yellow-100 text-yellow-700">`);
        _push(ssrRenderComponent(unref(Check), {
          class: "h-2.5 w-2.5",
          "stroke-width": "3"
        }, null, _parent));
        _push(`</span> ${ssrInterpolate(feature)}</li>`);
      });
      _push(`<!--]--></ul></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LandingPremiumBlock.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    useAuthStore();
    const googleLoading = ref(false);
    const googleError = ref("");
    const features = [
      {
        icon: "✅",
        bg: "bg-green-100",
        title: "Списки задач",
        text: "Собирайте задачи по срокам, спискам и приоритетам"
      },
      {
        icon: "📅",
        bg: "bg-blue-100",
        title: "Календарь",
        text: "Смотрите планы на день, неделю, месяц и год"
      },
      {
        icon: "🎯",
        bg: "bg-purple-100",
        title: "Матрица Эйзенхауэра",
        text: "Разделяйте задачи по важности и срочности"
      },
      {
        icon: "🍅",
        bg: "bg-red-100",
        title: "Таймер Помодоро",
        text: "Чередуйте работу и перерывы без лишних настроек"
      }
    ];
    const metrics = ["планируйте", "контролируйте", "фокусируйтесь", "управляйте"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BrandLogo = _sfc_main$2;
      const _component_LandingPremiumBlock = _sfc_main$1;
      const _component_LegalAcceptanceText = _sfc_main$3;
      const _component_SiteFooter = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh w-full flex-col overflow-x-hidden bg-white" }, _attrs))}><div class="flex flex-1 flex-col"><div class="mx-auto w-full max-w-[1380px] px-4 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8 lg:grid lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-10 lg:px-8 lg:py-6 xl:gap-12 xl:px-12 xl:py-8"><div class="flex w-full flex-col items-stretch justify-start"><div class="relative mb-4 w-fit self-center md:self-start lg:mb-3">`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "md",
        "show-name-from": "always",
        "text-class": "text-sber-black lg:text-2xl"
      }, null, _parent));
      _push(`</div><p class="mb-0 w-full text-center text-base leading-relaxed text-sber-gray md:text-left lg:max-w-2xl lg:text-lg lg:leading-snug"> Планировщик задач для тех, кто ценит время </p><div class="mt-5 grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:mt-4 lg:gap-4"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<div class="flex items-start gap-3 rounded-[20px] bg-sber-gray-light px-4 py-3.5 text-left shadow-sm lg:min-h-[108px] lg:rounded-[20px] lg:px-4 lg:py-4"><div class="${ssrRenderClass([feature.bg, "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg lg:h-10 lg:w-10"])}">${ssrInterpolate(feature.icon)}</div><div class="min-w-0"><p class="text-sm font-semibold text-sber-black lg:text-base">${ssrInterpolate(feature.title)}</p><p class="mt-0.5 text-xs leading-5 text-sber-gray lg:text-sm">${ssrInterpolate(feature.text)}</p></div></div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_LandingPremiumBlock, { class: "mt-3 lg:mt-4" }, null, _parent));
      _push(`</div><div class="w-full max-w-none pt-4 pb-2 md:pt-6 lg:pt-0 lg:pb-0"><div class="w-full rounded-[28px] bg-sber-gray-light p-5 md:p-6 lg:min-h-full lg:p-6 xl:p-7"><p class="text-sm font-semibold text-sber-green">Планирование, фокус и порядок</p><h2 class="mt-2 text-xl font-bold text-sber-black lg:text-2xl lg:leading-tight"> Все основные инструменты для работы с задачами в одном месте. </h2><p class="mt-2 text-sm leading-6 text-sber-gray lg:max-w-md lg:text-[15px]"> Ведите списки задач, планируйте время в календаре, расставляйте приоритеты и сохраняйте фокус в течение дня. </p><div class="relative mt-4 grid grid-cols-2 items-start gap-2 sm:gap-3 lg:mt-5"><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "sm:mt-6 lg:mt-6": index % 2 === 1 }, "flex min-h-[88px] min-w-0 items-center justify-center rounded-2xl bg-white px-2 py-3 text-center shadow-sm sm:px-3 lg:min-h-[92px] lg:px-4 lg:py-4"])}"><p class="w-full min-w-0 text-balance text-center text-[11px] font-bold uppercase leading-tight tracking-tight text-sber-black sm:text-sm lg:text-sm">${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light lg:h-[72px] lg:w-[72px]"><div class="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm lg:h-12 lg:w-12"><img${ssrRenderAttr("src", unref(logoUrl))}${ssrRenderAttr("alt", `${unref(BRAND_NAME)} logo`)} class="h-7 w-7 brightness-0 lg:h-7 lg:w-7"></div></div></div><div class="mt-4 flex w-full flex-col items-center gap-2 lg:mt-4"><div class="flex w-full flex-wrap justify-center gap-2"><button class="btn-primary !w-auto min-w-0 shrink px-4 sm:px-6" type="button"> Создать аккаунт </button><button class="btn-outline !w-auto min-w-0 shrink px-4 sm:px-6" type="button"> Войти </button></div><div class="flex w-full flex-col items-center gap-2">`);
      if (unref(googleError)) {
        _push(`<p class="w-full text-center text-xs text-red-500">${ssrInterpolate(unref(googleError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="flex !w-auto max-w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white px-4 py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60 sm:px-5" type="button"${ssrIncludeBooleanAttr(unref(googleLoading)) ? " disabled" : ""}><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> ${ssrInterpolate(unref(googleLoading) ? "Вход…" : "Войти через Google")}</button></div></div><div class="mt-4 lg:mt-3">`);
      _push(ssrRenderComponent(_component_LegalAcceptanceText, null, null, _parent));
      _push(`</div></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SiteFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-Bp9_sOzf.js.map
