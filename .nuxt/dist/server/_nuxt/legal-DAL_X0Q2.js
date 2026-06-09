import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import dayjs from "dayjs";
import { ChevronLeft, FileText, ChevronRight } from "lucide-vue-next";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import { b as useSettingsStore } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "legal",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const selectedDoc = ref(null);
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const docTypeLabels = {
      offer: "Публичная оферта",
      privacy: "Политика конфиденциальности",
      terms: "Пользовательское соглашение",
      license: "Лицензия"
    };
    function docTypeLabel(type) {
      return docTypeLabels[type] || type;
    }
    function formatUpdatedAt(value) {
      const d = dayjs(value);
      if (!d.isValid()) return "";
      return d.format("D MMMM YYYY, HH:mm");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "page-header-top px-4 pb-4"])}"><div class="flex items-center gap-3"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold text-sber-black">${ssrInterpolate(unref(selectedDoc) ? unref(selectedDoc).title : "Юридические документы")}</h1></div></div><div class="px-4 py-4">`);
      if (unref(settingsStore).legalDocumentsLoading) {
        _push(`<p class="py-10 text-center text-sm text-sber-gray"> Загрузка… </p>`);
      } else if (unref(settingsStore).legalDocumentsError) {
        _push(`<p class="py-6 text-center text-sm text-red-500">${ssrInterpolate(unref(settingsStore).legalDocumentsError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsStore).legalDocumentsError) {
        _push(`<button class="btn-secondary w-full" type="button"> Повторить </button>`);
      } else if (unref(selectedDoc)) {
        _push(`<!--[--><button class="mb-4 text-sm font-semibold text-sber-green" type="button"> ← Назад к списку </button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl p-4"])}">`);
        if (formatUpdatedAt(unref(selectedDoc).updated_at)) {
          _push(`<p class="mb-3 text-xs text-sber-gray"> Обновлено: ${ssrInterpolate(formatUpdatedAt(unref(selectedDoc).updated_at))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="whitespace-pre-wrap text-sm leading-relaxed text-sber-gray">${ssrInterpolate(unref(selectedDoc).content)}</p></div><!--]-->`);
      } else {
        _push(`<div class="space-y-2">`);
        if (unref(settingsStore).legalDocuments.length === 0) {
          _push(`<p class="py-10 text-center text-sm text-sber-gray"> Документы пока не опубликованы </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(settingsStore).legalDocuments, (doc, index) => {
          _push(`<button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors active:bg-sber-gray-light"])}" type="button">`);
          _push(ssrRenderComponent(unref(FileText), { class: "h-5 w-5 flex-shrink-0 text-sber-gray" }, null, _parent));
          _push(`<div class="min-w-0 flex-1"><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(doc.title)}</p>`);
          if (docTypeLabel(doc.doc_type)) {
            _push(`<p class="mt-0.5 text-xs text-sber-gray">${ssrInterpolate(docTypeLabel(doc.doc_type))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 flex-shrink-0 text-sber-gray" }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="h-8"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/legal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=legal-DAL_X0Q2.js.map
