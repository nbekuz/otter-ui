import { _ as _sfc_main$1 } from './LegalDocumentBody-BpGf4Cv1.mjs';
import { _ as _sfc_main$2 } from './SiteFooter-BXtGDBF1.mjs';
import { defineComponent, computed, watchEffect, mergeProps, unref, hasInjectionContext, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { ChevronLeft, Download } from 'lucide-vue-next';
import { g as getStaticLegalDocument, f as formatLegalUpdatedAt } from './legal-static-Djb9ie0o.mjs';
import { B as BRAND_NAME } from './site-info-a8Ok6ThT.mjs';
import { d as useRoute, v as useRouter, t as tryUseNuxtApp } from './server.mjs';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import './nuxt-link-B5MQUkCR.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'axios';
import 'dayjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

function injectHead(nuxtApp) {
  var _a;
  const nuxt = nuxtApp || tryUseNuxtApp();
  return ((_a = nuxt == null ? void 0 : nuxt.ssrContext) == null ? void 0 : _a.head) || (nuxt == null ? void 0 : nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  }));
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const slug = computed(() => String(route.params.slug || ""));
    const document = computed(() => getStaticLegalDocument(slug.value));
    const updatedLabel = computed(
      () => document.value ? formatLegalUpdatedAt(document.value.updatedAt) : ""
    );
    watchEffect(() => {
      if (document.value) {
        useHead({ title: `${document.value.title} \u2014 ${BRAND_NAME}` });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_LegalDocumentBody = _sfc_main$1;
      const _component_SiteFooter = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh flex-col bg-white" }, _attrs))}><div class="page-header-top flex shrink-0 items-center gap-3 px-4 pb-4 sm:px-6"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold text-sber-black">${ssrInterpolate(((_a = unref(document)) == null ? void 0 : _a.title) || "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442")}</h1></div>`);
      if (!unref(document)) {
        _push(`<div class="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-sber-gray"> \u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D </div>`);
      } else {
        _push(`<div class="flex flex-1 flex-col px-4 pb-6 sm:px-6">`);
        if (unref(updatedLabel)) {
          _push(`<p class="mb-4 text-xs text-sber-gray"> \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E: ${ssrInterpolate(unref(updatedLabel))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-2xl bg-white p-4 shadow-sm sm:p-6">`);
        _push(ssrRenderComponent(_component_LegalDocumentBody, {
          content: unref(document).content
        }, null, _parent));
        _push(`</div><a${ssrRenderAttr("href", unref(document).docxPath)} class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sber-green" download>`);
        _push(ssrRenderComponent(unref(Download), { class: "h-4 w-4" }, null, _parent));
        _push(` \u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B (.docx) </a></div>`);
      }
      _push(ssrRenderComponent(_component_SiteFooter, { class: "mt-auto shrink-0" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/legal/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-r6L6d4uh.mjs.map
