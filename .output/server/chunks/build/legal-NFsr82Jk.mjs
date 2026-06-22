import { _ as _sfc_main$1 } from './LegalDocumentBody-CLDhjVis.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import dayjs from 'dayjs';
import { ChevronLeft, FileText, ChevronRight } from 'lucide-vue-next';
import { f as formatLegalUpdatedAt, S as STATIC_LEGAL_DOCUMENTS } from './legal-static-BmX3fG1z.mjs';
import { b as useSettingsStore } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'axios';

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
      return "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B";
    });
    const staticUpdatedLabel = computed(
      () => selectedStatic.value ? formatLegalUpdatedAt(selectedStatic.value.updatedAt) : ""
    );
    const docTypeLabels = {
      offer: "\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u0430\u044F \u043E\u0444\u0435\u0440\u0442\u0430",
      privacy: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438",
      terms: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435",
      license: "\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F"
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
        _push(`<!--[--><button class="mb-4 text-sm font-semibold text-sber-green" type="button"> \u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 </button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl p-4"])}">`);
        if (unref(staticUpdatedLabel)) {
          _push(`<p class="mb-3 text-xs text-sber-gray"> \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E: ${ssrInterpolate(unref(staticUpdatedLabel))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_LegalDocumentBody, {
          content: unref(selectedStatic).content
        }, null, _parent));
        _push(`</div><a${ssrRenderAttr("href", unref(selectedStatic).docxPath)} class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sber-green" download> \u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B (.docx) </a><!--]-->`);
      } else if (unref(selectedApi)) {
        _push(`<!--[--><button class="mb-4 text-sm font-semibold text-sber-green" type="button"> \u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 </button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a]" : "bg-white shadow-sm", "rounded-2xl p-4"])}">`);
        if (formatUpdatedAt(unref(selectedApi).updated_at)) {
          _push(`<p class="mb-3 text-xs text-sber-gray"> \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E: ${ssrInterpolate(formatUpdatedAt(unref(selectedApi).updated_at))}</p>`);
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
          _push(`<p class="py-6 text-center text-sm text-sber-gray"> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432\u2026 </p>`);
        } else if (unref(settingsStore).legalDocumentsError) {
          _push(`<p class="py-4 text-center text-sm text-red-500">${ssrInterpolate(unref(settingsStore).legalDocumentsError)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(settingsStore).legalDocuments.length) {
          _push(`<div class="mt-4 space-y-2"><p class="px-1 text-xs font-semibold uppercase tracking-wide text-sber-gray"> \u0421 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 </p><!--[-->`);
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

export { _sfc_main as default };
//# sourceMappingURL=legal-NFsr82Jk.mjs.map
