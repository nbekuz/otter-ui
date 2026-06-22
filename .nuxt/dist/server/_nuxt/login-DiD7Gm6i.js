import { _ as __nuxt_component_1 } from "./nuxt-link-B4h1IE6Y.js";
import { _ as _sfc_main$1 } from "./OtterCheckbox-DjcHwVCQ.js";
import { _ as _sfc_main$2 } from "./LegalAcceptanceText-Dy4o73JM.js";
import { _ as _sfc_main$3 } from "./SiteFooter-6gd8WARK.js";
import { defineComponent, reactive, ref, computed, mergeProps, withCtx, unref, createVNode, isRef, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderTeleport } from "vue/server-renderer";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-vue-next";
import { l as logoUrl } from "./logo-DVdZXLLs.js";
import { u as useAuthStore, a as useState, _ as _export_sfc } from "../server.mjs";
import "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "./legal-static-BmX3fG1z.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const metrics = ["планируйте", "контролируйте", "фокусируйтесь", "управляйте"];
    const form = reactive({ email: "", password: "" });
    const errors = reactive({ email: "", password: "" });
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const googleLoading = ref(false);
    const googleError = ref("");
    useState("loginPasswordResetToast", () => null);
    const pageToast = reactive({
      visible: false,
      message: ""
    });
    function onRememberToggle() {
      if (!rememberMe.value)
        ;
    }
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
      if (forgotLoading.value) return "Подождите...";
      if (forgotStep.value === "email") return "Отправить код";
      if (forgotStep.value === "code") return "Подтвердить код";
      return "Сохранить пароль";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_OtterCheckbox = _sfc_main$1;
      const _component_LegalAcceptanceText = _sfc_main$2;
      const _component_SiteFooter = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh flex-col bg-white md:px-2 lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-bdcd8abc><div class="flex flex-1 items-center justify-center" data-v-bdcd8abc><div class="w-full max-w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl" data-v-bdcd8abc><div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black" data-v-bdcd8abc><div data-v-bdcd8abc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" data-v-bdcd8abc${_scopeId}>`);
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
      _push(`<h1 class="mt-6 text-4xl font-bold leading-tight text-sber-black" data-v-bdcd8abc>Пару кликов, и задача готова. Ничего лишнего.</h1><p class="mt-4 max-w-md text-sm leading-7 text-sber-gray" data-v-bdcd8abc> Теперь еще удобнее для обзора задач, календаря и планов на день. </p></div><div class="rounded-[28px] bg-sber-gray-light p-5" data-v-bdcd8abc><p class="text-xs uppercase tracking-[0.2em] text-sber-gray" data-v-bdcd8abc>Что внутри</p><div class="relative mt-4 grid grid-cols-2 items-start gap-3" data-v-bdcd8abc><div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80" data-v-bdcd8abc></div><div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80" data-v-bdcd8abc></div><!--[-->`);
      ssrRenderList(metrics, (metric, index) => {
        _push(`<div class="${ssrRenderClass([{ "mt-7": index % 2 === 1 }, "relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"])}" data-v-bdcd8abc><p class="text-sm font-bold uppercase tracking-wide" data-v-bdcd8abc>${ssrInterpolate(metric)}</p></div>`);
      });
      _push(`<!--]--><div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95" data-v-bdcd8abc><div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm" data-v-bdcd8abc><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="h-8 w-8 brightness-0" data-v-bdcd8abc></div></div></div></div></div><div class="min-h-dvh bg-white lg:min-h-0" data-v-bdcd8abc><div class="page-header-top flex items-center px-4 pb-4 sm:px-6 lg:px-8 lg:pt-8" data-v-bdcd8abc><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" data-v-bdcd8abc>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-xl font-bold text-sber-black" data-v-bdcd8abc>Войти</h1></div><div class="flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8" data-v-bdcd8abc><p class="mb-8 text-sm leading-relaxed text-sber-gray" data-v-bdcd8abc> Введите данные вашей учётной записи для входа в Otter </p><form class="space-y-4" data-v-bdcd8abc><div data-v-bdcd8abc><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-bdcd8abc>Email</label><div class="relative" data-v-bdcd8abc>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="example@mail.ru" autocomplete="email" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).email }, "input-field pl-12"])}" data-v-bdcd8abc></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-bdcd8abc>${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-bdcd8abc><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-bdcd8abc>Пароль</label><div class="relative" data-v-bdcd8abc>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
      _push(`<input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="Введите пароль" autocomplete="current-password" required class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).password }, "input-field pl-12 pr-12"])}" data-v-bdcd8abc><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-bdcd8abc>`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      }
      _push(`</button></div>`);
      if (unref(errors).password) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-bdcd8abc>${ssrInterpolate(unref(errors).password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap items-center justify-between gap-3" data-v-bdcd8abc>`);
      _push(ssrRenderComponent(_component_OtterCheckbox, {
        modelValue: unref(rememberMe),
        "onUpdate:modelValue": [($event) => isRef(rememberMe) ? rememberMe.value = $event : null, onRememberToggle],
        align: "center",
        class: "min-w-0 flex-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="cursor-default select-none text-sm text-sber-black" data-v-bdcd8abc${_scopeId}>Запомнить</span>`);
          } else {
            return [
              createVNode("span", { class: "cursor-default select-none text-sm text-sber-black" }, "Запомнить")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="shrink-0 text-sm font-medium text-sber-green" type="button" data-v-bdcd8abc> Забыли пароль? </button></div><button class="btn-primary mx-auto block w-full sm:max-w-[320px]" type="submit" data-v-bdcd8abc> Войти </button></form><div class="my-6 text-center" data-v-bdcd8abc><span class="text-sm text-sber-gray" data-v-bdcd8abc>Нет аккаунта? </span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-sm font-semibold text-sber-green"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Создать`);
          } else {
            return [
              createTextVNode("Создать")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mb-6 flex items-center gap-4" data-v-bdcd8abc><div class="h-px flex-1 bg-sber-gray-mid" data-v-bdcd8abc></div><span class="text-sm text-sber-gray" data-v-bdcd8abc>или</span><div class="h-px flex-1 bg-sber-gray-mid" data-v-bdcd8abc></div></div>`);
      if (unref(googleError)) {
        _push(`<p class="mx-auto mb-2 max-w-full text-center text-xs text-red-500 sm:max-w-[320px]" data-v-bdcd8abc>${ssrInterpolate(unref(googleError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="mx-auto flex w-full max-w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-[320px]" type="button"${ssrIncludeBooleanAttr(unref(googleLoading)) ? " disabled" : ""} data-v-bdcd8abc><svg width="20" height="20" viewBox="0 0 24 24" data-v-bdcd8abc><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" data-v-bdcd8abc></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" data-v-bdcd8abc></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" data-v-bdcd8abc></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" data-v-bdcd8abc></path></svg> ${ssrInterpolate(unref(googleLoading) ? "Вход…" : "Войти через Google")}</button><div class="mt-8" data-v-bdcd8abc>`);
      _push(ssrRenderComponent(_component_LegalAcceptanceText, null, null, _parent));
      _push(`</div></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(pageToast).visible) {
          _push2(`<div class="fixed bottom-6 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-0" role="status" data-v-bdcd8abc><div class="flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3 shadow-lg" data-v-bdcd8abc>`);
          _push2(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 flex-shrink-0 text-sber-green" }, null, _parent));
          _push2(`<p class="text-sm font-medium text-sber-green" data-v-bdcd8abc>${ssrInterpolate(unref(pageToast).message)}</p></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showForgot)) {
          _push2(`<div class="overlay" data-v-bdcd8abc></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showForgot)) {
          _push2(`<form class="app-modal px-6 py-6" data-v-bdcd8abc><h3 class="mb-2 text-lg font-bold text-sber-black" data-v-bdcd8abc>Восстановление пароля</h3>`);
          if (unref(forgotStep) === "email") {
            _push2(`<!--[--><p class="mb-4 text-sm text-sber-gray" data-v-bdcd8abc> Введите email — мы отправим письмо с кодом (например: «ВАШ КОД 310696»). </p><div class="relative mb-2" data-v-bdcd8abc>`);
            _push2(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(forgotEmail))} type="email" placeholder="Email" autocomplete="email" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotError) }, "input-field pl-12"])}" data-v-bdcd8abc></div><!--]-->`);
          } else if (unref(forgotStep) === "code") {
            _push2(`<!--[--><p class="mb-2 text-sm text-sber-gray" data-v-bdcd8abc> Код отправлен на <span class="font-medium text-sber-black" data-v-bdcd8abc>${ssrInterpolate(unref(forgotEmail))}</span></p><p class="mb-3 text-xs text-sber-gray" data-v-bdcd8abc>Введите 6 цифр из письма (только код).</p><div class="relative mb-2" data-v-bdcd8abc>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(forgotCode))} type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotError) }, "input-field pl-12 tracking-widest"])}" data-v-bdcd8abc></div><button class="btn-secondary mb-3 w-full" type="button" data-v-bdcd8abc> Изменить email </button><!--]-->`);
          } else {
            _push2(`<!--[--><p class="mb-2 text-sm text-sber-gray" data-v-bdcd8abc> Новый пароль для <span class="font-medium text-sber-black" data-v-bdcd8abc>${ssrInterpolate(unref(forgotEmail))}</span></p><p class="mb-3 text-xs text-sber-gray" data-v-bdcd8abc>8–20 символов: заглавная и строчная латинские буквы, цифра и один специальный символ.</p><div class="relative mb-2" data-v-bdcd8abc>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderDynamicModel(unref(showForgotNewPw) ? "text" : "password", unref(forgotNewPassword), null)}${ssrRenderAttr("type", unref(showForgotNewPw) ? "text" : "password")} placeholder="Новый пароль" autocomplete="new-password" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotPwError) }, "input-field pl-12 pr-12"])}" data-v-bdcd8abc><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-bdcd8abc>`);
            if (!unref(showForgotNewPw)) {
              _push2(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            }
            _push2(`</button></div><div class="relative mb-2" data-v-bdcd8abc>`);
            _push2(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" }, null, _parent));
            _push2(`<input${ssrRenderDynamicModel(unref(showForgotConfirmPw) ? "text" : "password", unref(forgotConfirmPassword), null)}${ssrRenderAttr("type", unref(showForgotConfirmPw) ? "text" : "password")} placeholder="Повторите пароль" autocomplete="new-password" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(forgotPwError) }, "input-field pl-12 pr-12"])}" data-v-bdcd8abc><button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" data-v-bdcd8abc>`);
            if (!unref(showForgotConfirmPw)) {
              _push2(ssrRenderComponent(unref(Eye), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
            }
            _push2(`</button></div>`);
            if (unref(forgotPwError)) {
              _push2(`<p class="mb-2 ml-1 text-xs text-red-500" data-v-bdcd8abc>${ssrInterpolate(unref(forgotPwError))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          }
          if (unref(forgotError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-bdcd8abc>${ssrInterpolate(unref(forgotError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary w-full" type="submit"${ssrIncludeBooleanAttr(unref(forgotLoading)) ? " disabled" : ""} data-v-bdcd8abc>${ssrInterpolate(unref(forgotSubmitLabel))}</button><button class="btn-secondary mt-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(forgotLoading)) ? " disabled" : ""} data-v-bdcd8abc> Отмена </button></form>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_SiteFooter, null, null, _parent));
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
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bdcd8abc"]]);
export {
  login as default
};
//# sourceMappingURL=login-DiD7Gm6i.js.map
