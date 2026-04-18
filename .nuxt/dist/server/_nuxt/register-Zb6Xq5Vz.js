import { _ as __nuxt_component_1 } from "./nuxt-link-CVKuvMWS.js";
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrRenderList } from "vue/server-renderer";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, CheckCircle } from "lucide-vue-next";
import { l as logoUrl } from "./logo-DVdZXLLs.js";
import { u as useAuthStore } from "./auth-B8mCgdTo.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const metrics = ["планируйте", "контролируйте", "фокусируйтесь", "управляйте"];
    const form = reactive({ email: "", password: "", confirmPassword: "" });
    const errors = reactive({ email: "", password: "", confirmPassword: "", terms: "" });
    const showPassword = ref(false);
    const showConfirm = ref(false);
    const agreeTerms = ref(false);
    const showSuccess = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-73356b4f><div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl" data-v-73356b4f><div class="min-h-dvh bg-white lg:order-2 lg:min-h-0" data-v-73356b4f><div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8" data-v-73356b4f><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" data-v-73356b4f>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-73356b4f>Создать аккаунт</h1></div><div class="px-6 pt-6 pb-10 lg:px-8" data-v-73356b4f><form class="space-y-4" novalidate data-v-73356b4f><div data-v-73356b4f><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-73356b4f>Email</label><div class="relative" data-v-73356b4f>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-73356b4f></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-73356b4f>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-73356b4f><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-73356b4f>Пароль</label><div class="relative" data-v-73356b4f>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="Минимум 6 символов" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-73356b4f><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-73356b4f>`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-73356b4f>${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-73356b4f><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-73356b4f>Повторите пароль</label><div class="relative" data-v-73356b4f>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showConfirm) ? "text" : "password", unref(form).confirmPassword, null)}${ssrRenderAttr("type", unref(showConfirm) ? "text" : "password")} placeholder="Повторите пароль" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password }, "input-field pl-12 pr-12"])}" data-v-73356b4f><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-73356b4f>`);
      if (!unref(showConfirm)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-73356b4f>${ssrInterpolate(unref(errors).confirmPassword || "Пароли не совпадают")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-73356b4f><div class="flex items-start gap-3" data-v-73356b4f><button class="${ssrRenderClass([unref(agreeTerms) ? "border-sber-green bg-sber-green" : "border-sber-gray-mid", "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2"])}" type="button" data-v-73356b4f>`);
      if (unref(agreeTerms)) {
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4 text-white" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><p class="text-sm leading-relaxed text-sber-gray" data-v-73356b4f> Я соглашаюсь с <span class="font-medium text-sber-green" data-v-73356b4f>Пользовательским соглашением</span> и <span class="font-medium text-sber-green" data-v-73356b4f>Политикой конфиденциальности</span></p></div>`);
      if (unref(errors).terms) {
        _push(`<p class="mt-2 ml-1 text-xs text-red-500" data-v-73356b4f>${ssrInterpolate(unref(errors).terms)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-full flex lg:justify-center items-center" data-v-73356b4f><button class="btn-primary lg:max-w-[360px]" type="submit" data-v-73356b4f> Создать аккаунт </button></div></form>`);
      if (unref(showSuccess)) {
        _push(`<div class="mt-4 flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3" data-v-73356b4f>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 flex-shrink-0 text-sber-green" }, null, _parent));
        _push(`<p class="text-sm font-medium text-sber-green" data-v-73356b4f> Аккаунт создан! Проверьте почту для подтверждения. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 text-center lg:mx-auto lg:max-w-[360px]" data-v-73356b4f><span class="text-sm text-sber-gray" data-v-73356b4f>Уже есть аккаунт? </span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-sm font-semibold text-sber-green"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Войти`);
          } else {
            return [
              createTextVNode("Войти")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black" data-v-73356b4f><div data-v-73356b4f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" data-v-73356b4f${_scopeId}>`);
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
      _push(`<h2 class="mt-6 text-4xl font-bold leading-tight text-sber-black" data-v-73356b4f>Пару кликов, и задача готова. Ничего лишнего.</h2><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-73356b4f> Теперь еще удобнее для обзора задач, календаря и планов на день. </p></div><div class="rounded-[28px] bg-sber-gray-light p-5" data-v-73356b4f><p class="text-xs uppercase tracking-[0.2em] text-sber-gray" data-v-73356b4f>Что внутри</p><div class="relative mt-4 grid grid-cols-2 items-start gap-3" data-v-73356b4f><div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80" data-v-73356b4f></div><div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80" data-v-73356b4f></div><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "mt-7": index % 2 === 1 }, "relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"])}" data-v-73356b4f><p class="text-sm font-bold uppercase tracking-wide" data-v-73356b4f>${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95" data-v-73356b4f><div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm" data-v-73356b4f><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0" data-v-73356b4f></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-73356b4f"]]);
export {
  register as default
};
//# sourceMappingURL=register-Zb6Xq5Vz.js.map
