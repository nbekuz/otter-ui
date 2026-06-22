import { _ as __nuxt_component_1 } from "./nuxt-link-B4h1IE6Y.js";
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { S as STATIC_LEGAL_DOCUMENTS } from "./legal-static-BmX3fG1z.js";
const SITE_LEGAL_INFO = {
  businessName: "ИП Наринян А.Б.",
  email: "nab1985nab@gmail.com",
  phone: "89283285202",
  phoneHref: "tel:+79283285202",
  inn: "262514605435",
  ogrnip: "326265100087984"
};
const PREMIUM_LANDING = {
  title: "Otter Premium",
  price: 150,
  period: "месяц",
  features: ["Календарь", "Помодоро", "Матрица Эйзенхауэра"]
};
const currentYear = 2026;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SiteFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const legalDocuments = STATIC_LEGAL_DOCUMENTS;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-sber-gray-light bg-sber-gray-light/60 px-4 py-8 md:px-8 lg:px-10" }, _attrs))}><div class="mx-auto max-w-6xl"><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div><p class="text-sm font-bold text-sber-black">${ssrInterpolate(unref(SITE_LEGAL_INFO).businessName)}</p><ul class="mt-3 space-y-2 text-sm text-sber-gray"><li><span class="text-sber-black/70">Email:</span><a${ssrRenderAttr("href", `mailto:${unref(SITE_LEGAL_INFO).email}`)} class="ml-1 text-sber-green hover:underline">${ssrInterpolate(unref(SITE_LEGAL_INFO).email)}</a></li><li><span class="text-sber-black/70">Телефон:</span><a${ssrRenderAttr("href", unref(SITE_LEGAL_INFO).phoneHref)} class="ml-1 text-sber-green hover:underline">${ssrInterpolate(unref(SITE_LEGAL_INFO).phone)}</a></li></ul></div><div><p class="text-sm font-bold text-sber-black">Реквизиты</p><ul class="mt-3 space-y-2 text-sm text-sber-gray"><li><span class="text-sber-black/70">ИНН:</span> ${ssrInterpolate(unref(SITE_LEGAL_INFO).inn)}</li><li><span class="text-sber-black/70">ОГРНИП:</span> ${ssrInterpolate(unref(SITE_LEGAL_INFO).ogrnip)}</li></ul></div><div><p class="text-sm font-bold text-sber-black">Документы</p><ul class="mt-3 space-y-2 text-sm"><!--[-->`);
      ssrRenderList(unref(legalDocuments), (doc) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/legal/${doc.slug}`,
          class: "text-sber-green hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(doc.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(doc.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div><p class="mt-8 text-center text-xs text-sber-gray"> © ${ssrInterpolate(currentYear)} Otter. ${ssrInterpolate(unref(SITE_LEGAL_INFO).businessName)}</p></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  PREMIUM_LANDING as P,
  _sfc_main as _
};
//# sourceMappingURL=SiteFooter-6gd8WARK.js.map
