import { _ as _sfc_main$2 } from "./BrandLogo-CXrAYMmR.js";
import { _ as __nuxt_component_1 } from "./nuxt-link-WHGTxQvm.js";
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import dayjs from "dayjs";
import { CheckSquare, Calendar, Grid2x2, Timer, User, Settings, ChevronRight, HelpCircle, Share2, Plus } from "lucide-vue-next";
import { e as useRoute, c as useSettingsStore, u as useAuthStore, f as usePremiumStore } from "../server.mjs";
import "./logo-DVdZXLLs.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "axios";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const APP_NAV_CATALOG = [
  { id: "tasks", to: "/app", icon: CheckSquare, label: "Задачи" },
  { id: "calendar", to: "/app/calendar", icon: Calendar, label: "Календарь" },
  { id: "matrix", to: "/app/matrix", icon: Grid2x2, label: "Матрица" },
  { id: "pomodoro", to: "/app/pomodoro", icon: Timer, label: "Помодоро" },
  { id: "profile", to: "/app/profile", icon: User, label: "Профиль" },
  { id: "settings", to: "/app/settings", icon: Settings, label: "Настройки" }
];
function orderNavItems(order, options) {
  const byId = new Map(APP_NAV_CATALOG.map((item) => [item.id, item]));
  const includeProfile = options?.includeProfile !== false;
  const seen = /* @__PURE__ */ new Set();
  const items = [];
  for (const id of order) {
    const item = byId.get(id);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  if (includeProfile && !seen.has("profile")) {
    const profile = byId.get("profile");
    if (profile) {
      const settingsIdx = items.findIndex((i) => i.id === "settings");
      if (settingsIdx === -1) items.push(profile);
      else items.splice(settingsIdx, 0, profile);
      seen.add("profile");
    }
  }
  if (!seen.has("settings")) {
    const settings = byId.get("settings");
    if (settings) items.push(settings);
  }
  return items;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const settingsStore = useSettingsStore();
    const todayDate = dayjs().format("D");
    const navItems = computed(
      () => orderNavItems(settingsStore.appSettings.bottomNavItems || [], { includeProfile: false })
    );
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
    const settingsStore = useSettingsStore();
    const authStore = useAuthStore();
    const premiumStore = usePremiumStore();
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const sidebarNavItems = computed(
      () => orderNavItems(settingsStore.appSettings.bottomNavItems || [], { includeProfile: false })
    );
    function isActive(item) {
      if (item.id === "settings") {
        return route.path.startsWith("/app/settings");
      }
      if (item.id === "profile") {
        return route.path.startsWith("/app/profile");
      }
      if (item.to === "/app") {
        return route.path === "/app";
      }
      return route.path.startsWith(item.to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BrandLogo = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_LayoutBottomNav = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-dvh lg:px-3 lg:py-2", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="mx-auto flex min-h-dvh w-full max-w-none lg:h-[calc(100dvh-1rem)] lg:min-h-[calc(100dvh-1rem)] lg:gap-4"><aside class="${ssrRenderClass([unref(isDarkTheme) ? "lg:bg-[#171a21] lg:text-white lg:border lg:border-[#2a303a]" : "lg:bg-white lg:shadow-card", "hidden lg:flex lg:h-full lg:w-72 lg:flex-shrink-0 lg:flex-col lg:rounded-[32px] lg:p-6"])}"><div class="mb-2">`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "md",
        "show-name-from": "md",
        "text-class": unref(isDarkTheme) ? "text-white" : "text-sber-black"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/profile",
        class: ["mb-3 flex items-center gap-3 rounded-2xl p-3 transition-colors", [
          unref(route).path.startsWith("/app/profile") ? "bg-sber-green-light" : unref(isDarkTheme) ? "bg-[#10141b] border border-[#222833] hover:bg-[#20242d]" : "bg-sber-gray-light hover:bg-sber-gray-light/70"
        ]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([unref(premiumStore).isPremium ? "ring-2 ring-yellow-400 ring-offset-1" : "", "h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sber-green"])}"${_scopeId}>`);
            if (!unref(authStore).user?.avatar) {
              _push2(`<div class="flex h-full w-full items-center justify-center text-base font-bold text-white"${_scopeId}>${ssrInterpolate(unref(authStore).user?.name?.[0]?.toUpperCase() || "A")}</div>`);
            } else {
              _push2(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="h-full w-full object-cover" alt=""${_scopeId}>`);
            }
            _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="${ssrRenderClass([unref(isDarkTheme) ? "text-white" : "text-sber-black", "truncate text-sm font-semibold"])}"${_scopeId}>${ssrInterpolate(unref(authStore).user?.name || "Профиль")}</p><p class="${ssrRenderClass([unref(isDarkTheme) ? "text-slate-400" : "text-sber-gray", "truncate text-xs"])}"${_scopeId}>${ssrInterpolate(unref(premiumStore).isPremium ? "⭐ Премиум" : "Профиль")}</p></div>`);
            _push2(ssrRenderComponent(unref(ChevronRight), {
              class: ["h-4 w-4 shrink-0", unref(isDarkTheme) ? "text-slate-400" : "text-sber-gray-mid"]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                class: ["h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sber-green", unref(premiumStore).isPremium ? "ring-2 ring-yellow-400 ring-offset-1" : ""]
              }, [
                !unref(authStore).user?.avatar ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex h-full w-full items-center justify-center text-base font-bold text-white"
                }, toDisplayString(unref(authStore).user?.name?.[0]?.toUpperCase() || "A"), 1)) : (openBlock(), createBlock("img", {
                  key: 1,
                  src: unref(authStore).user.avatar,
                  class: "h-full w-full object-cover",
                  alt: ""
                }, null, 8, ["src"]))
              ], 2),
              createVNode("div", { class: "min-w-0 flex-1" }, [
                createVNode("p", {
                  class: ["truncate text-sm font-semibold", unref(isDarkTheme) ? "text-white" : "text-sber-black"]
                }, toDisplayString(unref(authStore).user?.name || "Профиль"), 3),
                createVNode("p", {
                  class: ["truncate text-xs", unref(isDarkTheme) ? "text-slate-400" : "text-sber-gray"]
                }, toDisplayString(unref(premiumStore).isPremium ? "⭐ Премиум" : "Профиль"), 3)
              ]),
              createVNode(unref(ChevronRight), {
                class: ["h-4 w-4 shrink-0", unref(isDarkTheme) ? "text-slate-400" : "text-sber-gray-mid"]
              }, null, 8, ["class"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#10141b] border border-[#222833]" : "bg-transparent", "flex flex-1 flex-col gap-2 rounded-[28px] p-2"])}"><!--[-->`);
      ssrRenderList(unref(sidebarNavItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.id,
          to: item.to,
          class: ["flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors", isActive(item) ? "bg-sber-green text-white shadow-sm" : unref(isDarkTheme) ? "text-slate-300 hover:bg-[#20242d] hover:text-white" : "text-sber-gray hover:bg-sber-gray-light hover:text-sber-black"]
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
      _push(`<!--]--></nav><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#10141b] border border-[#222833]" : "bg-sber-gray-light", "mt-4 space-y-1 rounded-[20px] p-2"])}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/app/faq",
        class: ["flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", unref(route).path === "/app/faq" ? "bg-sber-green text-white" : unref(isDarkTheme) ? "text-slate-300 hover:bg-[#20242d]" : "text-sber-gray hover:bg-white"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(HelpCircle), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>FAQ</span>`);
          } else {
            return [
              createVNode(unref(HelpCircle), { class: "h-4 w-4" }),
              createVNode("span", null, "FAQ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "text-slate-300 hover:bg-[#20242d]" : "text-sber-gray hover:bg-white", "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"])}">`);
      _push(ssrRenderComponent(unref(Share2), { class: "h-4 w-4" }, null, _parent));
      _push(`<span>Рекомендовать друзьям</span></button></div><button class="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sber-green px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-sber-green-dark">`);
      _push(ssrRenderComponent(unref(Plus), { class: "h-5 w-5" }, null, _parent));
      _push(` Новая задача </button></aside><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#0f1115] lg:border lg:border-[#2a303a]" : "bg-white lg:border lg:border-[#e9ebf1] lg:shadow-[0_20px_48px_rgba(15,23,42,0.10)]", "phone-frame relative flex-1 lg:h-[calc(100dvh-1rem)] lg:rounded-3xl"])}"><div class="min-h-dvh lg:h-full lg:min-h-0 lg:overflow-y-auto">`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=app-RJT_2ap4.js.map
