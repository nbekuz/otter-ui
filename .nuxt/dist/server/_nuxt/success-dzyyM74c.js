import { _ as __nuxt_component_1 } from "./nuxt-link-WHGTxQvm.js";
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { u as useAuthStore, f as usePremiumStore } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "lucide-vue-next";
import "dayjs/locale/ru.js";
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
    const tariffTitle = computed(() => premiumStore.subscription?.tariff?.title || "");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-sber-gray-light px-4 py-10" }, _attrs))}><div class="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sber-green-light text-3xl"> ✓ </div><h1 class="text-2xl font-bold text-sber-black">Оплата прошла</h1><p class="mt-3 text-sm leading-relaxed text-sber-gray"> Robokassa подтвердила платёж. Мы обновляем статус Premium… </p>`);
      if (unref(loading)) {
        _push(`<p class="mt-6 text-sm text-sber-gray">Проверяем подписку…</p>`);
      } else if (unref(premiumStore).isPremium) {
        _push(`<p class="mt-6 text-sm font-semibold text-sber-green"> Premium активен `);
        if (unref(tariffTitle)) {
          _push(`<span> · ${ssrInterpolate(unref(tariffTitle))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(expiresLabel)) {
          _push(`<span> до ${ssrInterpolate(unref(expiresLabel))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else if (unref(error)) {
        _push(`<p class="mt-6 text-sm text-red-500">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<p class="mt-6 text-sm text-sber-gray"> Статус ещё обновляется. Нажмите «Обновить» через несколько секунд. </p>`);
      }
      _push(`<div class="mt-8 space-y-3"><button class="btn-primary w-full" type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Обновление…" : "Обновить статус")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/settings?openPremium=1",
        class: "btn-secondary block w-full text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` К настройкам Premium `);
          } else {
            return [
              createTextVNode(" К настройкам Premium ")
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
            _push2(` На главную `);
          } else {
            return [
              createTextVNode(" На главную ")
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
export {
  _sfc_main as default
};
//# sourceMappingURL=success-dzyyM74c.js.map
