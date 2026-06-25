import { _ as _sfc_main$1 } from "./LegalDocumentBody-BpGf4Cv1.js";
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import dayjs from "dayjs";
import { ChevronLeft, FileText, ChevronRight } from "lucide-vue-next";
import { f as formatLegalUpdatedAt, S as STATIC_LEGAL_DOCUMENTS } from "./legal-static-Djb9ie0o.js";
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
    const selectedStatic = ref(null);
    const selectedApi = ref(null);
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const headerTitle = computed(() => {
      if (selectedStatic.value) return selectedStatic.value.title;
      if (selectedApi.value) return selectedApi.value.title;
      return "Юридические документы";
    });
    const staticUpdatedLabel = computed(
      () => selectedStatic.value ? formatLegalUpdatedAt(selectedStatic.value.updatedAt) : ""
    );
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
      const _component_LegalDocumentBody = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "page-header-top px-4 pb-4"])}"><div class="flex items-center gap-3"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold text-sber-black">${ssrInterpolate(unref(headerTitle))}</h1></div></div><div class="px-4 py-4">`);
      if (unref(selectedStatic)) {
        _push(`<!--[--><button class="mb-4 text-sm font-semibold text-sber-green" type="button"> ← Назад к списку </button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl p-4"])}">`);
        if (unref(staticUpdatedLabel)) {
          _push(`<p class="mb-3 text-xs text-sber-gray"> Обновлено: ${ssrInterpolate(unref(staticUpdatedLabel))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_LegalDocumentBody, {
          content: unref(selectedStatic).content
        }, null, _parent));
        _push(`</div><a${ssrRenderAttr("href", unref(selectedStatic).docxPath)} class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sber-green" download> Скачать оригинал (.docx) </a><!--]-->`);
      } else if (unref(selectedApi)) {
        _push(`<!--[--><button class="mb-4 text-sm font-semibold text-sber-green" type="button"> ← Назад к списку </button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl p-4"])}">`);
        if (formatUpdatedAt(unref(selectedApi).updated_at)) {
          _push(`<p class="mb-3 text-xs text-sber-gray"> Обновлено: ${ssrInterpolate(formatUpdatedAt(unref(selectedApi).updated_at))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="whitespace-pre-wrap text-sm leading-relaxed text-sber-gray">${ssrInterpolate(unref(selectedApi).content)}</p></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(STATIC_LEGAL_DOCUMENTS), (doc) => {
          _push(`<button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors active:bg-sber-gray-light"])}" type="button">`);
          _push(ssrRenderComponent(unref(FileText), { class: "h-5 w-5 flex-shrink-0 text-sber-gray" }, null, _parent));
          _push(`<div class="min-w-0 flex-1"><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(doc.title)}</p><p class="mt-0.5 text-xs text-sber-gray">17.06.2026</p></div>`);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 flex-shrink-0 text-sber-gray" }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(settingsStore).legalDocumentsLoading) {
          _push(`<p class="py-6 text-center text-sm text-sber-gray"> Загрузка дополнительных документов… </p>`);
        } else if (unref(settingsStore).legalDocumentsError) {
          _push(`<p class="py-4 text-center text-sm text-red-500">${ssrInterpolate(unref(settingsStore).legalDocumentsError)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(settingsStore).legalDocuments.length) {
          _push(`<div class="mt-4 space-y-2"><p class="px-1 text-xs font-semibold uppercase tracking-wide text-sber-gray"> С сервера </p><!--[-->`);
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
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
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
//# sourceMappingURL=legal-Ccl9QKhT.js.map
