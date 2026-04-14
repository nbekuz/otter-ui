import { _ as __nuxt_component_1 } from "./nuxt-link-CVKuvMWS.js";
import { _ as _sfc_main$1 } from "./BrandLogo-Bb3oU9iv.js";
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel } from "vue/server-renderer";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, CheckCircle } from "lucide-vue-next";
import { u as useAuthStore } from "./auth-CYHEneUG.js";
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
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-db8f372b>Создать аккаунт</h1></div><div class="px-6 pt-6 pb-10 lg:px-8" data-v-db8f372b><form class="space-y-4" data-v-db8f372b><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>Email</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-db8f372b></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>Пароль</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="Минимум 6 символов" autocomplete="new-password" required minlength="6" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-db8f372b><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-db8f372b>`);
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
      _push(`</div><div data-v-db8f372b><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-db8f372b>Повторите пароль</label><div class="relative" data-v-db8f372b>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showConfirm) ? "text" : "password", unref(form).confirmPassword, null)}${ssrRenderAttr("type", unref(showConfirm) ? "text" : "password")} placeholder="Повторите пароль" autocomplete="new-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password }, "input-field pl-12 pr-12"])}" data-v-db8f372b><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-db8f372b>`);
      if (!unref(showConfirm)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).confirmPassword || unref(form).confirmPassword && unref(form).confirmPassword !== unref(form).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).confirmPassword || "Пароли не совпадают")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-db8f372b><div class="flex items-start gap-3" data-v-db8f372b><button class="${ssrRenderClass([unref(agreeTerms) ? "border-sber-green bg-sber-green" : "border-sber-gray-mid", "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2"])}" type="button" data-v-db8f372b>`);
      if (unref(agreeTerms)) {
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4 text-white" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button><p class="text-sm leading-relaxed text-sber-gray" data-v-db8f372b> Я соглашаюсь с <span class="font-medium text-sber-green" data-v-db8f372b>Пользовательским соглашением</span> и <span class="font-medium text-sber-green" data-v-db8f372b>Политикой конфиденциальности</span></p></div>`);
      if (unref(errors).terms) {
        _push(`<p class="mt-2 ml-1 text-xs text-red-500" data-v-db8f372b>${ssrInterpolate(unref(errors).terms)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="btn-primary" type="submit" data-v-db8f372b> Создать аккаунт </button></form>`);
      if (unref(showSuccess)) {
        _push(`<div class="mt-4 flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3" data-v-db8f372b>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 flex-shrink-0 text-sber-green" }, null, _parent));
        _push(`<p class="text-sm font-medium text-sber-green" data-v-db8f372b> Аккаунт создан! Проверьте почту для подтверждения. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 text-center" data-v-db8f372b><span class="text-sm text-sber-gray" data-v-db8f372b>Уже есть аккаунт? </span>`);
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
      _push(`</div></div></div><div class="hidden lg:flex lg:flex-col lg:justify-between lg:bg-sber-gray-light lg:p-10" data-v-db8f372b><div data-v-db8f372b>`);
      _push(ssrRenderComponent(_component_BrandLogo, {
        size: "md",
        "show-name-from": "md"
      }, null, _parent));
      _push(`<h2 class="mt-4 text-4xl font-bold leading-tight text-sber-black" data-v-db8f372b>Начните управлять задачами не только с телефона, но и с десктопа.</h2><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-db8f372b> Широкий экран теперь использует отдельную навигацию, больше воздуха между блоками и более удобные формы. </p></div><div class="space-y-3 rounded-[28px] bg-white p-6 shadow-card" data-v-db8f372b><div class="rounded-2xl bg-sber-green-light px-4 py-3" data-v-db8f372b><p class="text-xs uppercase tracking-wide text-sber-green" data-v-db8f372b>После регистрации</p><p class="mt-2 text-sm font-semibold text-sber-black" data-v-db8f372b>Сразу попадёте в рабочее пространство с задачами, календарём и матрицей.</p></div><div class="rounded-2xl bg-sber-blue-light px-4 py-3" data-v-db8f372b><p class="text-xs uppercase tracking-wide text-sber-blue" data-v-db8f372b>Что улучшено</p><p class="mt-2 text-sm font-semibold text-sber-black" data-v-db8f372b>Формы проверяют обязательные поля до отправки, а интерфейс аккуратно масштабируется на больших экранах.</p></div></div></div></div></div>`);
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
export {
  register as default
};
//# sourceMappingURL=register-_Cdn0OxB.js.map
