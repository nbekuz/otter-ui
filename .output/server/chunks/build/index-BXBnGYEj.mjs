import { _ as _sfc_main$1 } from './BrandLogo-CTMJTDOf.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Check } from 'lucide-vue-next';
import { l as logoUrl } from './logo-DVdZXLLs.mjs';
import { u as useAuthStore } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    useAuthStore();
    const googleLoading = ref(false);
    const googleError = ref("");
    const features = [
      {
        icon: "\u2705",
        bg: "bg-green-100",
        title: "\u0421\u043F\u0438\u0441\u043A\u0438 \u0437\u0430\u0434\u0430\u0447",
        text: "\u0421\u043E\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043F\u043E \u0441\u0440\u043E\u043A\u0430\u043C, \u0441\u043F\u0438\u0441\u043A\u0430\u043C \u0438 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430\u043C"
      },
      {
        icon: "\u{1F4C5}",
        bg: "bg-blue-100",
        title: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
        text: "\u0421\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u043F\u043B\u0430\u043D\u044B \u043D\u0430 \u0434\u0435\u043D\u044C, \u043D\u0435\u0434\u0435\u043B\u044E, \u043C\u0435\u0441\u044F\u0446 \u0438 \u0433\u043E\u0434"
      },
      {
        icon: "\u{1F3AF}",
        bg: "bg-purple-100",
        title: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u042D\u0439\u0437\u0435\u043D\u0445\u0430\u0443\u044D\u0440\u0430",
        text: "\u0420\u0430\u0437\u0434\u0435\u043B\u044F\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043F\u043E \u0432\u0430\u0436\u043D\u043E\u0441\u0442\u0438 \u0438 \u0441\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u0438"
      },
      {
        icon: "\u{1F345}",
        bg: "bg-red-100",
        title: "\u0422\u0430\u0439\u043C\u0435\u0440 \u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E",
        text: "\u0427\u0435\u0440\u0435\u0434\u0443\u0439\u0442\u0435 \u0440\u0430\u0431\u043E\u0442\u0443 \u0438 \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u044B \u0431\u0435\u0437 \u043B\u0438\u0448\u043D\u0438\u0445 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A"
      }
    ];
    const metrics = ["\u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435", "\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439\u0442\u0435", "\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C", "\u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435"];
    const checklistItems = [
      "\u0421\u043F\u0438\u0441\u043A\u0438 \u0437\u0430\u0434\u0430\u0447",
      "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
      "\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u042D\u0439\u0437\u0435\u043D\u0445\u0430\u0443\u044D\u0440\u0430",
      "\u0422\u0430\u0439\u043C\u0435\u0440 \u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BrandLogo = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh w-full overflow-x-hidden bg-white lg:flex lg:items-center lg:justify-center" }, _attrs))}><div class="w-full px-4 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-12 lg:px-10 lg:py-10 xl:gap-16 xl:px-14 2xl:px-20"><div class="flex w-full flex-1 flex-col items-center justify-start md:items-stretch lg:items-start lg:pt-0 lg:pb-2"><div class="relative mb-8 w-fit lg:origin-left lg:scale-110">`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "lg",
        "show-name-from": "always",
        "text-class": "text-sber-black"
      }, null, _parent));
      _push(`<div class="pointer-events-none absolute -top-2 left-[calc(4rem-0.5rem)] h-6 w-6 rounded-full bg-sber-green/20"></div><div class="pointer-events-none absolute -bottom-1 -left-3 h-4 w-4 rounded-full bg-sber-blue/20"></div></div><p class="mb-2 w-full text-center text-lg leading-relaxed text-sber-gray md:text-left md:text-xl md:leading-relaxed lg:max-w-2xl lg:text-2xl lg:leading-snug"> \u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A \u0437\u0430\u0434\u0430\u0447 \u0434\u043B\u044F \u0442\u0435\u0445, \u043A\u0442\u043E \u0446\u0435\u043D\u0438\u0442 \u0432\u0440\u0435\u043C\u044F </p><div class="mt-10 mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:gap-5"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<div class="flex items-start gap-3 rounded-[24px] bg-sber-gray-light px-5 py-5 text-left shadow-sm transition-transform md:min-h-[120px] lg:min-h-[136px] lg:hover:-translate-y-0.5"><div class="${ssrRenderClass([feature.bg, "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"])}">${ssrInterpolate(feature.icon)}</div><div class="min-w-0"><p class="text-base font-semibold text-sber-black lg:text-lg">${ssrInterpolate(feature.title)}</p><p class="mt-1 text-sm leading-6 text-sber-gray lg:text-base">${ssrInterpolate(feature.text)}</p></div></div>`);
      });
      _push(`<!--]--></div><div class="mt-2 w-full rounded-[24px] border border-sber-gray-mid/25 bg-white px-5 py-4 shadow-sm md:px-6 md:py-5"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray"> \u0412 \u043E\u0434\u043D\u043E\u043C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438 </p><ul class="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4"><!--[-->`);
      ssrRenderList(checklistItems, (item) => {
        _push(`<li class="flex items-center gap-3 text-sm font-medium text-sber-black lg:text-base"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-sber-green bg-sber-green/10">`);
        _push(ssrRenderComponent(unref(Check), {
          class: "h-3.5 w-3.5 text-sber-green",
          "stroke-width": "3"
        }, null, _parent));
        _push(`</span> ${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ul></div></div><div class="w-full max-w-none pb-10 pt-2 md:pb-12 lg:max-w-none lg:pb-0 lg:pt-0"><div class="w-full rounded-[32px] bg-sber-gray-light p-6 md:p-8 lg:p-8"><p class="text-sm font-semibold text-sber-green">\u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435, \u0444\u043E\u043A\u0443\u0441 \u0438 \u043F\u043E\u0440\u044F\u0434\u043E\u043A</p><h2 class="mt-3 w-full text-2xl font-bold text-sber-black lg:max-w-xl xl:max-w-2xl"> \u0412\u0441\u0435 \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u0437\u0430\u0434\u0430\u0447\u0430\u043C\u0438 \u0432 \u043E\u0434\u043D\u043E\u043C \u043C\u0435\u0441\u0442\u0435. </h2><p class="mt-3 w-full text-sm leading-7 text-sber-gray md:text-base lg:max-w-xl"> \u0412\u0435\u0434\u0438\u0442\u0435 \u0441\u043F\u0438\u0441\u043A\u0438 \u0437\u0430\u0434\u0430\u0447, \u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0435\u043C\u044F \u0432 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435, \u0440\u0430\u0441\u0441\u0442\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u044B \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0439\u0442\u0435 \u0444\u043E\u043A\u0443\u0441 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F. </p><div class="relative mt-6 w-full grid grid-cols-2 items-start gap-2 sm:gap-3 md:mt-8 md:gap-4"><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "sm:mt-8": index % 2 === 1 }, "flex min-h-[112px] min-w-0 items-center justify-center rounded-2xl bg-white px-2 py-4 text-center shadow-sm sm:px-4"])}"><p class="w-full min-w-0 max-w-full text-balance break-anywhere text-center text-[11px] font-bold uppercase leading-tight tracking-tight text-sber-black sm:text-sm sm:leading-snug sm:tracking-wide md:text-base">${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light"><div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0"></div></div></div><div class="mt-6 flex w-full flex-col items-center gap-2 md:mt-8 md:gap-3"><div class="flex w-full flex-wrap justify-center gap-2 md:gap-3"><button class="btn-primary !w-auto min-w-0 shrink px-4 sm:px-6 md:px-8" type="button"> \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442 </button><button class="btn-outline !w-auto min-w-0 shrink px-4 sm:px-6 md:px-8" type="button"> \u0412\u043E\u0439\u0442\u0438 </button></div><div class="flex w-full flex-col items-center gap-2">`);
      if (unref(googleError)) {
        _push(`<p class="w-full text-center text-xs text-red-500">${ssrInterpolate(unref(googleError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="flex !w-auto max-w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white px-5 py-4 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-base" type="button"${ssrIncludeBooleanAttr(unref(googleLoading)) ? " disabled" : ""}><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> ${ssrInterpolate(unref(googleLoading) ? "\u0412\u0445\u043E\u0434\u2026" : "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Google")}</button></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BXBnGYEj.mjs.map
