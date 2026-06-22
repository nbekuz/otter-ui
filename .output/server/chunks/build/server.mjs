import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { toRef, isRef, hasInjectionContext, inject, getCurrentInstance, watch, ref, reactive, effectScope, isReactive, toRaw, unref, getCurrentScope, onScopeDispose, nextTick, toRefs, markRaw, computed, defineComponent, createElementBlock, shallowRef, provide, cloneVNode, h, useSSRContext, defineAsyncComponent, shallowReactive, Suspense, Fragment, createApp, mergeProps, withCtx, createVNode, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, onMounted, readonly, isReadonly, isShallow } from 'vue';
import { i as hasProtocol, k as isScriptProtocol, f as joinURL, p as parseURL, l as encodePath, m as decodePath, w as withQuery, s as sanitizeStatusCode, n as getContext, $ as $fetch, o as defu, q as createHooks, c as createError$1, r as executeAsync } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { ssrRenderTeleport, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { CheckCircle } from 'lucide-vue-next';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const matcher = /* @__PURE__ */ (() => {
  const $0 = {};
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/");
    s.length;
    r.unshift({ data: $0, params: { "_": s.slice(1).join("/") } });
    return r;
  };
})();
const _routeRulesMatcher = (path) => defu({}, ...matcher("", path).map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta$8 = { layout: "app" };
const __nuxt_page_meta$7 = { layout: "app" };
const __nuxt_page_meta$6 = { layout: "app" };
const __nuxt_page_meta$5 = { layout: "app" };
const __nuxt_page_meta$4 = { layout: "app" };
const __nuxt_page_meta$3 = { layout: "app" };
const __nuxt_page_meta$2 = { layout: "app" };
const __nuxt_page_meta$1 = { layout: "app" };
const __nuxt_page_meta = { layout: "app" };
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-9JN4VxW2.mjs')
  },
  {
    name: "login",
    path: "/login",
    component: () => import('./login-DiD7Gm6i.mjs')
  },
  {
    name: "matrix",
    path: "/matrix",
    component: () => import('./matrix-BDWLK3dr.mjs')
  },
  {
    name: "app-faq",
    path: "/app/faq",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./faq-PbXGyqJt.mjs')
  },
  {
    name: "calendar",
    path: "/calendar",
    component: () => import('./calendar-DSzma8iE.mjs')
  },
  {
    name: "pomodoro",
    path: "/pomodoro",
    component: () => import('./pomodoro-Cnvr7ZvG.mjs')
  },
  {
    name: "register",
    path: "/register",
    component: () => import('./register-Cl1EZUcP.mjs')
  },
  {
    name: "settings",
    path: "/settings",
    component: () => import('./settings-Bby5Ah3C.mjs')
  },
  {
    name: "app",
    path: "/app",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./index-DS192vMf.mjs')
  },
  {
    name: "app-legal",
    path: "/app/legal",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./legal-NFsr82Jk.mjs')
  },
  {
    name: "app-matrix",
    path: "/app/matrix",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./matrix-Cbmr3ZYC.mjs')
  },
  {
    name: "app-profile",
    path: "/app/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-Bydr__Bb.mjs')
  },
  {
    name: "app-calendar",
    path: "/app/calendar",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./calendar-DqERtExy.mjs')
  },
  {
    name: "app-new-task",
    path: "/app/new-task",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./new-task-Dk3n6wqr.mjs')
  },
  {
    name: "app-pomodoro",
    path: "/app/pomodoro",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./pomodoro-Bx92tIB5.mjs')
  },
  {
    name: "app-settings",
    path: "/app/settings",
    meta: __nuxt_page_meta || {},
    component: () => import('./settings-S0XLaLly.mjs')
  },
  {
    name: "legal-slug",
    path: "/legal/:slug()",
    component: () => import('./_slug_-D1a9ZTtC.mjs')
  },
  {
    name: "profile-fill",
    path: "/profile-fill",
    component: () => import('./profile-fill-BL2Fk0Ls.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps) {
  const _props = [];
  for (const prop of routeProps) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = /* @__PURE__ */ Symbol();
const ACTION_NAME = /* @__PURE__ */ Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (true)) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (true)) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = /* @__PURE__ */ Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop$1
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke2) => {
  return invoke2();
};
function pausableFilter(extendFilter = bypassFilter) {
  const isActive = ref(true);
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args);
  };
  return { isActive: readonly(isActive), pause, resume, eventFilter };
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
function watchWithFilter(source, cb, options = {}) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options;
  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb
    ),
    watchOptions
  );
}
function watchPausable(source, cb, options = {}) {
  const {
    eventFilter: filter,
    ...watchOptions
  } = options;
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter
    }
  );
  return { stop, pause, resume, isActive };
}
function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    onMounted(fn, target);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = void 0;
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events2))
    events2 = [events2];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return noop;
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
const handlers = /* @__PURE__ */ getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v))
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
};
const customStorageEventName = "vueuse-storage";
function useStorage(key, defaults2, storage, options = {}) {
  var _a;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted
  } = options;
  const data = (shallow ? shallowRef : ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  if (!storage)
    return data;
  const rawInit = toValue(defaults2);
  const type = guessSerializerType(rawInit);
  const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    () => write(data.value),
    { flush, deep, eventFilter }
  );
  if (window2 && listenToStorageChanges) {
    tryOnMounted(() => {
      useEventListener(window2, "storage", update);
      useEventListener(window2, customStorageEventName, updateFromCustomEvent);
      if (initOnMounted)
        update();
    });
  }
  if (!initOnMounted)
    update();
  function dispatchWriteEvent(oldValue, newValue) {
    if (window2) {
      window2.dispatchEvent(new CustomEvent(customStorageEventName, {
        detail: {
          key,
          oldValue,
          newValue,
          storageArea: storage
        }
      }));
    }
  }
  function write(v) {
    try {
      const oldValue = storage.getItem(key);
      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage.removeItem(key);
      } else {
        const serialized = serializer.write(v);
        if (oldValue !== serialized) {
          storage.setItem(key, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(key);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function")
        return mergeDefaults(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return { ...rawInit, ...value };
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function update(event) {
    if (event && event.storageArea !== storage)
      return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== key)
      return;
    pauseWatch();
    try {
      if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      if (event)
        nextTick(resumeWatch);
      else
        resumeWatch();
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  return data;
}
function useLocalStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(key, initialValue, window2 == null ? void 0 : window2.localStorage, options);
}
function getAccessToken() {
  return null;
}
function getRefreshToken() {
  return null;
}
const DEFAULT_API_BASE_URL = "https://admin.skkamni.ru/api/v1/";
function resolveApiBaseUrl() {
  const fromEnv = process.env.NUXT_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  return DEFAULT_API_BASE_URL;
}
const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl();
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});
let refreshPromise = null;
async function refreshAccessToken() {
  return null;
}
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    if (status === 401 && originalRequest && !originalRequest._retry && !String(originalRequest.url || "").includes("auth/token/refresh/") && !String(originalRequest.url || "").includes("auth/login/") && !String(originalRequest.url || "").includes("auth/register/")) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const access = await refreshPromise;
        if (access) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
      }
    }
    const requestUrl = String(originalRequest?.url || "");
    requestUrl.includes("auth/forgot-password") || requestUrl.includes("auth/login/") || requestUrl.includes("auth/register/");
    return Promise.reject(error);
  }
);
function getApiErrorMessage(error, fallback = "Ошибка запроса") {
  const err = error;
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data.detail === "string") return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstVal = firstKey ? data[firstKey] : null;
  if (Array.isArray(firstVal) && typeof firstVal[0] === "string") return firstVal[0];
  if (typeof firstVal === "string") return firstVal;
  return fallback;
}
async function apiGet(url, config) {
  const response = await api.get(url, config);
  return response.data;
}
async function apiPost(url, data, config) {
  const response = await api.post(url, data, config);
  return response.data;
}
async function apiPut(url, data, config) {
  const response = await api.put(url, data, config);
  return response.data;
}
async function apiPatch(url, data, config) {
  const response = await api.patch(url, data, config);
  return response.data;
}
async function apiDelete(url, config) {
  const response = await api.delete(url, config);
  return response.data;
}
function resolveMediaUrl(url) {
  if (!url) return void 0;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  let apiBase = "https://admin.skkamni.ru/api/v1/";
  {
    const fromEnv = process.env.NUXT_PUBLIC_API_BASE_URL;
    if (fromEnv) apiBase = fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
}
function parseApiWallClock(iso) {
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  if (match) {
    return { date: match[1], time: `${match[2]}:${match[3]}` };
  }
  return null;
}
function parseTimeToMinutes(time) {
  const [h2, m] = time.split(":").map((v) => parseInt(v, 10));
  const hours = Number.isFinite(h2) ? h2 : 0;
  const minutes = Number.isFinite(m) ? m : 0;
  return hours * 60 + minutes;
}
function formatMinutesToTime(totalMinutes) {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function addMinutesToTime(time, deltaMinutes) {
  return formatMinutesToTime(parseTimeToMinutes(time) + deltaMinutes);
}
function getTaskScheduleStart(task) {
  return task.duration?.start || task.dueTime;
}
function getTaskDurationMinutes(task) {
  if (task.duration?.start && task.duration?.end) {
    const start = parseTimeToMinutes(task.duration.start);
    const end = parseTimeToMinutes(task.duration.end);
    if (end > start) return end - start;
    if (end < start) return 24 * 60 - start + end;
  }
  return 60;
}
const MATRIX_TO_UI = {
  urgent_important: "urgent-important",
  not_urgent_important: "not-urgent-important",
  urgent_not_important: "urgent-not-important",
  not_urgent_not_important: "not-urgent-not-important"
};
const MATRIX_TO_API = {
  "urgent-important": "urgent_important",
  "not-urgent-important": "not_urgent_important",
  "urgent-not-important": "urgent_not_important",
  "not-urgent-not-important": "not_urgent_not_important"
};
const REPEAT_TO_UI = {
  none: "none",
  day: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly"
};
const REPEAT_TO_API = {
  none: "none",
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
  custom: "week"
};
function apiPriorityToUi(priority) {
  if (priority === "critical") return "high";
  if (priority === "low" || priority === "medium" || priority === "high") return priority;
  return "medium";
}
function uiPriorityToApi(priority) {
  if (priority === "none") return "medium";
  if (priority === "high") return "high";
  if (priority === "low") return "low";
  return "medium";
}
function reminderMinutes(dueAt, reminderAt) {
  if (!dueAt || !reminderAt) return void 0;
  const diff = dayjs(dueAt).diff(dayjs(reminderAt), "minute");
  if (diff < 0) return void 0;
  return String(diff);
}
function toApiDateTime(dueDate, time) {
  const hhmm = time.length >= 5 ? time.slice(0, 5) : time;
  return `${dueDate}T${hhmm}:00.000`;
}
function buildDueAt(dueDate, dueTime) {
  if (!dueDate) return null;
  return toApiDateTime(dueDate, dueTime || "00:00");
}
function buildReminderAt(dueAt, notification) {
  if (!dueAt || !notification) return null;
  const minutes = Number(notification);
  if (!Number.isFinite(minutes) || minutes < 0) return null;
  return dayjs(dueAt).subtract(minutes, "minute").format("YYYY-MM-DDTHH:mm:ss.SSS");
}
function buildStartEnd(dueDate, duration) {
  if (!dueDate || !duration?.start || !duration?.end) {
    return { start_at: null, end_at: null };
  }
  if (parseTimeToMinutes(duration.end) <= parseTimeToMinutes(duration.start)) {
    return { start_at: null, end_at: null };
  }
  return {
    start_at: toApiDateTime(dueDate, duration.start),
    end_at: toApiDateTime(dueDate, duration.end)
  };
}
function apiTaskToUi(task) {
  const dueFields = task.due_at ? parseApiWallClock(task.due_at) : null;
  const startFields = task.start_at ? parseApiWallClock(task.start_at) : null;
  const endFields = task.end_at ? parseApiWallClock(task.end_at) : null;
  const scheduleDay = startFields ?? dueFields;
  return {
    id: String(task.id),
    title: task.title,
    description: task.description || void 0,
    dueDate: scheduleDay?.date,
    dueTime: dueFields && dueFields.time !== "00:00" ? dueFields.time : void 0,
    duration: startFields && endFields ? { start: startFields.time, end: endFields.time } : void 0,
    priority: apiPriorityToUi(task.priority),
    completed: task.is_completed,
    completedAt: task.completed_at ? dayjs(task.completed_at).format("YYYY-MM-DD") : void 0,
    notification: reminderMinutes(task.due_at, task.reminder_at),
    repeat: REPEAT_TO_UI[task.repeat_unit] || "none",
    repeatCustom: task.repeat_unit !== "none" && task.repeat_interval > 1 ? { interval: task.repeat_interval, unit: "week" } : void 0,
    imageUrl: task.image || void 0,
    matrixBlock: MATRIX_TO_UI[task.matrix_block],
    createdAt: task.created_at
  };
}
function uiTaskToApiPayload(task) {
  const due_at = buildDueAt(task.dueDate, task.dueTime);
  const { start_at, end_at } = buildStartEnd(task.dueDate, task.duration);
  const payload = {
    title: task.title,
    description: task.description ?? null,
    due_at,
    start_at,
    end_at,
    reminder_at: buildReminderAt(due_at, task.notification),
    repeat_unit: REPEAT_TO_API[task.repeat || "none"],
    repeat_interval: task.repeatCustom?.interval ?? 1,
    priority: uiPriorityToApi(task.priority || "none"),
    matrix_block: MATRIX_TO_API[task.matrixBlock || "not-urgent-not-important"]
  };
  if (task.completed !== void 0) {
    payload.is_completed = task.completed;
  }
  return payload;
}
function groupKeyToUi(key) {
  if (key === "no_deadline") return "nodate";
  return key;
}
function apiMatrixBlockToUi(block) {
  return MATRIX_TO_UI[block];
}
const GROUP_ORDER = ["overdue", "today", "tomorrow", "later", "nodate", "completed"];
function flattenGroups(groups) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const group of groups) {
    for (const task of group.tasks) {
      if (seen.has(task.id)) continue;
      seen.add(task.id);
      result.push(apiTaskToUi(task));
    }
  }
  return result;
}
function normalizeDueDate(dueDate) {
  if (!dueDate) return "";
  const parsed = dayjs(dueDate);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}
