import { _ as __nuxt_component_1 } from './nuxt-link-WHGTxQvm.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';
import 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "fail",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-sber-gray-light px-4 py-10" }, _attrs))}><div class="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl"> ! </div><h1 class="text-2xl font-bold text-sber-black">\u041E\u043F\u043B\u0430\u0442\u0430 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430</h1><p class="mt-3 text-sm leading-relaxed text-sber-gray"> \u041F\u043B\u0430\u0442\u0451\u0436 \u043E\u0442\u043C\u0435\u043D\u0451\u043D \u0438\u043B\u0438 \u043D\u0435 \u043F\u0440\u043E\u0448\u0451\u043B. \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 \u0438\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439 \u0442\u0430\u0440\u0438\u0444. </p><div class="mt-8 space-y-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/settings?openPremium=1",
        class: "btn-primary block w-full text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 `);
          } else {
            return [
              createTextVNode(" \u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app",
        class: "btn-secondary block w-full text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E `);
          } else {
            return [
              createTextVNode(" \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/premium/fail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=fail-DPKDAUyi.mjs.map
