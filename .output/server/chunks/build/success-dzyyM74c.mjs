import { _ as __nuxt_component_1 } from './nuxt-link-WHGTxQvm.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore, f as usePremiumStore } from './server.mjs';
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
import 'dayjs';
import 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const premiumStore = usePremiumStore();
    const loading = ref(false);
    const error = ref("");
    const expiresLabel = computed(() => {
      const value = premiumStore.expiresAt;
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    });
    const tariffTitle = computed(() => {
      var _a, _b;
      return ((_b = (_a = premiumStore.subscription) == null ? void 0 : _a.tariff) == null ? void 0 : _b.title) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-sber-gray-light px-4 py-10" }, _attrs))}><div class="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sber-green-light text-3xl"> \u2713 </div><h1 class="text-2xl font-bold text-sber-black">\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u043E\u0448\u043B\u0430</h1><p class="mt-3 text-sm leading-relaxed text-sber-gray"> Robokassa \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B\u0430 \u043F\u043B\u0430\u0442\u0451\u0436. \u041C\u044B \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u043C \u0441\u0442\u0430\u0442\u0443\u0441 Premium\u2026 </p>`);
      if (unref(loading)) {
        _push(`<p class="mt-6 text-sm text-sber-gray">\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443\u2026</p>`);
      } else if (unref(premiumStore).isPremium) {
        _push(`<p class="mt-6 text-sm font-semibold text-sber-green"> Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D `);
        if (unref(tariffTitle)) {
          _push(`<span> \xB7 ${ssrInterpolate(unref(tariffTitle))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(expiresLabel)) {
          _push(`<span> \u0434\u043E ${ssrInterpolate(unref(expiresLabel))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else if (unref(error)) {
        _push(`<p class="mt-6 text-sm text-red-500">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<p class="mt-6 text-sm text-sber-gray"> \u0421\u0442\u0430\u0442\u0443\u0441 \u0435\u0449\u0451 \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u0442\u0441\u044F. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C\xBB \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434. </p>`);
      }
      _push(`<div class="mt-8 space-y-3"><button class="btn-primary w-full" type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435\u2026" : "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/settings?openPremium=1",
        class: "btn-secondary block w-full text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C Premium `);
          } else {
            return [
              createTextVNode(" \u041A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C Premium ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app",
        class: "block text-sm font-medium text-sber-green"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/premium/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-dzyyM74c.mjs.map
