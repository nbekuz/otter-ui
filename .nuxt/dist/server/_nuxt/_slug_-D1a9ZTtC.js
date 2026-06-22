import { _ as _sfc_main$1 } from "./LegalDocumentBody-CLDhjVis.js";
import { _ as _sfc_main$2 } from "./SiteFooter-6gd8WARK.js";
import { hasInjectionContext, inject, defineComponent, computed, watchEffect, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { ChevronLeft, Download } from "lucide-vue-next";
import { g as getStaticLegalDocument, f as formatLegalUpdatedAt } from "./legal-static-BmX3fG1z.js";
import { v as tryUseNuxtApp, d as useRoute, w as useRouter } from "../server.mjs";
import { useHead as useHead$1, headSymbol } from "/Users/nodirbek/Desktop/otter/otter-app/node_modules/@unhead/vue/dist/index.mjs";
import "./nuxt-link-B4h1IE6Y.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
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
        useHead({ title: `${document.value.title} — Otter` });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LegalDocumentBody = _sfc_main$1;
      const _component_SiteFooter = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white" }, _attrs))}><div class="page-header-top flex items-center gap-3 px-4 pb-4 sm:px-6"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold text-sber-black">${ssrInterpolate(unref(document)?.title || "Документ")}</h1></div>`);
      if (!unref(document)) {
        _push(`<div class="px-4 py-16 text-center text-sm text-sber-gray"> Документ не найден </div>`);
      } else {
        _push(`<div class="px-4 pb-10 sm:px-6">`);
        if (unref(updatedLabel)) {
          _push(`<p class="mb-4 text-xs text-sber-gray"> Обновлено: ${ssrInterpolate(unref(updatedLabel))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-2xl bg-white p-4 shadow-sm sm:p-6">`);
        _push(ssrRenderComponent(_component_LegalDocumentBody, {
          content: unref(document).content
        }, null, _parent));
        _push(`</div><a${ssrRenderAttr("href", unref(document).docxPath)} class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sber-green" download>`);
        _push(ssrRenderComponent(unref(Download), { class: "h-4 w-4" }, null, _parent));
        _push(` Скачать оригинал (.docx) </a>`);
        _push(ssrRenderComponent(_component_SiteFooter, { class: "mt-10 rounded-2xl" }, null, _parent));
        _push(`</div>`);
      }
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
export {
  _sfc_main as default
};
//# sourceMappingURL=_slug_-D1a9ZTtC.js.map
