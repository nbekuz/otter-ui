import { _ as __nuxt_component_1 } from './nuxt-link-BzIu_HDP.mjs';
import { defineComponent, reactive, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toRef, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-vue-next';
import { l as logoUrl } from './logo-DVdZXLLs.mjs';
import { u as useAuthStore } from './auth-CRLaNohc.mjs';
import { u as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';

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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const metrics = ["\u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435", "\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439\u0442\u0435", "\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C", "\u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435"];
    const form = reactive({ email: "", password: "" });
    const errors = reactive({ email: "", password: "" });
    const showPassword = ref(false);
    const googleLoading = ref(false);
    const googleError = ref("");
    useState("loginPasswordResetToast", () => null);
    const pageToast = reactive({
      visible: false,
      message: ""
    });
    const showForgot = ref(false);
    const forgotStep = ref("email");
    const forgotEmail = ref("");
    const forgotCode = ref("");
    ref("");
    const forgotNewPassword = ref("");
    const forgotConfirmPassword = ref("");
    const forgotError = ref("");
    const forgotPwError = ref("");
    const forgotLoading = ref(false);
    const showForgotNewPw = ref(false);
    const showForgotConfirmPw = ref(false);
    const forgotSubmitLabel = computed(() => {
      if (forgotLoading.value) return "\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435...";
      if (forgotStep.value === "email") return "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u0434";
      if (forgotStep.value === "code") return "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043A\u043E\u0434";
      return "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-2f0b4305><div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl" data-v-2f0b4305><div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black" data-v-2f0b4305><div data-v-2f0b4305>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" data-v-2f0b4305${_scopeId}>`);
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
      _push(`<h1 class="mt-6 text-4xl font-bold leading-tight text-sber-black" data-v-2f0b4305>\u041F\u0430\u0440\u0443 \u043A\u043B\u0438\u043A\u043E\u0432, \u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0433\u043E\u0442\u043E\u0432\u0430. \u041D\u0438\u0447\u0435\u0433\u043E \u043B\u0438\u0448\u043D\u0435\u0433\u043E.</h1><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-2f0b4305> \u0422\u0435\u043F\u0435\u0440\u044C \u0435\u0449\u0435 \u0443\u0434\u043E\u0431\u043D\u0435\u0435 \u0434\u043B\u044F \u043E\u0431\u0437\u043E\u0440\u0430 \u0437\u0430\u0434\u0430\u0447, \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u0438 \u043F\u043B\u0430\u043D\u043E\u0432 \u043D\u0430 \u0434\u0435\u043D\u044C. </p></div><div class="rounded-[28px] bg-sber-gray-light p-5" data-v-2f0b4305><p class="text-xs uppercase tracking-[0.2em] text-sber-gray" data-v-2f0b4305>\u0427\u0442\u043E \u0432\u043D\u0443\u0442\u0440\u0438</p><div class="relative mt-4 grid grid-cols-2 items-start gap-3" data-v-2f0b4305><div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80" data-v-2f0b4305></div><div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80" data-v-2f0b4305></div><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "mt-7": index % 2 === 1 }, "relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"])}" data-v-2f0b4305><p class="text-sm font-bold uppercase tracking-wide" data-v-2f0b4305>${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95" data-v-2f0b4305><div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm" data-v-2f0b4305><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0" data-v-2f0b4305></div></div></div></div></div><div class="min-h-dvh bg-white lg:min-h-0" data-v-2f0b4305><div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8" data-v-2f0b4305><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" data-v-2f0b4305>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-2f0b4305>\u0412\u043E\u0439\u0442\u0438</h1></div><div class="flex-1 px-6 pt-6 pb-10 lg:px-8" data-v-2f0b4305><p class="mb-8 text-sm leading-relaxed text-sber-gray" data-v-2f0b4305> \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0451\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432 Otter </p><form class="space-y-4" data-v-2f0b4305><div data-v-2f0b4305><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-2f0b4305>Email</label><div class="relative" data-v-2f0b4305>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-2f0b4305></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-2f0b4305>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-2f0b4305><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-2f0b4305>\u041F\u0430\u0440\u043E\u043B\u044C</label><div class="relative" data-v-2f0b4305>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="current-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-2f0b4305><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-2f0b4305>`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-2f0b4305>${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-end" data-v-2f0b4305><button class="text-sm font-medium text-sber-green" type="button" data-v-2f0b4305> \u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C? </button></div><button class="btn-primary mx-auto block w-full max-w-[320px]" type="submit" data-v-2f0b4305> \u0412\u043E\u0439\u0442\u0438 </button></form><div class="my-6 text-center" data-v-2f0b4305><span class="text-sm text-sber-gray" data-v-2f0b4305>\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? </span>`);
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
      _push(`</div><div class="mb-6 flex items-center gap-4" data-v-2f0b4305><div class="h-px flex-1 bg-sber-gray-mid" data-v-2f0b4305></div><span class="text-sm text-sber-gray" data-v-2f0b4305>\u0438\u043B\u0438</span><div class="h-px flex-1 bg-sber-gray-mid" data-v-2f0b4305></div></div>`);
      if (unref(googleError)) {
        _push(`<p class="mx-auto mb-2 max-w-[320px] text-center text-xs text-red-500" data-v-2f0b4305>${ssrInterpolate(unref(googleError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="mx-auto flex w-full max-w-[320px] items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(googleLoading)) ? " disabled" : ""} data-v-2f0b4305><svg width="20" height="20" viewBox="0 0 24 24" data-v-2f0b4305><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" data-v-2f0b4305></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" data-v-2f0b4305></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" data-v-2f0b4305></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" data-v-2f0b4305></path></svg> ${ssrInterpolate(unref(googleLoading) ? "\u0412\u0445\u043E\u0434\u2026" : "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Google")}</button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(pageToast).visible) {
          _push2(`<div class="fixed bottom-6 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-0" role="status" data-v-2f0b4305><div class="flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3 shadow-lg" data-v-2f0b4305>`);
          _push2(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 flex-shrink-0 text-sber-green" }, null, _parent));
          _push2(`<p class="text-sm font-medium text-sber-green" data-v-2f0b4305>${ssrInterpolate(unref(pageToast).message)}</p></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showForgot)) {
          _push2(`<div class="overlay" data-v-2f0b4305></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showForgot)) {
          _push2(`<form class="app-modal px-6 py-6" data-v-2f0b4305><h3 class="mb-2 text-lg font-bold text-sber-black" data-v-2f0b4305>\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F</h3>`);
          if (unref(forgotStep) === "email") {
            _push2(`<!--[--><p class="mb-4 text-sm text-sber-gray" data-v-2f0b4305> \u0412\u0432\u0435\u0434\u0438\u0442\u0435 email \u2014 \u043C\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043C \u043F\u0438\u0441\u044C\u043C\u043E \u0441 \u043A\u043E\u0434\u043E\u043C (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \xAB\u0412\u0410\u0428 \u041A\u041E\u0414 310696\xBB). </p><div class="relative mb-2" data-v-2f0b4305>`);
            _push2(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(forgotEmail))} type="email" placeholder="Email" autocomplete="email" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotError) }, "input-field pl-12"])}" data-v-2f0b4305></div><!--]-->`);
          } else if (unref(forgotStep) === "code") {
            _push2(`<!--[--><p class="mb-2 text-sm text-sber-gray" data-v-2f0b4305> \u041A\u043E\u0434 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0430 <span class="font-medium text-sber-black" data-v-2f0b4305>${ssrInterpolate(unref(forgotEmail))}</span></p><p class="mb-3 text-xs text-sber-gray" data-v-2f0b4305>\u0412\u0432\u0435\u0434\u0438\u0442\u0435 6 \u0446\u0438\u0444\u0440 \u0438\u0437 \u043F\u0438\u0441\u044C\u043C\u0430 (\u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0434).</p><div class="relative mb-2" data-v-2f0b4305>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(forgotCode))} type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotError) }, "input-field pl-12 tracking-widest"])}" data-v-2f0b4305></div><button class="btn-secondary mb-3 w-full" type="button" data-v-2f0b4305> \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C email </button><!--]-->`);
          } else {
            _push2(`<!--[--><p class="mb-2 text-sm text-sber-gray" data-v-2f0b4305> \u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u0434\u043B\u044F <span class="font-medium text-sber-black" data-v-2f0b4305>${ssrInterpolate(unref(forgotEmail))}</span></p><p class="mb-3 text-xs text-sber-gray" data-v-2f0b4305>8\u201320 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432: \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u0430\u044F \u0438 \u0441\u0442\u0440\u043E\u0447\u043D\u0430\u044F \u043B\u0430\u0442\u0438\u043D\u0441\u043A\u0438\u0435 \u0431\u0443\u043A\u0432\u044B, \u0446\u0438\u0444\u0440\u0430 \u0438 \u043E\u0434\u0438\u043D \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u043C\u0432\u043E\u043B.</p><div class="relative mb-2" data-v-2f0b4305>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderDynamicModel(unref(showForgotNewPw) ? "text" : "password", unref(forgotNewPassword), null)}${ssrRenderAttr("type", unref(showForgotNewPw) ? "text" : "password")} placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="new-password" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotPwError) }, "input-field pl-12 pr-12"])}" data-v-2f0b4305><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-2f0b4305>`);
            if (!unref(showForgotNewPw)) {
              _push2(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            }
            _push2(`</button></div><div class="relative mb-2" data-v-2f0b4305>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderDynamicModel(unref(showForgotConfirmPw) ? "text" : "password", unref(forgotConfirmPassword), null)}${ssrRenderAttr("type", unref(showForgotConfirmPw) ? "text" : "password")} placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="new-password" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotPwError) }, "input-field pl-12 pr-12"])}" data-v-2f0b4305><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-2f0b4305>`);
            if (!unref(showForgotConfirmPw)) {
              _push2(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            }
            _push2(`</button></div>`);
            if (unref(forgotPwError)) {
              _push2(`<p class="mb-2 ml-1 text-xs text-red-500" data-v-2f0b4305>${ssrInterpolate(unref(forgotPwError))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          }
          if (unref(forgotError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-2f0b4305>${ssrInterpolate(unref(forgotError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary w-full" type="submit"${ssrIncludeBooleanAttr(unref(forgotLoading)) ? " disabled" : ""} data-v-2f0b4305>${ssrInterpolate(unref(forgotSubmitLabel))}</button><button class="btn-secondary mt-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(forgotLoading)) ? " disabled" : ""} data-v-2f0b4305> \u041E\u0442\u043C\u0435\u043D\u0430 </button></form>`);
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
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2f0b4305"]]);

export { login as default };
//# sourceMappingURL=login-DKIeENk1.mjs.map
