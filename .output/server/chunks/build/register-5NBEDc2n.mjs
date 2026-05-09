import { _ as __nuxt_component_1 } from './nuxt-link-BzIu_HDP.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, CheckCircle } from 'lucide-vue-next';
import { l as logoUrl } from './logo-DVdZXLLs.mjs';
import { u as useAuthStore } from './auth-CRLaNohc.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const metrics = ["\u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435", "\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439\u0442\u0435", "\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C", "\u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435"];
    const form = reactive({ email: "", password: "", confirmPassword: "" });
    const errors = reactive({ email: "", password: "", confirmPassword: "", terms: "" });
    const showPassword = ref(false);
    const showConfirm = ref(false);
    const agreeTerms = ref(false);
    const isSubmitting = ref(false);
    const toast = reactive({
      visible: false,
      type: "success",
      message: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-bea687de><div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl" data-v-bea687de><div class="min-h-dvh bg-white lg:order-2 lg:min-h-0" data-v-bea687de><div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8" data-v-bea687de><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" data-v-bea687de>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-bea687de>\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</h1></div><div class="px-6 pt-6 pb-10 lg:px-8" data-v-bea687de><form class="space-y-4" novalidate data-v-bea687de><div data-v-bea687de><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-bea687de>Email</label><div class="relative" data-v-bea687de>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-bea687de></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-bea687de>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-bea687de><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-bea687de>\u041F\u0430\u0440\u043E\u043B\u044C</label><div class="relative" data-v-bea687de>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="8\u201320: Aa, 0\u20139 \u0438 \u0441\u043F\u0435\u0446\u0441\u0438\u043C\u0432\u043E\u043B (!@\u2026)" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-bea687de><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-bea687de>`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-bea687de>${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-bea687de><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-bea687de>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</label><div class="relative" data-v-bea687de>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showConfirm) ? "text" : "password", unref(form).confirmPassword, null)}${ssrRenderAttr("type", unref(showConfirm) ? "text" : "password")} placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password }, "input-field pl-12 pr-12"])}" data-v-bea687de><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-bea687de>`);
      if (!unref(showConfirm)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-bea687de>${ssrInterpolate(unref(errors).confirmPassword || "\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-bea687de><div class="flex items-start gap-3" data-v-bea687de><button class="${ssrRenderClass([unref(agreeTerms) ? "border-sber-green bg-sber-green" : "border-sber-gray-mid", "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2"])}" type="button" data-v-bea687de>`);
      if (unref(agreeTerms)) {
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4 text-white" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><p class="text-sm leading-relaxed text-sber-gray" data-v-bea687de> \u042F \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u044E\u0441\u044C \u0441 <span class="font-medium text-sber-green" data-v-bea687de>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u043C \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435\u043C</span> \u0438 <span class="font-medium text-sber-green" data-v-bea687de>\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</span></p></div>`);
      if (unref(errors).terms) {
        _push(`<p class="mt-2 ml-1 text-xs text-red-500" data-v-bea687de>${ssrInterpolate(unref(errors).terms)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-full flex lg:justify-center items-center" data-v-bea687de><button class="btn-primary lg:max-w-[360px] disabled:opacity-60 disabled:cursor-not-allowed" type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-bea687de>${ssrInterpolate(unref(isSubmitting) ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430..." : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442")}</button></div></form>`);
      if (unref(toast).visible) {
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "border border-sber-green bg-sber-green-light" : "border border-red-300 bg-red-50", "mt-4 flex items-center gap-3 rounded-2xl px-4 py-3"])}" data-v-bea687de>`);
        _push(ssrRenderComponent(unref(CheckCircle), {
          class: ["h-5 w-5 flex-shrink-0", unref(toast).type === "success" ? "text-sber-green" : "text-red-500"]
        }, null, _parent));
        _push(`<p class="${ssrRenderClass([unref(toast).type === "success" ? "text-sber-green" : "text-red-600", "text-sm font-medium"])}" data-v-bea687de>${ssrInterpolate(unref(toast).message)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 text-center lg:mx-auto lg:max-w-[360px]" data-v-bea687de><span class="text-sm text-sber-gray" data-v-bea687de>\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? </span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-sm font-semibold text-sber-green"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0412\u043E\u0439\u0442\u0438`);
          } else {
            return [
              createTextVNode("\u0412\u043E\u0439\u0442\u0438")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black" data-v-bea687de><div data-v-bea687de>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" data-v-bea687de${_scopeId}>`);
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
      _push(`<h2 class="mt-6 text-4xl font-bold leading-tight text-sber-black" data-v-bea687de>\u041F\u0430\u0440\u0443 \u043A\u043B\u0438\u043A\u043E\u0432, \u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0433\u043E\u0442\u043E\u0432\u0430. \u041D\u0438\u0447\u0435\u0433\u043E \u043B\u0438\u0448\u043D\u0435\u0433\u043E.</h2><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-bea687de> \u0422\u0435\u043F\u0435\u0440\u044C \u0435\u0449\u0435 \u0443\u0434\u043E\u0431\u043D\u0435\u0435 \u0434\u043B\u044F \u043E\u0431\u0437\u043E\u0440\u0430 \u0437\u0430\u0434\u0430\u0447, \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u0438 \u043F\u043B\u0430\u043D\u043E\u0432 \u043D\u0430 \u0434\u0435\u043D\u044C. </p></div><div class="rounded-[28px] bg-sber-gray-light p-5" data-v-bea687de><p class="text-xs uppercase tracking-[0.2em] text-sber-gray" data-v-bea687de>\u0427\u0442\u043E \u0432\u043D\u0443\u0442\u0440\u0438</p><div class="relative mt-4 grid grid-cols-2 items-start gap-3" data-v-bea687de><div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80" data-v-bea687de></div><div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80" data-v-bea687de></div><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "mt-7": index % 2 === 1 }, "relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"])}" data-v-bea687de><p class="text-sm font-bold uppercase tracking-wide" data-v-bea687de>${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95" data-v-bea687de><div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm" data-v-bea687de><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0" data-v-bea687de></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bea687de"]]);

export { register as default };
//# sourceMappingURL=register-5NBEDc2n.mjs.map
