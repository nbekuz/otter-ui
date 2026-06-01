import { _ as _sfc_main$2 } from './BrandLogo-CTMJTDOf.mjs';
import { _ as __nuxt_component_1 } from './nuxt-link-BT-Ms78F.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { CheckSquare, Calendar, Grid2x2, Timer, Settings, Plus } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { d as useRoute, u as useAuthStore, c as useSettingsStore } from './server.mjs';
import './logo-DVdZXLLs.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const settingsStore = useSettingsStore();
    const todayDate = dayjs().format("D");
    const allNavItems = [
      { id: "tasks", to: "/app", icon: CheckSquare, label: "\u0417\u0430\u0434\u0430\u0447\u0438" },
      { id: "calendar", to: "/app/calendar", icon: Calendar, label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C" },
      { id: "matrix", to: "/app/matrix", icon: Grid2x2, label: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430" },
      { id: "pomodoro", to: "/app/pomodoro", icon: Timer, label: "\u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E" },
      { id: "settings", to: "/app/settings", icon: Settings, label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }
    ];
    const navItems = computed(() => {
      const order = settingsStore.appSettings.bottomNavItems || [];
      const byId = new Map(allNavItems.map((item) => [item.id, item]));
      return order.map((id) => byId.get(id)).filter(Boolean);
    });
    function isActive(to) {
      if (to === "/app") return route.path === "/app";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-sber-gray-mid bg-white safe-bottom lg:hidden" }, _attrs))}><div class="flex items-center justify-around px-2 py-2"><!--[-->`);
      ssrRenderList(unref(navItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.id,
          to: item.to,
          class: ["flex flex-col items-center gap-1 min-w-[52px] py-1 px-2 rounded-xl transition-colors active:bg-sber-gray-light relative", isActive(item.to) ? "text-sber-green" : "text-sber-gray"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                class: "w-6 h-6",
                "stroke-width": isActive(item.to) ? 2.5 : 1.8
              }, null), _parent2, _scopeId);
              _push2(`<span class="text-[10px] font-medium leading-none"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (item.id === "calendar" && !isActive(item.to)) {
                _push2(`<span class="absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-gray bg-sber-gray-light rounded px-0.5"${_scopeId}>${ssrInterpolate(unref(todayDate))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (item.id === "calendar" && isActive(item.to)) {
                _push2(`<span class="absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-green bg-sber-green-light rounded px-0.5"${_scopeId}>${ssrInterpolate(unref(todayDate))}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  class: "w-6 h-6",
                  "stroke-width": isActive(item.to) ? 2.5 : 1.8
                }, null, 8, ["stroke-width"])),
                createVNode("span", { class: "text-[10px] font-medium leading-none" }, toDisplayString(item.label), 1),
                item.id === "calendar" && !isActive(item.to) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-gray bg-sber-gray-light rounded px-0.5"
                }, toDisplayString(unref(todayDate)), 1)) : createCommentVNode("", true),
                item.id === "calendar" && isActive(item.to) ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-green bg-sber-green-light rounded px-0.5"
                }, toDisplayString(unref(todayDate)), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/BottomNav.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    computed(() => route.path === "/app");
    const navItems = [
      { id: "tasks", to: "/app", icon: CheckSquare, label: "\u0417\u0430\u0434\u0430\u0447\u0438" },
      { id: "calendar", to: "/app/calendar", icon: Calendar, label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C" },
      { id: "matrix", to: "/app/matrix", icon: Grid2x2, label: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430" },
      { id: "pomodoro", to: "/app/pomodoro", icon: Timer, label: "\u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E" },
      { id: "settings", to: "/app/settings", icon: Settings, label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }
    ];
    function isActive(to) {
      if (to === "/app") return route.path === "/app";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BrandLogo = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_LayoutBottomNav = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-dvh lg:px-6 lg:py-6", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="mx-auto flex min-h-dvh max-w-[1440px] lg:h-[calc(100dvh-3rem)] lg:min-h-[calc(100dvh-3rem)] lg:gap-6 rounded"><aside class="${ssrRenderClass([unref(isDarkTheme) ? "lg:bg-[#171a21] lg:text-white lg:border lg:border-[#2a303a]" : "lg:bg-white lg:shadow-card", "hidden lg:flex lg:h-full lg:w-72 lg:flex-shrink-0 lg:flex-col lg:rounded-[32px] lg:p-6"])}"><div class="mb-2">`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "md",
        "show-name-from": "md",
        "text-class": unref(isDarkTheme) ? "text-white" : "text-sber-black"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/profile",
        class: ["mb-6 block rounded-[28px] p-4 transition-colors", unref(isDarkTheme) ? "bg-[#10141b] border border-[#2a303a] hover:bg-[#1b212b]" : "bg-sber-gray-light hover:bg-[#ececef]"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
          if (_push2) {
            _push2(`<p class="text-xs font-semibold uppercase tracking-wide text-sber-gray"${_scopeId}>\u041F\u0440\u043E\u0444\u0438\u043B\u044C</p><div class="mt-4 flex items-center gap-3"${_scopeId}><div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sber-green text-base font-bold text-white"${_scopeId}>`);
            if (!((_a = unref(authStore).user) == null ? void 0 : _a.avatar)) {
              _push2(`<span${_scopeId}>${ssrInterpolate(((_d = (_c = (_b = unref(authStore).user) == null ? void 0 : _b.name) == null ? void 0 : _c[0]) == null ? void 0 : _d.toUpperCase()) || "A")}</span>`);
            } else {
              _push2(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="h-full w-full object-cover"${_scopeId}>`);
            }
            _push2(`</div><div class="min-w-0"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><p class="truncate text-sm font-semibold text-sber-black"${_scopeId}>${ssrInterpolate(((_e = unref(authStore).user) == null ? void 0 : _e.name) || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C")}</p>`);
            if ((_f = unref(authStore).user) == null ? void 0 : _f.isPremium) {
              _push2(`<span class="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-700"${_scopeId}> Pro </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if ((_g = unref(authStore).user) == null ? void 0 : _g.email) {
              _push2(`<p class="truncate text-xs text-sber-gray"${_scopeId}>${ssrInterpolate(unref(authStore).user.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("p", { class: "text-xs font-semibold uppercase tracking-wide text-sber-gray" }, "\u041F\u0440\u043E\u0444\u0438\u043B\u044C"),
              createVNode("div", { class: "mt-4 flex items-center gap-3" }, [
                createVNode("div", { class: "flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sber-green text-base font-bold text-white" }, [
                  !((_h = unref(authStore).user) == null ? void 0 : _h.avatar) ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(((_k = (_j = (_i = unref(authStore).user) == null ? void 0 : _i.name) == null ? void 0 : _j[0]) == null ? void 0 : _k.toUpperCase()) || "A"), 1)) : (openBlock(), createBlock("img", {
                    key: 1,
                    src: unref(authStore).user.avatar,
                    class: "h-full w-full object-cover"
                  }, null, 8, ["src"]))
                ]),
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("p", { class: "truncate text-sm font-semibold text-sber-black" }, toDisplayString(((_l = unref(authStore).user) == null ? void 0 : _l.name) || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C"), 1),
                    ((_m = unref(authStore).user) == null ? void 0 : _m.isPremium) ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-700"
                    }, " Pro ")) : createCommentVNode("", true)
                  ]),
                  ((_n = unref(authStore).user) == null ? void 0 : _n.email) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "truncate text-xs text-sber-gray"
                  }, toDisplayString(unref(authStore).user.email), 1)) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#10141b] border border-[#222833]" : "bg-transparent", "flex flex-1 flex-col gap-2 rounded-[28px] p-2"])}"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.id,
          to: item.to,
          class: ["flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors", isActive(item.to) ? "bg-sber-green text-white shadow-sm" : unref(isDarkTheme) ? "text-slate-300 hover:bg-[#20242d] hover:text-white" : "text-sber-gray hover:bg-sber-gray-light hover:text-sber-black"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "h-5 w-5" }, null), _parent2, _scopeId);
              _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-5 w-5" })),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><button class="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sber-green px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-sber-green-dark">`);
      _push(ssrRenderComponent(unref(Plus), { class: "h-5 w-5" }, null, _parent));
      _push(` \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 </button></aside><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#0f1115] lg:border lg:border-[#2a303a]" : "bg-white lg:border lg:border-[#e9ebf1] lg:shadow-[0_20px_48px_rgba(15,23,42,0.10)]", "phone-frame relative flex-1 lg:h-[calc(100dvh-3rem)] lg:rounded-3xl"])}"><div class="min-h-dvh lg:h-full lg:min-h-0 lg:overflow-y-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      _push(ssrRenderComponent(_component_LayoutBottomNav, null, null, _parent));
      _push(`<button class="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-sber-green shadow-lg transition-transform active:scale-95 lg:hidden">`);
      _push(ssrRenderComponent(unref(Plus), { class: "h-7 w-7 text-white" }, null, _parent));
      _push(`</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=app-CUVJbdwo.mjs.map
