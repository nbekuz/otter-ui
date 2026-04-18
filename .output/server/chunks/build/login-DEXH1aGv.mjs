import { _ as __nuxt_component_1 } from './nuxt-link-CVKuvMWS.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrRenderTeleport } from 'vue/server-renderer';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Info } from 'lucide-vue-next';
import { l as logoUrl } from './logo-DVdZXLLs.mjs';
import { u as useAuthStore } from './auth-B8mCgdTo.mjs';
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
import 'unhead/plugins';
import 'vue-router';
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const metrics = ["\u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435", "\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439\u0442\u0435", "\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C", "\u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435"];
    const form = reactive({ email: "", password: "" });
    const errors = reactive({ email: "", password: "" });
    const showPassword = ref(false);
    const showForgot = ref(false);
    const forgotEmail = ref("");
    const forgotError = ref("");
    const resetSent = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))}><div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl"><div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: unref(logoUrl),
                alt: "Otter logo",
                class: "h-11 w-11 rounded-2xl brightness-0"
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-6 text-4xl font-bold leading-tight text-sber-black">\u041F\u0430\u0440\u0443 \u043A\u043B\u0438\u043A\u043E\u0432, \u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0433\u043E\u0442\u043E\u0432\u0430. \u041D\u0438\u0447\u0435\u0433\u043E \u043B\u0438\u0448\u043D\u0435\u0433\u043E.</h1><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray"> \u0422\u0435\u043F\u0435\u0440\u044C \u0435\u0449\u0435 \u0443\u0434\u043E\u0431\u043D\u0435\u0435 \u0434\u043B\u044F \u043E\u0431\u0437\u043E\u0440\u0430 \u0437\u0430\u0434\u0430\u0447, \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u0438 \u043F\u043B\u0430\u043D\u043E\u0432 \u043D\u0430 \u0434\u0435\u043D\u044C. </p></div><div class="rounded-[28px] bg-sber-gray-light p-5"><p class="text-xs uppercase tracking-[0.2em] text-sber-gray">\u0427\u0442\u043E \u0432\u043D\u0443\u0442\u0440\u0438</p><div class="relative mt-4 grid grid-cols-2 items-start gap-3"><div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80"></div><div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80"></div><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "mt-7": index % 2 === 1 }, "relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"])}"><p class="text-sm font-bold uppercase tracking-wide">${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95"><div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm"><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0"></div></div></div></div></div><div class="min-h-dvh bg-white lg:min-h-0"><div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black">\u0412\u043E\u0439\u0442\u0438</h1></div><div class="flex-1 px-6 pt-6 pb-10 lg:px-8"><p class="mb-8 text-sm leading-relaxed text-sber-gray"> \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0451\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432 Otter </p><form class="space-y-4"><div><label class="mb-2 block text-sm font-medium text-sber-gray">Email</label><div class="relative">`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}"></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500">${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="mb-2 block text-sm font-medium text-sber-gray">\u041F\u0430\u0440\u043E\u043B\u044C</label><div class="relative">`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="current-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}"><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button">`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500">${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-end"><button class="text-sm font-medium text-sber-green" type="button"> \u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C? </button></div><button class="btn-primary mx-auto block w-full max-w-[320px]" type="submit"> \u0412\u043E\u0439\u0442\u0438 </button></form><div class="mt-4 flex items-start gap-2 rounded-2xl bg-sber-blue-light px-4 py-3">`);
      _push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-4 w-4 flex-shrink-0 text-sber-blue" }, null, _parent));
      _push(`<p class="text-xs text-sber-blue"> \u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0432\u0445\u043E\u0434: \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u044E\u0431\u043E\u0439 email \u0438 \u043F\u0430\u0440\u043E\u043B\u044C </p></div><div class="my-6 text-center"><span class="text-sm text-sber-gray">\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? </span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-sm font-semibold text-sber-green"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0421\u043E\u0437\u0434\u0430\u0442\u044C`);
          } else {
            return [
              createTextVNode("\u0421\u043E\u0437\u0434\u0430\u0442\u044C")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mb-6 flex items-center gap-4"><div class="h-px flex-1 bg-sber-gray-mid"></div><span class="text-sm text-sber-gray">\u0438\u043B\u0438</span><div class="h-px flex-1 bg-sber-gray-mid"></div></div><button class="mx-auto flex w-full max-w-[320px] items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light" type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> \u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Google </button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showForgot)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showForgot)) {
          _push2(`<form class="app-modal px-6 py-6"><h3 class="mb-2 text-lg font-bold text-sber-black">\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F</h3><p class="mb-4 text-sm text-sber-gray"> \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u0430\u0448 email, \u0438 \u043C\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043C \u0441\u0441\u044B\u043B\u043A\u0443 \u0434\u043B\u044F \u0441\u0431\u0440\u043E\u0441\u0430 \u043F\u0430\u0440\u043E\u043B\u044F </p><div class="relative mb-2">`);
          _push2(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(forgotEmail))} type="email" placeholder="Email" autocomplete="email" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotError) }, "input-field pl-12"])}"></div>`);
          if (unref(forgotError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(forgotError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary" type="submit">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</button><button class="btn-secondary mt-3" type="button">\u041E\u0442\u043C\u0435\u043D\u0430</button>`);
          if (unref(resetSent)) {
            _push2(`<div class="mt-3 text-center text-sm font-medium text-sber-green"> \u2713 \u041F\u0438\u0441\u044C\u043C\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u0430 ${ssrInterpolate(unref(forgotEmail))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</form>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DEXH1aGv.mjs.map
