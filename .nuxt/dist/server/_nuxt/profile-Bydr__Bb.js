import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { ChevronLeft, Camera, Settings, ChevronRight, Crown, Image } from "lucide-vue-next";
import { u as useAuthStore, b as useSettingsStore, e as useAppToast } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    useAppToast();
    const nameModal = ref(false);
    const passwordModal = ref(false);
    const avatarModal = ref(false);
    const premiumModal = ref(false);
    const premiumCheckoutLoading = ref(false);
    const premiumActivateLoading = ref(false);
    const showLogout = ref(false);
    ref(null);
    ref(null);
    const avatarUploading = ref(false);
    const avatarUploadError = ref("");
    const editFirstName = ref("");
    const editLastName = ref("");
    const nameErrors = reactive({ first: "", last: "" });
    const nameSaving = ref(false);
    const passwordSaving = ref(false);
    const passwordForm = reactive({
      next: "",
      confirm: ""
    });
    const passwordErrors = reactive({
      next: "",
      confirm: ""
    });
    const initials = computed(() => {
      const a = authStore.profileFirstName.trim().charAt(0);
      const b = authStore.profileLastName.trim().charAt(0);
      if (a || b)
        return `${a}${b}`.toUpperCase();
      const n = authStore.user?.name?.trim() || "";
      return n.charAt(0).toUpperCase() || "U";
    });
    const premiumExpiresLabel = computed(() => {
      const expiresAt = authStore.user?.premiumExpiresAt;
      if (!expiresAt) return "";
      const date = new Date(expiresAt);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    });
    watch(premiumModal, (open) => {
      if (open) void settingsStore.fetchPremiumFeatures();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="page-header-top bg-white px-4 pb-4 shadow-sm lg:px-6"><div class="flex items-center gap-3"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div><p class="text-xs text-sber-gray">Аккаунт</p><h1 class="text-xl font-bold text-sber-black">Профиль</h1></div></div></div><div class="mx-auto w-full max-w-5xl px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-4 lg:px-6"><div class="space-y-4"><div class="rounded-[28px] bg-white p-5 shadow-sm"><div class="flex flex-col gap-5 sm:flex-row sm:items-center"><button class="relative self-start" type="button"><div class="${ssrRenderClass([unref(authStore).user?.isPremium ? "ring-2 ring-yellow-400 ring-offset-2" : "", "h-24 w-24 overflow-hidden rounded-[28px]"])}">`);
      if (!unref(authStore).user?.avatar) {
        _push(`<div class="flex h-full w-full items-center justify-center bg-sber-green"><span class="text-3xl font-bold text-white">${ssrInterpolate(unref(initials))}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="h-full w-full object-cover">`);
      }
      _push(`</div><div class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sber-green shadow-sm">`);
      _push(ssrRenderComponent(unref(Camera), { class: "h-4 w-4 text-white" }, null, _parent));
      _push(`</div></button><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h2 class="truncate text-2xl font-bold text-sber-black">${ssrInterpolate(unref(authStore).user?.name || "Пользователь")}</h2>`);
      if (unref(authStore).user?.isPremium) {
        _push(`<span class="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700"> ⭐ ПРЕМИУМ </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-1 truncate text-sm text-sber-gray">${ssrInterpolate(unref(authStore).user?.email)}</p>`);
      if (unref(authStore).user?.isPremium && unref(premiumExpiresLabel)) {
        _push(`<p class="mt-2 text-xs font-medium text-yellow-700"> Срок до ${ssrInterpolate(unref(premiumExpiresLabel))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 flex flex-wrap gap-3"><button class="rounded-2xl bg-sber-green px-4 py-2.5 text-sm font-semibold text-white" type="button"> Изменить имя </button><button class="rounded-2xl bg-sber-gray-light px-4 py-2.5 text-sm font-semibold text-sber-black" type="button"> Сменить пароль </button></div></div></div></div></div><div class="mt-4 space-y-4 lg:mt-0"><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Аккаунт</p><div class="mt-3 space-y-3"><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Settings), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">Настройки приложения</p><p class="text-xs text-sber-gray">Уведомления, звуки и видимые разделы</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Crown), { class: "h-5 w-5 text-yellow-500" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">Otter Premium</p><p class="text-xs text-sber-gray">Расширенные возможности и синхронизация</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button></div></div><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Безопасность</p><div class="mt-3 rounded-2xl border border-sber-gray-light p-4"><p class="text-sm font-semibold text-sber-black">Сессия на этом устройстве</p><p class="mt-1 text-xs leading-5 text-sber-gray"> При выходе токены и локальные данные входа на этом устройстве будут удалены. </p></div><button class="mt-4 w-full rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white" type="button"> Выйти из аккаунта </button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-1 text-lg font-bold text-sber-black">Имя и фамилия</h3><p class="mb-4 text-xs text-sber-gray">Сохранение через API (multipart, как в документации).</p><label class="mb-2 block text-sm font-medium text-sber-gray">Имя</label><input${ssrRenderAttr("value", unref(editFirstName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).first }, "input-field mb-2"])}" placeholder="Имя" autocomplete="given-name">`);
          if (unref(nameErrors).first) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(nameErrors).first)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<label class="mb-2 block text-sm font-medium text-sber-gray">Фамилия</label><input${ssrRenderAttr("value", unref(editLastName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).last }, "input-field mb-2"])}" placeholder="Фамилия" autocomplete="family-name">`);
          if (unref(nameErrors).last) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(nameErrors).last)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(nameSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full" type="button"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""}>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(passwordModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(passwordModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-2 text-lg font-bold text-sber-black">Сменить пароль</h3><p class="mb-4 text-xs text-sber-gray">Новый: 8–20 символов, Aa + цифра + спецсимвол (!, @ …).</p><input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="Новый пароль" required>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="Повторите новый пароль" required>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(passwordSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full" type="button"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""}>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(avatarModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(avatarModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-1 text-lg font-bold text-sber-black">Выберите аватар</h3><p class="mb-4 text-xs text-sber-gray">Фото с устройства или готовый шаблон ниже.</p><input type="file" accept="image/*" capture="environment" class="hidden"><input type="file" accept="image/*" class="hidden"><button class="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-sber-gray-light py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-mid/30 disabled:opacity-50" type="button"${ssrIncludeBooleanAttr(unref(avatarUploading)) ? " disabled" : ""}>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` ${ssrInterpolate(unref(avatarUploading) ? "Загрузка…" : "Сделать фото")}</button><button class="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-sber-gray-light py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-mid/30 disabled:opacity-50" type="button"${ssrIncludeBooleanAttr(unref(avatarUploading)) ? " disabled" : ""}>`);
          _push2(ssrRenderComponent(unref(Image), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` Выбрать из галереи </button>`);
          if (unref(avatarUploadError)) {
            _push2(`<p class="mb-3 text-xs text-red-500">${ssrInterpolate(unref(avatarUploadError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-secondary mt-1 w-full" type="button">Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(premiumModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6"><div class="text-center mb-4"><div class="mb-3 text-4xl">⭐</div><h3 class="text-xl font-bold text-sber-black">Otter Premium</h3></div>`);
          if (unref(settingsStore).premiumFeaturesLoading) {
            _push2(`<p class="mb-4 text-center text-sm text-sber-gray">Загрузка…</p>`);
          } else {
            _push2(`<ul class="mb-4 max-h-40 space-y-2 overflow-y-auto text-sm text-sber-black"><!--[-->`);
            ssrRenderList(unref(settingsStore).premiumFeatures, (feat) => {
              _push2(`<li>• ${ssrInterpolate(feat.title)}</li>`);
            });
            _push2(`<!--]--></ul>`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(premiumCheckoutLoading)) ? " disabled" : ""}>${ssrInterpolate(unref(premiumCheckoutLoading) ? "Открываем оплату…" : "Оплатить Premium")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(unref(premiumActivateLoading)) ? " disabled" : ""}>${ssrInterpolate(unref(premiumActivateLoading) ? "Активация…" : "Я оплатил — активировать")}</button>`);
          } else {
            _push2(`<p class="text-center text-sm font-semibold text-sber-green">Premium активен</p>`);
          }
          _push2(`<button class="btn-secondary mt-3 w-full" type="button">Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showLogout)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showLogout)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black">Выйти из аккаунта?</h3><p class="mt-2 text-sm text-sber-gray">Вы сможете войти снова в любой момент.</p><button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white" type="button"> Выйти </button><button class="btn-secondary mt-3" type="button">Отмена</button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=profile-Bydr__Bb.js.map
