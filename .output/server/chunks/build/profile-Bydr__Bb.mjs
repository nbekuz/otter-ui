import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { ChevronLeft, Camera, Settings, ChevronRight, Crown, Image } from 'lucide-vue-next';
import { u as useAuthStore, b as useSettingsStore, e as useAppToast } from './server.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';

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
      var _a, _b;
      const a = authStore.profileFirstName.trim().charAt(0);
      const b = authStore.profileLastName.trim().charAt(0);
      if (a || b)
        return `${a}${b}`.toUpperCase();
      const n = ((_b = (_a = authStore.user) == null ? void 0 : _a.name) == null ? void 0 : _b.trim()) || "";
      return n.charAt(0).toUpperCase() || "U";
    });
    const premiumExpiresLabel = computed(() => {
      var _a;
      const expiresAt = (_a = authStore.user) == null ? void 0 : _a.premiumExpiresAt;
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
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="page-header-top bg-white px-4 pb-4 shadow-sm lg:px-6"><div class="flex items-center gap-3"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div><p class="text-xs text-sber-gray">\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p><h1 class="text-xl font-bold text-sber-black">\u041F\u0440\u043E\u0444\u0438\u043B\u044C</h1></div></div></div><div class="mx-auto w-full max-w-5xl px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-4 lg:px-6"><div class="space-y-4"><div class="rounded-[28px] bg-white p-5 shadow-sm"><div class="flex flex-col gap-5 sm:flex-row sm:items-center"><button class="relative self-start" type="button"><div class="${ssrRenderClass([((_a = unref(authStore).user) == null ? void 0 : _a.isPremium) ? "ring-2 ring-yellow-400 ring-offset-2" : "", "h-24 w-24 overflow-hidden rounded-[28px]"])}">`);
      if (!((_b = unref(authStore).user) == null ? void 0 : _b.avatar)) {
        _push(`<div class="flex h-full w-full items-center justify-center bg-sber-green"><span class="text-3xl font-bold text-white">${ssrInterpolate(unref(initials))}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="h-full w-full object-cover">`);
      }
      _push(`</div><div class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sber-green shadow-sm">`);
      _push(ssrRenderComponent(unref(Camera), { class: "h-4 w-4 text-white" }, null, _parent));
      _push(`</div></button><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h2 class="truncate text-2xl font-bold text-sber-black">${ssrInterpolate(((_c = unref(authStore).user) == null ? void 0 : _c.name) || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C")}</h2>`);
      if ((_d = unref(authStore).user) == null ? void 0 : _d.isPremium) {
        _push(`<span class="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700"> \u2B50 \u041F\u0420\u0415\u041C\u0418\u0423\u041C </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-1 truncate text-sm text-sber-gray">${ssrInterpolate((_e = unref(authStore).user) == null ? void 0 : _e.email)}</p>`);
      if (((_f = unref(authStore).user) == null ? void 0 : _f.isPremium) && unref(premiumExpiresLabel)) {
        _push(`<p class="mt-2 text-xs font-medium text-yellow-700"> \u0421\u0440\u043E\u043A \u0434\u043E ${ssrInterpolate(unref(premiumExpiresLabel))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 flex flex-wrap gap-3"><button class="rounded-2xl bg-sber-green px-4 py-2.5 text-sm font-semibold text-white" type="button"> \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043C\u044F </button><button class="rounded-2xl bg-sber-gray-light px-4 py-2.5 text-sm font-semibold text-sber-black" type="button"> \u0421\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C </button></div></div></div></div></div><div class="mt-4 space-y-4 lg:mt-0"><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p><div class="mt-3 space-y-3"><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Settings), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F</p><p class="text-xs text-sber-gray">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F, \u0437\u0432\u0443\u043A\u0438 \u0438 \u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Crown), { class: "h-5 w-5 text-yellow-500" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">Otter Premium</p><p class="text-xs text-sber-gray">\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0438 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button></div></div><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C</p><div class="mt-3 rounded-2xl border border-sber-gray-light p-4"><p class="text-sm font-semibold text-sber-black">\u0421\u0435\u0441\u0441\u0438\u044F \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435</p><p class="mt-1 text-xs leading-5 text-sber-gray"> \u041F\u0440\u0438 \u0432\u044B\u0445\u043E\u0434\u0435 \u0442\u043E\u043A\u0435\u043D\u044B \u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u0430 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B. </p></div><button class="mt-4 w-full rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white" type="button"> \u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 </button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-1 text-lg font-bold text-sber-black">\u0418\u043C\u044F \u0438 \u0444\u0430\u043C\u0438\u043B\u0438\u044F</h3><p class="mb-4 text-xs text-sber-gray">\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 API (multipart, \u043A\u0430\u043A \u0432 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438).</p><label class="mb-2 block text-sm font-medium text-sber-gray">\u0418\u043C\u044F</label><input${ssrRenderAttr("value", unref(editFirstName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).first }, "input-field mb-2"])}" placeholder="\u0418\u043C\u044F" autocomplete="given-name">`);
          if (unref(nameErrors).first) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(nameErrors).first)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<label class="mb-2 block text-sm font-medium text-sber-gray">\u0424\u0430\u043C\u0438\u043B\u0438\u044F</label><input${ssrRenderAttr("value", unref(editLastName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).last }, "input-field mb-2"])}" placeholder="\u0424\u0430\u043C\u0438\u043B\u0438\u044F" autocomplete="family-name">`);
          if (unref(nameErrors).last) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(nameErrors).last)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(nameSaving) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary w-full" type="button"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""}>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-2 text-lg font-bold text-sber-black">\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C</h3><p class="mb-4 text-xs text-sber-gray">\u041D\u043E\u0432\u044B\u0439: 8\u201320 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432, Aa + \u0446\u0438\u0444\u0440\u0430 + \u0441\u043F\u0435\u0446\u0441\u0438\u043C\u0432\u043E\u043B (!, @ \u2026).</p><input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full" type="button"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(passwordSaving) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary w-full" type="button"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""}>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-1 text-lg font-bold text-sber-black">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0430\u0432\u0430\u0442\u0430\u0440</h3><p class="mb-4 text-xs text-sber-gray">\u0424\u043E\u0442\u043E \u0441 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0438\u043B\u0438 \u0433\u043E\u0442\u043E\u0432\u044B\u0439 \u0448\u0430\u0431\u043B\u043E\u043D \u043D\u0438\u0436\u0435.</p><input type="file" accept="image/*" capture="environment" class="hidden"><input type="file" accept="image/*" class="hidden"><button class="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-sber-gray-light py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-mid/30 disabled:opacity-50" type="button"${ssrIncludeBooleanAttr(unref(avatarUploading)) ? " disabled" : ""}>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` ${ssrInterpolate(unref(avatarUploading) ? "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026" : "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0444\u043E\u0442\u043E")}</button><button class="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-sber-gray-light py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-mid/30 disabled:opacity-50" type="button"${ssrIncludeBooleanAttr(unref(avatarUploading)) ? " disabled" : ""}>`);
          _push2(ssrRenderComponent(unref(Image), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` \u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0433\u0430\u043B\u0435\u0440\u0435\u0438 </button>`);
          if (unref(avatarUploadError)) {
            _push2(`<p class="mb-3 text-xs text-red-500">${ssrInterpolate(unref(avatarUploadError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-secondary mt-1 w-full" type="button">\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        var _a2, _b2;
        if (unref(premiumModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6"><div class="text-center mb-4"><div class="mb-3 text-4xl">\u2B50</div><h3 class="text-xl font-bold text-sber-black">Otter Premium</h3></div>`);
          if (unref(settingsStore).premiumFeaturesLoading) {
            _push2(`<p class="mb-4 text-center text-sm text-sber-gray">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</p>`);
          } else {
            _push2(`<ul class="mb-4 max-h-40 space-y-2 overflow-y-auto text-sm text-sber-black"><!--[-->`);
            ssrRenderList(unref(settingsStore).premiumFeatures, (feat) => {
              _push2(`<li>\u2022 ${ssrInterpolate(feat.title)}</li>`);
            });
            _push2(`<!--]--></ul>`);
          }
          if (!((_a2 = unref(authStore).user) == null ? void 0 : _a2.isPremium)) {
            _push2(`<button class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(premiumCheckoutLoading)) ? " disabled" : ""}>${ssrInterpolate(unref(premiumCheckoutLoading) ? "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u043E\u043F\u043B\u0430\u0442\u0443\u2026" : "\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C Premium")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (!((_b2 = unref(authStore).user) == null ? void 0 : _b2.isPremium)) {
            _push2(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(unref(premiumActivateLoading)) ? " disabled" : ""}>${ssrInterpolate(unref(premiumActivateLoading) ? "\u0410\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u044F\u2026" : "\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C")}</button>`);
          } else {
            _push2(`<p class="text-center text-sm font-semibold text-sber-green">Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D</p>`);
          }
          _push2(`<button class="btn-secondary mt-3 w-full" type="button">\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5"><h3 class="text-lg font-bold text-sber-black">\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?</h3><p class="mt-2 text-sm text-sber-gray">\u0412\u044B \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0432\u043E\u0439\u0442\u0438 \u0441\u043D\u043E\u0432\u0430 \u0432 \u043B\u044E\u0431\u043E\u0439 \u043C\u043E\u043C\u0435\u043D\u0442.</p><button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white" type="button"> \u0412\u044B\u0439\u0442\u0438 </button><button class="btn-secondary mt-3" type="button">\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=profile-Bydr__Bb.mjs.map
