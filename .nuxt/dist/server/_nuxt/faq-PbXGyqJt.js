import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { ChevronLeft, Search, ChevronDown } from "lucide-vue-next";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import { b as useSettingsStore, u as useAuthStore } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    useAuthStore();
    const faqSearch = ref("");
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const filteredFaq = computed(() => {
      const items = settingsStore.helpFaq;
      if (!faqSearch.value.trim()) return items;
      const q = faqSearch.value.trim().toLowerCase();
      return items.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "page-header-top px-4 pb-4"])}"><div class="flex items-center gap-3"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold text-sber-black">Частые вопросы</h1></div></div><div class="px-4 py-4"><div class="relative mb-4">`);
      _push(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(faqSearch))} placeholder="Поиск по вопросам..." class="input-field py-3 pl-11 text-sm"></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl overflow-hidden"])}">`);
      if (unref(settingsStore).helpFaqLoading) {
        _push(`<p class="py-10 text-center text-sm text-sber-gray"> Загрузка… </p>`);
      } else if (unref(settingsStore).helpFaqError) {
        _push(`<p class="px-4 py-6 text-center text-sm text-red-500">${ssrInterpolate(unref(settingsStore).helpFaqError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsStore).helpFaqError) {
        _push(`<div class="px-4 pb-4"><button class="btn-secondary w-full" type="button"> Повторить </button></div>`);
      } else if (unref(filteredFaq).length === 0) {
        _push(`<p class="py-10 text-center text-sm text-sber-gray"> Вопросы не найдены </p>`);
      } else {
        _push(`<div><!--[-->`);
        ssrRenderList(unref(filteredFaq), (faq) => {
          _push(`<div class="border-b border-sber-gray-light last:border-0"><button class="w-full px-4 text-left" type="button"><div class="flex items-start justify-between gap-2 py-4"><span class="text-sm font-semibold text-sber-black">${ssrInterpolate(faq.question)}</span>`);
          _push(ssrRenderComponent(unref(ChevronDown), {
            class: ["mt-0.5 h-4 w-4 flex-shrink-0 text-sber-gray transition-transform", faq.open ? "rotate-180" : ""]
          }, null, _parent));
          _push(`</div></button>`);
          if (faq.open) {
            _push(`<p class="px-4 pb-4 text-sm leading-relaxed text-sber-gray">${ssrInterpolate(faq.answer)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><button class="btn-primary mt-6" type="button"> Связаться с нами </button></div><div class="h-8"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=faq-PbXGyqJt.js.map
