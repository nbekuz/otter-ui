import { _ as _sfc_main$1 } from "./BrandLogo-Bb3oU9iv.js";
import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { u as useAuthStore } from "./auth-CYHEneUG.js";
import { n as navigateTo } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      navigateTo("/app");
    }
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
    const metrics = [
      { label: "Разделы", value: "4", text: "Задачи, календарь, матрица и Помодоро в одном приложении." },
      { label: "Планирование", value: "День-год", text: "Удобный просмотр планов на разные периоды." },
      { label: "Фокус", value: "Без лишнего", text: "Только нужные действия и понятная структура экрана." },
      { label: "Контроль", value: "Под рукой", text: "Сроки, приоритеты и важные детали всегда рядом." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BrandLogo = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))}><div class="w-full lg:grid lg:max-w-6xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:rounded-[40px] lg:bg-white lg:p-10 lg:shadow-xl"><div class="flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-8 lg:items-start lg:px-2 lg:pt-2 lg:pb-2"><div class="relative mb-8">`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "lg",
        "show-name-from": "md",
        centered: "",
        class: "flex-col md:flex-row"
      }, null, _parent));
      _push(`<div class="absolute -top-2 -right-2 w-6 h-6 bg-sber-green/20 rounded-full"></div><div class="absolute -bottom-1 -left-3 w-4 h-4 bg-sber-blue/20 rounded-full"></div></div><p class="mb-2 max-w-xl px-4 text-center text-base leading-relaxed text-sber-gray lg:px-0 lg:text-left lg:text-lg"> Планировщик задач для тех,<br class="hidden lg:block">кто хочет держать дела под контролем </p><div class="mt-8 mb-4 grid w-full max-w-3xl grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<div class="flex items-start gap-3 rounded-[24px] bg-sber-gray-light px-4 py-4 text-left shadow-sm transition-transform lg:min-h-[120px] lg:hover:-translate-y-0.5"><div class="${ssrRenderClass([feature.bg, "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"])}">${ssrInterpolate(feature.icon)}</div><div class="min-w-0"><p class="text-sm font-semibold text-sber-black lg:text-base">${ssrInterpolate(feature.title)}</p><p class="mt-1 text-xs leading-5 text-sber-gray lg:text-sm">${ssrInterpolate(feature.text)}</p></div></div>`);
      });
      _push(`<!--]--></div></div><div class="px-6 pb-10 lg:p-0"><div class="rounded-[32px] bg-sber-gray-light p-6 lg:p-8"><p class="text-sm font-semibold text-sber-green">Планирование, фокус и порядок</p><h2 class="mt-3 max-w-md text-2xl font-bold text-sber-black">Все основные инструменты для работы с задачами в одном месте.</h2><p class="mt-3 max-w-lg text-sm leading-7 text-sber-gray"> Ведите списки задач, планируйте время в календаре, расставляйте приоритеты и сохраняйте фокус в течение дня. </p><div class="mt-6 grid grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(metrics, (metric) => {
        _push(`<div class="rounded-2xl bg-white px-4 py-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">${ssrInterpolate(metric.label)}</p><p class="mt-2 text-lg font-bold text-sber-black">${ssrInterpolate(metric.value)}</p><p class="mt-1 text-xs leading-5 text-sber-gray">${ssrInterpolate(metric.text)}</p></div>`);
      });
      _push(`<!--]--></div><div class="mt-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap"><button class="btn-primary lg:w-auto lg:min-w-[190px] lg:px-7" type="button"> Создать аккаунт </button><button class="btn-outline lg:w-auto lg:min-w-[160px] lg:px-7" type="button"> Войти </button><button class="flex w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light lg:w-auto lg:min-w-[220px] lg:px-7" type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> Войти через Google </button></div></div></div></div></div>`);
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
//# sourceMappingURL=index-Z0WHXMLB.js.map