function groupTasksByKey(allTasks) {
  const today2 = dayjs().format("YYYY-MM-DD");
  const tomorrow2 = dayjs().add(1, "day").format("YYYY-MM-DD");
  return {
    overdue: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate);
      return !t.completed && !!d && dayjs(d).isBefore(today2, "day");
    }),
    today: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate);
      return !t.completed && d === today2;
    }),
    tomorrow: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate);
      return !t.completed && d === tomorrow2;
    }),
    later: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate);
      return !t.completed && !!d && dayjs(d).isAfter(tomorrow2, "day");
    }),
    nodate: allTasks.filter((t) => !t.completed && !normalizeDueDate(t.dueDate)),
    completed: allTasks.filter((t) => t.completed)
  };
}
const useTasksStore = /* @__PURE__ */ defineStore("tasks", () => {
  const tasks = ref([]);
  const groupedFromApi = ref({
    overdue: [],
    today: [],
    tomorrow: [],
    later: [],
    nodate: [],
    completed: []
  });
  const matrixTasksByBlock = ref({});
  const calendarTasks = ref([]);
  const calendarCacheKey = ref("");
  const loading = ref(false);
  const error = ref("");
  const initialized = ref(false);
  const today2 = computed(() => dayjs().format("YYYY-MM-DD"));
  const tomorrow2 = computed(() => dayjs().add(1, "day").format("YYYY-MM-DD"));
  const overdueTasks = computed(() => groupedFromApi.value.overdue);
  const todayTasks = computed(() => groupedFromApi.value.today);
  const tomorrowTasks = computed(() => groupedFromApi.value.tomorrow);
  const laterTasks = computed(() => groupedFromApi.value.later);
  const noDateTasks = computed(() => groupedFromApi.value.nodate);
  const completedTasks = computed(() => groupedFromApi.value.completed);
  function applyGrouped(groups) {
    const next = {
      overdue: [],
      today: [],
      tomorrow: [],
      later: [],
      nodate: [],
      completed: []
    };
    for (const group of groups) {
      const uiKey = groupKeyToUi(group.key);
      if (uiKey in next) {
        next[uiKey] = group.tasks.map(apiTaskToUi);
      }
    }
    tasks.value = flattenGroups(groups);
    groupedFromApi.value = groupTasksByKey(tasks.value);
  }
  function findTaskById(id) {
    return tasks.value.find((t) => t.id === id) ?? calendarTasks.value.find((t) => t.id === id);
  }
  function taskScheduleKey(task) {
    return [
      task.dueDate,
      task.dueTime,
      task.duration?.start,
      task.duration?.end,
      task.completed,
      task.title,
      task.priority,
      task.matrixBlock
    ].join("|");
  }
  function mergeTaskFields(existing, updates, id) {
    return {
      ...existing || {
        id,
        title: "",
        priority: "medium",
        completed: false,
        repeat: "none",
        createdAt: ""
      },
      ...updates,
      id,
      duration: updates.duration ?? existing?.duration,
      dueTime: updates.dueTime ?? existing?.dueTime,
      dueDate: updates.dueDate ?? existing?.dueDate
    };
  }
  function mergeTaskFromApi(existing, updates, fromApi) {
    return {
      ...existing,
      ...fromApi,
      ...updates,
      id: fromApi.id,
      duration: fromApi.duration ?? updates.duration ?? existing?.duration,
      dueTime: fromApi.dueTime ?? updates.dueTime ?? existing?.dueTime,
      dueDate: fromApi.dueDate ?? updates.dueDate ?? existing?.dueDate
    };
  }
  function applyTaskToMatrixState(updated) {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return;
    const next = {};
    for (const [blockId, list] of Object.entries(matrixTasksByBlock.value)) {
      next[blockId] = list.filter((t) => t.id !== updated.id);
    }
    if (!updated.completed && updated.matrixBlock) {
      const blockId = updated.matrixBlock;
      next[blockId] = [updated, ...next[blockId] || []];
    }
    matrixTasksByBlock.value = next;
  }
  function removeTaskFromMatrixState(id) {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return;
    const next = {};
    for (const [blockId, list] of Object.entries(matrixTasksByBlock.value)) {
      next[blockId] = list.filter((t) => t.id !== id);
    }
    matrixTasksByBlock.value = next;
  }
  function upsertTaskInState(updated) {
    const idx = tasks.value.findIndex((t) => t.id === updated.id);
    if (idx === -1) {
      tasks.value.unshift(updated);
    } else {
      tasks.value[idx] = updated;
    }
    groupedFromApi.value = groupTasksByKey(tasks.value);
    const calIdx = calendarTasks.value.findIndex((t) => t.id === updated.id);
    if (calIdx !== -1) {
      calendarTasks.value[calIdx] = updated;
    }
    applyTaskToMatrixState(updated);
  }
  async function refreshCalendarIfCached() {
    const key = calendarCacheKey.value;
    if (!key) return;
    const colon = key.indexOf(":");
    if (colon === -1) return;
    const view = key.slice(0, colon);
    const date = key.slice(colon + 1);
    if (!date) return;
    await fetchCalendar(view, date);
  }
  function refreshMatrixIfCached() {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return void 0;
    return fetchMatrix();
  }
  async function refreshTaskLists(options = {}) {
    const { grouped = true, calendar = true, matrix = true } = options;
    const jobs = [];
    if (grouped) jobs.push(fetchGrouped());
    if (calendar) jobs.push(refreshCalendarIfCached());
    if (matrix) {
      const matrixJob = refreshMatrixIfCached();
      if (matrixJob) jobs.push(matrixJob);
    }
    if (jobs.length === 0) return;
    await Promise.all(jobs);
  }
  function removeTaskFromState(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    calendarTasks.value = calendarTasks.value.filter((t) => t.id !== id);
    groupedFromApi.value = groupTasksByKey(tasks.value);
    removeTaskFromMatrixState(id);
  }
  async function fetchGrouped() {
    loading.value = true;
    error.value = "";
    try {
      const groups = await apiGet("tasks/grouped/");
      applyGrouped(groups);
      initialized.value = true;
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchMatrix() {
    const blocks = await apiGet("matrix/");
    const prevById = /* @__PURE__ */ new Map();
    for (const list of Object.values(matrixTasksByBlock.value)) {
      for (const task of list) prevById.set(task.id, task);
    }
    const next = {};
    for (const block of blocks) {
      next[apiMatrixBlockToUi(block.block)] = block.tasks.map((apiTask) => {
        const task = apiTaskToUi(apiTask);
        const prev = prevById.get(task.id);
        return prev && taskScheduleKey(prev) === taskScheduleKey(task) ? prev : task;
      });
    }
    matrixTasksByBlock.value = next;
    return next;
  }
  async function fetchCalendar(view, date) {
    const response = await apiGet("calendar/", { params: { view, date } });
    const incoming = response.tasks.map(apiTaskToUi);
    calendarCacheKey.value = `${view}:${date}`;
    if (calendarTasks.value.length === 0) {
      calendarTasks.value = incoming;
      return calendarTasks.value;
    }
    const prevById = new Map(calendarTasks.value.map((task) => [task.id, task]));
    calendarTasks.value = incoming.map((task) => {
      const prev = prevById.get(task.id);
      if (prev && taskScheduleKey(prev) === taskScheduleKey(task)) {
        return prev;
      }
      return task;
    });
    return calendarTasks.value;
  }
  function parseCalendarCacheKey() {
    const colon = calendarCacheKey.value.indexOf(":");
    if (colon === -1) return null;
    return {
      view: calendarCacheKey.value.slice(0, colon),
      date: calendarCacheKey.value.slice(colon + 1)
    };
  }
  function taskScheduleDate(task) {
    return task.dueDate;
  }
  function getTasksForDate(date) {
    const cache = parseCalendarCacheKey();
    if (cache?.view === "day" && cache.date === date) {
      return calendarTasks.value.slice();
    }
    return tasks.value.filter((t) => taskScheduleDate(t) === date);
  }
  function getTasksForWeek(startDate, endDate) {
    const cache = parseCalendarCacheKey();
    if (cache?.view === "week") {
      const weekStart = dayjs(cache.date).startOf("week").format("YYYY-MM-DD");
      const weekEnd = dayjs(cache.date).endOf("week").format("YYYY-MM-DD");
      if (!dayjs(startDate).isAfter(weekEnd, "day") && !dayjs(endDate).isBefore(weekStart, "day")) {
        return calendarTasks.value.filter((t) => {
          const d = taskScheduleDate(t);
          return !!d && !dayjs(d).isBefore(startDate, "day") && !dayjs(d).isAfter(endDate, "day");
        });
      }
    }
    return tasks.value.filter(
      (t) => taskScheduleDate(t) && !dayjs(taskScheduleDate(t)).isBefore(startDate, "day") && !dayjs(taskScheduleDate(t)).isAfter(endDate, "day")
    );
  }
  function getTasksForMatrix(blockId) {
    if (matrixTasksByBlock.value[blockId]?.length) {
      return matrixTasksByBlock.value[blockId];
    }
    return tasks.value.filter((t) => !t.completed && t.matrixBlock === blockId);
  }
  async function addTask(taskData) {
    const payload = uiTaskToApiPayload(taskData);
    const created = await apiPost("tasks/", payload);
    const task = apiTaskToUi(created);
    upsertTaskInState(task);
    await refreshTaskLists();
    return task;
  }
  async function updateTask(id, updates, refresh = {}) {
    const existing = findTaskById(id);
    const optimistic = mergeTaskFields(existing, updates, id);
    upsertTaskInState(optimistic);
    const merged = { ...existing, ...updates };
    const payload = uiTaskToApiPayload(merged);
    const updated = await apiPatch(`tasks/${id}/`, payload);
    const task = mergeTaskFromApi(existing, updates, apiTaskToUi(updated));
    upsertTaskInState(task);
    await refreshTaskLists(refresh);
    return task;
  }
  async function deleteTask(id, refresh = {}) {
    removeTaskFromState(id);
    await apiDelete(`tasks/${id}/`);
    await refreshTaskLists(refresh);
  }
  async function completeTask(id, refresh = {}) {
    const existing = findTaskById(id);
    if (!existing) return;
    upsertTaskInState({
      ...existing,
      completed: !existing.completed,
      completedAt: !existing.completed ? dayjs().format("YYYY-MM-DD") : void 0
    });
    const endpoint = existing.completed ? "uncomplete" : "complete";
    const updated = await apiPost(`tasks/${id}/${endpoint}/`);
    const task = apiTaskToUi(updated);
    upsertTaskInState(task);
    await refreshTaskLists(refresh);
    return task;
  }
  async function moveToMatrix(taskId, blockId) {
    const existing = findTaskById(taskId);
    const uiBlock = blockId;
    if (existing) {
      upsertTaskInState({ ...existing, matrixBlock: uiBlock });
    }
    const matrix_block = blockId.replace(/-/g, "_");
    const updated = await apiPatch(`tasks/${taskId}/`, { matrix_block });
    const task = apiTaskToUi(updated);
    upsertTaskInState(task);
    await refreshTaskLists({ grouped: false, calendar: false, matrix: true });
    return task;
  }
  async function fetchTask(id) {
    const task = await apiGet(`tasks/${id}/`);
    const ui = apiTaskToUi(task);
    upsertTaskInState(ui);
    return ui;
  }
  async function searchTasks(query) {
    if (!query.trim()) return [];
    const response = await apiGet("tasks/", {
      params: { search: query.trim(), limit: 50 }
    });
    return (response.results || []).map(apiTaskToUi);
  }
  function reset() {
    tasks.value = [];
    groupedFromApi.value = GROUP_ORDER.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    matrixTasksByBlock.value = {};
    calendarTasks.value = [];
    calendarCacheKey.value = "";
    initialized.value = false;
    error.value = "";
  }
  return {
    tasks,
    groupedFromApi,
    matrixTasksByBlock,
    calendarTasks,
    calendarCacheKey,
    loading,
    error,
    initialized,
    today: today2,
    tomorrow: tomorrow2,
    overdueTasks,
    todayTasks,
    tomorrowTasks,
    laterTasks,
    noDateTasks,
    completedTasks,
    fetchGrouped,
    fetchMatrix,
    fetchCalendar,
    refreshCalendarIfCached,
    refreshTaskLists,
    getTasksForDate,
    getTasksForWeek,
    getTasksForMatrix,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveToMatrix,
    fetchTask,
    searchTasks,
    reset
  };
});
const today = dayjs().format("YYYY-MM-DD");
const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
const twoDaysAgo = dayjs().subtract(3, "day").format("YYYY-MM-DD");
const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
const in3Days = dayjs().add(3, "day").format("YYYY-MM-DD");
const in7Days = dayjs().add(7, "day").format("YYYY-MM-DD");
[
  // Overdue
  {
    id: "t1",
    title: "Отправить отчёт за прошлый месяц",
    description: "Нужно подготовить и отправить финансовый отчёт руководству",
    dueDate: twoDaysAgo,
    dueTime: "10:00",
    priority: "high",
    completed: false,
    repeat: "none",
    notification: "30",
    createdAt: dayjs().subtract(7, "day").toISOString(),
    matrixBlock: "urgent-important"
  },
  {
    id: "t2",
    title: "Позвонить в банк по вопросу карты",
    dueDate: yesterday,
    dueTime: "14:00",
    priority: "medium",
    completed: false,
    repeat: "none",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    matrixBlock: "urgent-not-important"
  },
  // Today
  {
    id: "t3",
    title: "Встреча с командой разработки",
    description: "Еженедельный стендап, обсудить спринт",
    dueDate: today,
    dueTime: "10:00",
    duration: { start: "10:00", end: "11:00" },
    priority: "high",
    completed: false,
    repeat: "weekly",
    notification: "15",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    matrixBlock: "urgent-important"
  },
  {
    id: "t4",
    title: "Сходить в спортзал",
    dueDate: today,
    dueTime: "19:00",
    duration: { start: "19:00", end: "20:30" },
    priority: "medium",
    completed: false,
    repeat: "daily",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    matrixBlock: "not-urgent-important"
  },
  {
    id: "t5",
    title: "Купить продукты",
    dueDate: today,
    dueTime: "18:00",
    priority: "low",
    completed: false,
    repeat: "none",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    matrixBlock: "urgent-not-important"
  },
  {
    id: "t6",
    title: "Прочитать 30 страниц книги",
    dueDate: today,
    dueTime: "21:00",
    priority: "medium",
    completed: false,
    repeat: "daily",
    createdAt: dayjs().subtract(10, "day").toISOString(),
    matrixBlock: "not-urgent-important"
  },
  // Tomorrow
  {
    id: "t7",
    title: "Презентация нового проекта",
    description: "Подготовить слайды и тезисы выступления",
    dueDate: tomorrow,
    dueTime: "09:30",
    duration: { start: "09:30", end: "11:00" },
    priority: "high",
    completed: false,
    repeat: "none",
    notification: "60",
    createdAt: dayjs().subtract(3, "day").toISOString(),
    matrixBlock: "urgent-important"
  },
  {
    id: "t8",
    title: "Оплатить коммунальные услуги",
    dueDate: tomorrow,
    dueTime: "12:00",
    priority: "medium",
    completed: false,
    repeat: "monthly",
    createdAt: dayjs().toISOString(),
    matrixBlock: "urgent-not-important"
  },
  // Later
  {
    id: "t9",
    title: "Записаться на курс по Python",
    dueDate: in3Days,
    priority: "medium",
    completed: false,
    repeat: "none",
    createdAt: dayjs().toISOString(),
    matrixBlock: "not-urgent-important"
  },
  {
    id: "t10",
    title: "Сделать резервную копию файлов",
    dueDate: in7Days,
    priority: "low",
    completed: false,
    repeat: "none",
    createdAt: dayjs().toISOString(),
    matrixBlock: "not-urgent-not-important"
  },
  {
    id: "t11",
    title: "Обновить резюме",
    dueDate: in7Days,
    priority: "medium",
    completed: false,
    repeat: "none",
    createdAt: dayjs().toISOString(),
    matrixBlock: "not-urgent-important"
  },
  // No date
  {
    id: "t12",
    title: "Посмотреть документальный фильм о природе",
    priority: "none",
    completed: false,
    repeat: "none",
    createdAt: dayjs().toISOString(),
    matrixBlock: "not-urgent-not-important"
  },
  {
    id: "t13",
    title: "Выучить 10 новых слов на английском",
    priority: "low",
    completed: false,
    repeat: "none",
    createdAt: dayjs().toISOString(),
    matrixBlock: "not-urgent-important"
  },
  {
    id: "t14",
    title: "Разобрать гардероб",
    priority: "none",
    completed: false,
    repeat: "none",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    matrixBlock: "not-urgent-not-important"
  },
  // Completed
  {
    id: "t15",
    title: "Написать план на неделю",
    dueDate: yesterday,
    priority: "high",
    completed: true,
    completedAt: yesterday,
    repeat: "weekly",
    createdAt: dayjs().subtract(8, "day").toISOString()
  },
  {
    id: "t16",
    title: "Позвонить маме",
    dueDate: yesterday,
    priority: "medium",
    completed: true,
    completedAt: yesterday,
    repeat: "none",
    createdAt: dayjs().subtract(2, "day").toISOString()
  },
  {
    id: "t17",
    title: "Проверить email",
    dueDate: today,
    dueTime: "09:00",
    priority: "low",
    completed: true,
    completedAt: today,
    repeat: "daily",
    createdAt: dayjs().subtract(15, "day").toISOString()
  }
];
const defaultPomodoroSettings = {
  duration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLong: 4,
  sound: "bell",
  workingSound: "rain",
  showOnLockScreen: true
};
const defaultAppSettings = {
  language: "ru",
  theme: "light",
  visibleGroups: ["overdue", "today", "tomorrow", "later", "nodate", "completed"],
  notifications: true,
  vibration: true,
  notificationSound: "chime",
  completionSound: "success",
  bottomNavItems: ["tasks", "calendar", "matrix", "pomodoro", "settings"]
};
const matrixBlockDefaults = {
  "urgent-important": {
    id: "urgent-important",
    title: "Срочно и важно",
    color: "#FF3B30",
    bgColor: "#FFF0EF",
    description: "Сделать немедленно",
    dateFilter: ["overdue", "today"],
    priorityFilter: ["high"]
  },
  "not-urgent-important": {
    id: "not-urgent-important",
    title: "Не срочно, но важно",
    color: "#007AFF",
    bgColor: "#EFF5FF",
    description: "Запланировать",
    dateFilter: ["tomorrow", "later"],
    priorityFilter: ["high", "medium"]
  },
  "urgent-not-important": {
    id: "urgent-not-important",
    title: "Срочно, не важно",
    color: "#FF9500",
    bgColor: "#FFF8EF",
    description: "Делегировать",
    dateFilter: ["overdue", "today", "tomorrow"],
    priorityFilter: ["medium", "low"]
  },
  "not-urgent-not-important": {
    id: "not-urgent-not-important",
    title: "Не срочно, не важно",
    color: "#8E8E93",
    bgColor: "#F5F5F5",
    description: "Устранить",
    dateFilter: ["later", "nodate"],
    priorityFilter: ["low", "none"]
  }
};
const soundOptions = [
  { id: "bell", name: "Колокольчик", icon: "🔔" },
  { id: "chime", name: "Перезвон", icon: "🎵" },
  { id: "success", name: "Успех", icon: "✅" },
  { id: "ding", name: "Динь", icon: "🔊" },
  { id: "soft", name: "Мягкий", icon: "🎶" },
  { id: "none", name: "Без звука", icon: "🔇" }
];
function normalizeBottomNavItems(items) {
  const withoutSettings = items.filter((id) => id !== "settings");
  return [...withoutSettings, "settings"];
}
function apiToAppSettings(data) {
  const visibleGroups = [];
  if (data.show_overdue) visibleGroups.push("overdue");
  if (data.show_today) visibleGroups.push("today");
  if (data.show_tomorrow) visibleGroups.push("tomorrow");
  if (data.show_later) visibleGroups.push("later");
  if (data.show_no_deadline) visibleGroups.push("nodate");
  if (data.show_completed) visibleGroups.push("completed");
  return {
    language: data.language,
    theme: defaultAppSettings.theme,
    visibleGroups,
    notifications: true,
    vibration: data.vibration_enabled,
    notificationSound: data.notification_sound,
    completionSound: data.completion_sound,
    bottomNavItems: data.bottom_tabs?.length ? normalizeBottomNavItems([...data.bottom_tabs]) : [...defaultAppSettings.bottomNavItems]
  };
}
function appSettingsToApiPatch(updates) {
  const patch = {};
  if (updates.language !== void 0) patch.language = updates.language;
  if (updates.vibration !== void 0) patch.vibration_enabled = updates.vibration;
  if (updates.notificationSound !== void 0) patch.notification_sound = updates.notificationSound;
  if (updates.completionSound !== void 0) patch.completion_sound = updates.completionSound;
  if (updates.bottomNavItems !== void 0) patch.bottom_tabs = [...updates.bottomNavItems];
  if (updates.visibleGroups !== void 0) {
    patch.show_overdue = updates.visibleGroups.includes("overdue");
    patch.show_today = updates.visibleGroups.includes("today");
    patch.show_tomorrow = updates.visibleGroups.includes("tomorrow");
    patch.show_later = updates.visibleGroups.includes("later");
    patch.show_no_deadline = updates.visibleGroups.includes("nodate");
    patch.show_completed = updates.visibleGroups.includes("completed");
  }
  return patch;
}
function apiMatrixToBlocks(settings) {
  const blocks = { ...matrixBlockDefaults };
  for (const item of settings) {
    const uiId = item.block.replace("urgent_important", "urgent-important").replace("not_urgent_important", "not-urgent-important").replace("urgent_not_important", "urgent-not-important").replace("not_urgent_not_important", "not-urgent-not-important");
    if (!blocks[uiId]) continue;
    blocks[uiId] = {
      ...blocks[uiId],
      title: item.title || blocks[uiId].title,
      dateFilter: item.date_filter ? item.date_filter.split(",").filter(Boolean) : blocks[uiId].dateFilter,
      priorityFilter: item.allowed_priorities?.length ? item.allowed_priorities.map((p) => p === "critical" ? "high" : p) : blocks[uiId].priorityFilter
    };
  }
  return blocks;
}
function syncPremiumToAuth(settings) {
  const authStore = useAuthStore();
  if (authStore.user) {
    authStore.user.isPremium = settings.is_premium;
    authStore.user.premiumExpiresAt = settings.premium_activated_at || void 0;
  }
}
const useSettingsStore = /* @__PURE__ */ defineStore("settings", () => {
  const appSettings = useLocalStorage("otter.app.settings", { ...defaultAppSettings });
  const matrixBlocks = useLocalStorage("otter.matrix.blocks", { ...matrixBlockDefaults });
  const isPremium = ref(false);
  const premiumActivatedAt = ref(null);
  const loading = ref(false);
  const error = ref("");
  const helpFaq = ref([]);
  const helpFaqLoading = ref(false);
  const helpFaqError = ref("");
  const premiumFeatures = ref([]);
  const premiumFeaturesLoading = ref(false);
  const legalDocuments = ref([]);
  const legalDocumentsLoading = ref(false);
  const legalDocumentsError = ref("");
  async function fetchHelpFaq() {
    helpFaqLoading.value = true;
    helpFaqError.value = "";
    try {
      const items = await apiGet("help/");
      helpFaq.value = items.map((item, index) => ({
        id: `faq-${index}`,
        question: item.question,
        answer: item.answer,
        open: false
      }));
    } catch (err) {
      helpFaqError.value = getApiErrorMessage(err, "Не удалось загрузить FAQ");
      throw err;
    } finally {
      helpFaqLoading.value = false;
    }
  }
  async function sendHelpMessage(message, screenshot) {
    if (screenshot) {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("screenshot", screenshot);
      return apiPost("help/", formData);
    }
    return apiPost("help/", { message });
  }
  async function callStubAction() {
    const response = await apiPost("settings/stub-action/");
    return response.detail || "Уже разрабатываем, скоро будет готово :)";
  }
  async function fetchPremiumFeatures() {
    premiumFeaturesLoading.value = true;
    try {
      premiumFeatures.value = await apiGet("premium/features/");
    } finally {
      premiumFeaturesLoading.value = false;
    }
  }
  async function fetchLegalDocuments() {
    legalDocumentsLoading.value = true;
    legalDocumentsError.value = "";
    try {
      legalDocuments.value = await apiGet("legal/documents/");
    } catch (err) {
      legalDocumentsError.value = getApiErrorMessage(err, "Не удалось загрузить документы");
      throw err;
    } finally {
      legalDocumentsLoading.value = false;
    }
  }
  async function fetchFromApi() {
    loading.value = true;
    error.value = "";
    try {
      const [settings, matrixSettings] = await Promise.all([
        apiGet("settings/"),
        apiGet("matrix/settings/")
      ]);
      appSettings.value = {
        ...appSettings.value,
        ...apiToAppSettings(settings)
      };
      matrixBlocks.value = apiMatrixToBlocks(matrixSettings);
      isPremium.value = settings.is_premium;
      premiumActivatedAt.value = settings.premium_activated_at;
      syncPremiumToAuth(settings);
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function updateSettings(updates) {
    const next = { ...appSettings.value, ...updates };
    appSettings.value = next;
    const patch = appSettingsToApiPatch(updates);
    if (Object.keys(patch).length === 0) return;
    const updated = await apiPatch("settings/", patch);
    appSettings.value = {
      ...next,
      ...apiToAppSettings(updated)
    };
    isPremium.value = updated.is_premium;
    premiumActivatedAt.value = updated.premium_activated_at;
    syncPremiumToAuth(updated);
  }
  async function toggleGroup(groupId) {
    const groups = [...appSettings.value.visibleGroups];
    const idx = groups.indexOf(groupId);
    if (idx === -1) groups.push(groupId);
    else groups.splice(idx, 1);
    await updateSettings({ visibleGroups: groups });
  }
  function isGroupVisible(groupId) {
    return appSettings.value.visibleGroups.includes(groupId);
  }
  async function updateMatrixBlock(blockId, updates) {
    const block = matrixBlocks.value[blockId];
    if (!block) return;
    Object.assign(block, updates);
    const apiBlock = blockId.replace(/-/g, "_");
    await apiPatch("matrix/settings/", {
      block: apiBlock,
      title: updates.title ?? block.title,
      allowed_priorities: updates.priorityFilter || block.priorityFilter,
      date_filter: Array.isArray(updates.dateFilter) ? updates.dateFilter.join(",") : updates.dateFilter ?? block.dateFilter?.join(",")
    });
  }
  async function reorderNavItems(items) {
    await updateSettings({ bottomNavItems: normalizeBottomNavItems(items) });
  }
  async function premiumCheckout(tariff = "monthly") {
    return apiPost("premium/checkout/", { tariff });
  }
  async function premiumActivate() {
    const updated = await apiPost("premium/activate/");
    appSettings.value = { ...appSettings.value, ...apiToAppSettings(updated) };
    isPremium.value = updated.is_premium;
    premiumActivatedAt.value = updated.premium_activated_at;
    syncPremiumToAuth(updated);
    return updated;
  }
  return {
    appSettings,
    matrixBlocks,
    isPremium,
    premiumActivatedAt,
    loading,
    error,
    helpFaq,
    helpFaqLoading,
    helpFaqError,
    premiumFeatures,
    premiumFeaturesLoading,
    legalDocuments,
    legalDocumentsLoading,
    legalDocumentsError,
    fetchHelpFaq,
    sendHelpMessage,
    callStubAction,
    fetchPremiumFeatures,
    fetchLegalDocuments,
    fetchFromApi,
    updateSettings,
    toggleGroup,
    isGroupVisible,
    updateMatrixBlock,
    reorderNavItems,
    premiumCheckout,
    premiumActivate
  };
});
const useAuthStore = /* @__PURE__ */ defineStore("auth", () => {
  const user = useLocalStorage("otter.auth.user", null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const tokenRevision = ref(0);
  const profileFirstName = useLocalStorage("otter.auth.first-name", "");
  const profileLastName = useLocalStorage("otter.auth.last-name", "");
  const profileLoaded = ref(false);
  function syncTokensFromStorage() {
    accessToken.value = getAccessToken();
    refreshToken.value = getRefreshToken();
    tokenRevision.value += 1;
  }
  const isLoggedIn = computed(() => {
    tokenRevision.value;
    return false;
  });
  const requiresProfileFill = computed(
    () => isLoggedIn.value && (!profileFirstName.value.trim() || !profileLastName.value.trim())
  );
  function mapBackendUser(nextUser) {
    const fullName = `${nextUser.first_name || ""} ${nextUser.last_name || ""}`.trim();
    return {
      id: String(nextUser.id),
      email: nextUser.email,
      name: fullName || nextUser.email.split("@")[0] || "User",
      avatar: resolveMediaUrl(nextUser.avatar) || void 0,
      isPremium: user.value?.isPremium || false,
      premiumExpiresAt: user.value?.premiumExpiresAt
    };
  }
  function applyTokens(tokens) {
    syncTokensFromStorage();
  }
  function setSession(nextUser, tokens) {
    applyTokens();
    profileFirstName.value = nextUser.first_name || "";
    profileLastName.value = nextUser.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(nextUser);
  }
  async function fetchMyProfile() {
    const profile = await apiGet("profile/");
    profileFirstName.value = profile.first_name || "";
    profileLastName.value = profile.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(profile);
    return profile;
  }
  async function updateProfile(first_name, last_name, avatar) {
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    const profile = await apiPut("profile/", formData);
    profileFirstName.value = profile.first_name || "";
    profileLastName.value = profile.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(profile);
    return profile;
  }
  async function login(email, password) {
    const response = await apiPost("auth/login/", {
      email,
      password
    });
    applyTokens(response.tokens);
    await fetchMyProfile();
    navigateTo("/app");
  }
  async function register(email, password, first_name = "", last_name = "", options = {}) {
    const { navigateOnSuccess = true } = options;
    const response = await apiPost("auth/register/", {
      email,
      password,
      first_name,
      last_name
    });
    setSession(response.user, response.tokens);
    if (navigateOnSuccess) {
      navigateTo("/app");
    }
    return response;
  }
  async function loginWithGoogle(payload) {
    if (!payload?.firebase_token) {
      console.warn("[otter:google] loginWithGoogle: firebase_token yo‘q, chiqildi");
      return;
    }
    console.log("[otter:google] loginWithGoogle: auth/google/ so‘rov yuborilmoqda…");
    const response = await apiPost("auth/google/", payload);
    console.log("[otter:google] loginWithGoogle: javob keldi", {
      userId: response?.user?.id,
      email: response?.user?.email,
      hasAccess: !!response?.tokens?.access,
      hasRefresh: !!response?.tokens?.refresh
    });
    setSession(response.user, response.tokens);
    await fetchMyProfile();
    console.log("[otter:google] navigateTo(/app)");
    navigateTo("/app");
  }
  async function forgotPassword(email) {
    return apiPost("auth/forgot-password/", { email });
  }
  async function forgotPasswordVerify(email, code) {
    return apiPost("auth/forgot-password/verify/", {
      email,
      code
    });
  }
  async function forgotPasswordConfirm(reset_token, new_password) {
    return apiPost("auth/forgot-password/confirm/", {
      reset_token,
      new_password
    });
  }
  async function changePassword(newPassword) {
    return apiPost("profile/change-password/", {
      new_password: newPassword
    });
  }
  function logout() {
    const tasksStore = useTasksStore();
    tasksStore.reset();
    syncTokensFromStorage();
    user.value = null;
    profileFirstName.value = "";
    profileLastName.value = "";
    profileLoaded.value = false;
    navigateTo("/");
  }
  function updateAvatar(url) {
    if (user.value) user.value.avatar = url;
  }
  function updateName(name) {
    if (user.value) user.value.name = name;
  }
  async function startPremiumCheckout(tariff = "monthly") {
    const settingsStore = useSettingsStore();
    return settingsStore.premiumCheckout(tariff);
  }
  async function activatePremium() {
    const settingsStore = useSettingsStore();
    await settingsStore.premiumActivate();
    if (user.value) {
      user.value.isPremium = settingsStore.isPremium;
      user.value.premiumExpiresAt = settingsStore.premiumActivatedAt || void 0;
    }
  }
  return {
    user,
    accessToken,
    refreshToken,
    profileFirstName,
    profileLastName,
    profileLoaded,
    isLoggedIn,
    requiresProfileFill,
    syncTokensFromStorage,
    fetchMyProfile,
    updateProfile,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    forgotPasswordVerify,
    forgotPasswordConfirm,
    changePassword,
    logout,
    updateAvatar,
    updateName,
    startPremiumCheckout,
    activatePremium
  };
});
const app_45auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  return;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  app_45auth_45global,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-B7AEK2pI.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = pinia.state.value;
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const DEFAULT_MS = 4500;
function useAppToast() {
  const toast = useState("app-global-toast", () => ({
    visible: false,
    message: "",
    type: "success"
  }));
  function hideToast() {
    toast.value.visible = false;
  }
  function showToast(message, type = "success", durationMs = DEFAULT_MS) {
    return;
  }
  return { toast, showToast, hideToast };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppGlobalToast",
  __ssrInlineRender: true,
  setup(__props) {
    const { toast } = useAppToast();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(toast).visible) {
          _push2(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "border-sber-green bg-sber-green-light" : "border-red-300 bg-red-50", "fixed left-1/2 top-[max(5rem,env(safe-area-inset-top,0px)+1rem)] z-[100] flex max-w-[min(100vw-2rem,420px)] -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg"])}" role="status" data-v-ee22b97d>`);
          _push2(ssrRenderComponent(unref(CheckCircle), {
            class: ["h-5 w-5 flex-shrink-0", unref(toast).type === "success" ? "text-sber-green" : "text-red-500"],
            "aria-hidden": "true"
          }, null, _parent));
          _push2(`<p class="${ssrRenderClass([unref(toast).type === "success" ? "text-sber-green" : "text-red-600", "text-sm font-medium"])}" data-v-ee22b97d>${ssrInterpolate(unref(toast).message)}</p></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppGlobalToast.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ee22b97d"]]);
const layouts = {
  app: defineAsyncComponent(() => import('./app-xb-4vWOO.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-DE7Yy99t.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve) => {
              nuxtApp["~transitionFinish"] = resolve;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
            default: () => h(
              LayoutProvider,
              {
                layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
                key: layout.value || void 0,
                name: layout.value,
                shouldProvide: !props.name,
                isRenderingNewLayout: (name) => {
                  return name !== previouslyRenderedLayout && name === layout.value;
                },
                hasTransition
              },
              context.slots
            )
          }
        )
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    dayjs.locale("ru");
    const settingsStore = useSettingsStore();
    const isDark = computed(() => settingsStore.appSettings.theme === "dark");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppGlobalToast = __nuxt_component_0;
      const _component_NuxtLayout = __nuxt_component_1;
      const _component_NuxtPage = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-dvh", unref(isDark) ? "dark bg-[#0f1115]" : "bg-white"]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AppGlobalToast, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    const props = __props;
    const statusCode = computed(() => props.error?.statusCode || 500);
    const statusLabel = computed(() => statusCode.value === 404 ? "Страница не найдена" : "Ошибка приложения");
    const title = computed(() => statusCode.value === 404 ? "Такой страницы нет." : "Что-то пошло не так.");
    const description = computed(
      () => statusCode.value === 404 ? "Возможно, адрес изменился или страница была перенесена в другой раздел приложения." : "Во время открытия страницы произошла ошибка. Мы уже подготовили безопасный выход на главную страницу."
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-sber-gray-light px-6 py-10 lg:flex lg:items-center lg:justify-center" }, _attrs))}><div class="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-10"><div class="mb-8 lg:mb-0"><p class="text-sm font-semibold text-sber-green">${ssrInterpolate(unref(statusLabel))}</p><h1 class="mt-3 text-4xl font-bold tracking-tight text-sber-black lg:text-5xl">${ssrInterpolate(unref(statusCode))}</h1><h2 class="mt-4 text-2xl font-bold text-sber-black">${ssrInterpolate(unref(title))}</h2><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray">${ssrInterpolate(unref(description))}</p></div><div class="rounded-[28px] bg-sber-gray-light p-6"><div class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Что можно сделать</p><ul class="mt-4 space-y-3 text-sm text-sber-black"><li>Проверьте адрес страницы и попробуйте открыть её снова.</li>`);
      if (unref(statusCode) === 404) {
        _push(`<li>Вернитесь на главную или откройте рабочее пространство.</li>`);
      } else {
        _push(`<li>Обновите страницу. Если ошибка повторится, попробуйте снова чуть позже.</li>`);
      }
      _push(`</ul></div><div class="mt-5 flex flex-col gap-3"><button class="btn-primary"> На главную </button><button class="btn-secondary"> Открыть приложение </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { useNuxtApp as A, useRuntimeConfig as B, nuxtLinkDefaults as C, _export_sfc as _, useState as a, useSettingsStore as b, useTasksStore as c, useRoute as d, entry_default as default, useAppToast as e, defineStore as f, getTaskScheduleStart as g, getTaskDurationMinutes as h, formatMinutesToTime as i, addMinutesToTime as j, defaultPomodoroSettings as k, apiGet as l, matrixBlockDefaults as m, navigateTo as n, onClickOutside as o, parseTimeToMinutes as p, apiPatch as q, apiPost as r, soundOptions as s, getApiErrorMessage as t, useAuthStore as u, tryUseNuxtApp as v, useRouter as w, defineNuxtRouteMiddleware as x, encodeRoutePath as y, resolveRouteObject as z };
//# sourceMappingURL=server.mjs.map
