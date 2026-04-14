import { _ as __nuxt_component_1 } from './nuxt-link-CVKuvMWS.mjs';
import { _ as _sfc_main$1 } from './BrandLogo-Bb3oU9iv.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel } from 'vue/server-renderer';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, CheckCircle } from 'lucide-vue-next';
import { u as useAuthStore } from './auth-CYHEneUG.mjs';
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
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const form = reactive({ email: "", password: "", confirmPassword: "" });
    const errors = reactive({ email: "", password: "", confirmPassword: "", terms: "" });
    const showPassword = ref(false);
    const showConfirm = ref(false);
    const agreeTerms = ref(false);
    const showSuccess = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_BrandLogo = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-db8f372b><div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl" data-v-db8f372b><div class="min-h-dvh bg-white lg:order-2 lg:min-h-0" data-v-db8f372b><div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8" data-v-db8f372b><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-db8f372b>\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</h1></div><div class="px-6 pt-6 pb-10 lg:px-8" data-v-db8f372b><form class="space-y-4" data-v-db8f372b><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>Email</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-db8f372b></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>\u041F\u0430\u0440\u043E\u043B\u044C</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="\u041C\u0438\u043D\u0438\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" autocomplete="new-password" required minlength="6" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-db8f372b><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-db8f372b>`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showConfirm) ? "text" : "password", unref(form).confirmPassword, null)}${ssrRenderAttr("type", unref(showConfirm) ? "text" : "password")} placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password }, "input-field pl-12 pr-12"])}" data-v-db8f372b><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-db8f372b>`);
      if (!unref(showConfirm)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).confirmPassword || "\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-db8f372b><div class="flex items-start gap-3" data-v-db8f372b><button class="${ssrRenderClass([unref(agreeTerms) ? "border-sber-green bg-sber-green" : "border-sber-gray-mid", "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2"])}" type="button" data-v-db8f372b>`);
      if (unref(agreeTerms)) {
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4 text-white" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><p class="text-sm leading-relaxed text-sber-gray" data-v-db8f372b> \u042F \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u044E\u0441\u044C \u0441 <span class="font-medium text-sber-green" data-v-db8f372b>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u043C \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435\u043C</span> \u0438 <span class="font-medium text-sber-green" data-v-db8f372b>\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</span></p></div>`);
      if (unref(errors).terms) {
        _push(`<p class="mt-2 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).terms)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="btn-primary" type="submit" data-v-db8f372b> \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442 </button></form>`);
      if (unref(showSuccess)) {
        _push(`<div class="mt-4 flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3" data-v-db8f372b>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 flex-shrink-0 text-sber-green" }, null, _parent));
        _push(`<p class="text-sm font-medium text-sber-green" data-v-db8f372b> \u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0441\u043E\u0437\u0434\u0430\u043D! \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0447\u0442\u0443 \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 text-center" data-v-db8f372b><span class="text-sm text-sber-gray" data-v-db8f372b>\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? </span>`);
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
      _push(`</div></div></div><div class="hidden lg:flex lg:flex-col lg:justify-between lg:bg-sber-gray-light lg:p-10" data-v-db8f372b><div data-v-db8f372b>`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "md",
        "show-name-from": "md"
      }, null, _parent));
      _push(`<h2 class="mt-4 text-4xl font-bold leading-tight text-sber-black" data-v-db8f372b>\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0430\u043C\u0438 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430, \u043D\u043E \u0438 \u0441 \u0434\u0435\u0441\u043A\u0442\u043E\u043F\u0430.</h2><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-db8f372b> \u0428\u0438\u0440\u043E\u043A\u0438\u0439 \u044D\u043A\u0440\u0430\u043D \u0442\u0435\u043F\u0435\u0440\u044C \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0443\u044E \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044E, \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u043E\u0437\u0434\u0443\u0445\u0430 \u043C\u0435\u0436\u0434\u0443 \u0431\u043B\u043E\u043A\u0430\u043C\u0438 \u0438 \u0431\u043E\u043B\u0435\u0435 \u0443\u0434\u043E\u0431\u043D\u044B\u0435 \u0444\u043E\u0440\u043C\u044B. </p></div><div class="space-y-3 rounded-[28px] bg-white p-6 shadow-card" data-v-db8f372b><div class="rounded-2xl bg-sber-green-light px-4 py-3" data-v-db8f372b><p class="text-xs uppercase tracking-wide text-sber-green" data-v-db8f372b>\u041F\u043E\u0441\u043B\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438</p><p class="mt-2 text-sm font-semibold text-sber-black" data-v-db8f372b>\u0421\u0440\u0430\u0437\u0443 \u043F\u043E\u043F\u0430\u0434\u0451\u0442\u0435 \u0432 \u0440\u0430\u0431\u043E\u0447\u0435\u0435 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0441 \u0437\u0430\u0434\u0430\u0447\u0430\u043C\u0438, \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0451\u043C \u0438 \u043C\u0430\u0442\u0440\u0438\u0446\u0435\u0439.</p></div><div class="rounded-2xl bg-sber-blue-light px-4 py-3" data-v-db8f372b><p class="text-xs uppercase tracking-wide text-sber-blue" data-v-db8f372b>\u0427\u0442\u043E \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u043E</p><p class="mt-2 text-sm font-semibold text-sber-black" data-v-db8f372b>\u0424\u043E\u0440\u043C\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u044E\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u0434\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438, \u0430 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u043E \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043D\u0430 \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u044D\u043A\u0440\u0430\u043D\u0430\u0445.</p></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db8f372b"]]);

export { register as default };
//# sourceMappingURL=register-_Cdn0OxB.mjs.map
