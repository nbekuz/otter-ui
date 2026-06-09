import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrRenderSlot } from 'vue/server-renderer';
import { CheckSquare, Calendar, Grid2x2, Timer, Settings, Camera, ChevronRight, User, Info, Lock, Smartphone, Crown, GripVertical, Sun, Moon, Paintbrush, Clock, Download, Bell, Vibrate, Volume2, CheckCircle, Globe, HelpCircle, FileText, Share2, MessageSquareText, Check, Image, Star } from 'lucide-vue-next';
import { _ as _export_sfc, u as useAuthStore, b as useSettingsStore, e as useAppToast, d as useRoute, n as navigateTo, s as soundOptions, q as getApiErrorMessage } from './server.mjs';
import { _ as _sfc_main$2 } from './BrandLogo-BjHNx0bu.mjs';
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
import './logo-DVdZXLLs.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Row",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    labelClass: {}
  },
  emits: ["click"],
  setup(__props) {
    const settingsStore = useSettingsStore();
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["w-full flex items-center px-4 py-3.5 border-b border-sber-gray-light last:border-0 transition-colors", unref(isDarkTheme) ? "active:bg-[#20242d]" : "active:bg-sber-gray-light"]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
        _push(`<div class="w-5 h-5 mr-3"></div>`);
      }, _push, _parent);
      _push(`<span class="${ssrRenderClass([__props.labelClass || "text-sber-black", "text-sm font-medium flex-1 text-left"])}">${ssrInterpolate(__props.label)}</span>`);
      if (__props.value) {
        _push(`<span class="text-xs text-sber-gray mr-2">${ssrInterpolate(__props.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(ChevronRight), {
        class: ["w-4 h-4 flex-shrink-0", unref(isDarkTheme) ? "text-slate-500" : "text-sber-gray-mid"]
      }, null, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/settings/Row.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const { showToast } = useAppToast();
    const nameModal = ref(false);
    const passwordModal = ref(false);
    const premiumModal = ref(false);
    const soundModal = ref(null);
    const languageModal = ref(false);
    const contactModal = ref(false);
    const aboutModal = ref(false);
    const premiumCheckoutLoading = ref(false);
    const premiumActivateLoading = ref(false);
    const contactSending = ref(false);
    ref(null);
    const avatarModal = ref(false);
    const avatarSettingsError = ref("");
    ref(null);
    ref(null);
    ref(null);
    const showLogout = ref(false);
    const comingSoonVisible = ref(false);
    const editFirstName = ref("");
    const editLastName = ref("");
    const nameErrors = reactive({ first: "", last: "" });
    const nameSaving = ref(false);
    const passwordSaving = ref(false);
    const selectedLanguage = ref(settingsStore.appSettings.language || "ru");
    ref(null);
    const contactMessage = ref("");
    const contactScreenshotName = ref("");
    const passwordForm = reactive({
      next: "",
      confirm: ""
    });
    const passwordErrors = reactive({
      next: "",
      confirm: ""
    });
    const languages = [
      { id: "ru", label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }
    ];
    const bottomMenuCatalog = [
      { id: "tasks", label: "\u0417\u0430\u0434\u0430\u0447\u0438", icon: CheckSquare },
      { id: "calendar", label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C", icon: Calendar },
      { id: "matrix", label: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430", icon: Grid2x2 },
      { id: "pomodoro", label: "\u041F\u043E\u043C\u043E\u0434\u043E\u0440\u043E", icon: Timer },
      { id: "settings", label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", icon: Settings }
    ];
    const orderedBottomMenuItems = computed(() => {
      const enabled = settingsStore.appSettings.bottomNavItems || [];
      const byId = new Map(bottomMenuCatalog.map((item) => [item.id, item]));
      const ordered = enabled.map((id) => byId.get(id)).filter(Boolean);
      const rest = bottomMenuCatalog.filter((item) => !enabled.includes(item.id));
      return [...ordered, ...rest];
    });
    const selectedLanguageLabel = computed(
      () => {
        var _a;
        return ((_a = languages.find((l) => l.id === selectedLanguage.value)) == null ? void 0 : _a.label) || "\u0420\u0443\u0441\u0441\u043A\u0438\u0439";
      }
    );
    const route = useRoute();
    watch(
      () => route.query.openContact,
      (value) => {
        if (value === "1") contactModal.value = true;
      },
      { immediate: true }
    );
    watch(
      () => route.query.openPremium,
      (value) => {
        if (value === "1") premiumModal.value = true;
      },
      { immediate: true }
    );
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const profileFullNameDisplay = computed(() => {
      var _a;
      const raw = `${authStore.profileFirstName || ""} ${authStore.profileLastName || ""}`.trim();
      return raw || ((_a = authStore.user) == null ? void 0 : _a.name) || "\u2014";
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
    const taskGroups = [
      { id: "overdue", label: "\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E", color: "#FF3B30" },
      { id: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", color: "#FF9500" },
      { id: "tomorrow", label: "\u0417\u0430\u0432\u0442\u0440\u0430", color: "#007AFF" },
      { id: "later", label: "\u041F\u043E\u0437\u0436\u0435", color: "#AF52DE" },
      { id: "nodate", label: "\u0411\u0435\u0437 \u0441\u0440\u043E\u043A\u0430", color: "#8E8E93" },
      { id: "completed", label: "\u0413\u043E\u0442\u043E\u0432\u043E", color: "#21A038" }
    ];
    function showComingSoon() {
      comingSoonVisible.value = true;
      setTimeout(() => {
        comingSoonVisible.value = false;
      }, 2500);
    }
    function openAvatarModal() {
      avatarSettingsError.value = "";
      avatarModal.value = true;
    }
    function shareApp() {
      if ((void 0).share) {
        (void 0).share({ title: "Otter - \u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A", url: (void 0).location.origin });
      } else {
        showComingSoon();
      }
    }
    function openNameModal() {
      var _a, _b;
      nameErrors.first = "";
      nameErrors.last = "";
      editFirstName.value = authStore.profileFirstName.trim();
      editLastName.value = authStore.profileLastName.trim();
      if ((!editFirstName.value || !editLastName.value) && ((_b = (_a = authStore.user) == null ? void 0 : _a.name) == null ? void 0 : _b.trim())) {
        const parts = authStore.user.name.trim().split(/\s+/).filter(Boolean);
        if (!editFirstName.value) editFirstName.value = parts[0] || "";
        if (!editLastName.value) editLastName.value = parts.slice(1).join(" ");
      }
      nameModal.value = true;
    }
    async function runStubAction() {
      try {
        const detail = await settingsStore.callStubAction();
        showToast(detail, "success");
      } catch (err) {
        showToast(getApiErrorMessage(err), "error");
      }
    }
    watch(premiumModal, (open) => {
      if (open) void settingsStore.fetchPremiumFeatures();
    });
    function getSound(soundId) {
      var _a;
      return ((_a = soundOptions.find((s) => s.id === soundId)) == null ? void 0 : _a.name) || "";
    }
    function getCurrentSound(modal) {
      if (modal === "notification") return settingsStore.appSettings.notificationSound;
      return settingsStore.appSettings.completionSound;
    }
    function isBottomMenuEnabled(itemId) {
      return settingsStore.appSettings.bottomNavItems.includes(itemId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const _component_SettingsRow = _sfc_main$1;
      const _component_BrandLogo = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))} data-v-cdf68cb8><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "page-header-top px-4 pb-4"])}" data-v-cdf68cb8><div class="flex items-center justify-between" data-v-cdf68cb8><h1 class="text-xl font-bold text-sber-black" data-v-cdf68cb8>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h1><button class="text-sm font-semibold text-red-500" data-v-cdf68cb8> \u0412\u044B\u0439\u0442\u0438 </button></div></div><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"])}" data-v-cdf68cb8><div class="flex items-center gap-4" data-v-cdf68cb8><div class="relative" data-v-cdf68cb8><div class="${ssrRenderClass([((_a = unref(authStore).user) == null ? void 0 : _a.isPremium) ? "ring-2 ring-yellow-400 ring-offset-2" : "", "w-16 h-16 rounded-full overflow-hidden"])}" data-v-cdf68cb8>`);
      if (!((_b = unref(authStore).user) == null ? void 0 : _b.avatar)) {
        _push(`<div class="w-full h-full bg-sber-green flex items-center justify-center" data-v-cdf68cb8><span class="text-white text-2xl font-bold" data-v-cdf68cb8>${ssrInterpolate(((_e = (_d = (_c = unref(authStore).user) == null ? void 0 : _c.name) == null ? void 0 : _d[0]) == null ? void 0 : _e.toUpperCase()) || "A")}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover" data-v-cdf68cb8>`);
      }
      _push(`</div><div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full flex items-center justify-center" data-v-cdf68cb8>`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-3 h-3 text-white" }, null, _parent));
      _push(`</div></div><div class="min-w-0 flex-1" data-v-cdf68cb8><div class="flex items-center gap-2" data-v-cdf68cb8><p class="truncate text-base font-bold text-sber-black" data-v-cdf68cb8>${ssrInterpolate((_f = unref(authStore).user) == null ? void 0 : _f.name)}</p>`);
      if ((_g = unref(authStore).user) == null ? void 0 : _g.isPremium) {
        _push(`<span class="shrink-0 text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full" data-v-cdf68cb8> \u2B50 \u041F\u0420\u0415\u041C\u0418\u0423\u041C </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="truncate text-sm text-sber-gray" data-v-cdf68cb8>${ssrInterpolate((_h = unref(authStore).user) == null ? void 0 : _h.email)}</p>`);
      if (((_i = unref(authStore).user) == null ? void 0 : _i.isPremium) && unref(premiumExpiresLabel)) {
        _push(`<p class="mt-1 text-xs font-medium text-yellow-700" data-v-cdf68cb8> \u0421\u0440\u043E\u043A \u0434\u043E ${ssrInterpolate(unref(premiumExpiresLabel))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15" : "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100", "mt-3 w-full rounded-xl border px-3 py-2 text-left transition-colors"])}" data-v-cdf68cb8><p class="text-[10px] font-semibold uppercase tracking-wide text-yellow-600" data-v-cdf68cb8>Premium</p><p class="mt-0.5 text-xs font-semibold text-sber-black" data-v-cdf68cb8>${ssrInterpolate(((_j = unref(authStore).user) == null ? void 0 : _j.isPremium) ? "Premium \u0430\u043A\u0442\u0438\u0432\u0435\u043D" : "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C Premium")}</p></button></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-gray-mid flex-shrink-0" }, null, _parent));
      _push(`</div></button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0418\u043C\u044F",
        value: unref(profileFullNameDisplay),
        onClick: openNameModal
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(User), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(User), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0410\u0432\u0430\u0442\u0430\u0440",
        onClick: openAvatarModal
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Camera), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Camera), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/app/profile")
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Info), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Info), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u041F\u0430\u0440\u043E\u043B\u044C",
        onClick: ($event) => passwordModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Lock), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Lock), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
        onClick: runStubAction
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Smartphone), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Smartphone), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u041F\u0440\u0435\u043C\u0438\u0443\u043C",
        "label-class": "text-yellow-600",
        onClick: ($event) => premiumModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Crown), { class: "w-5 h-5 text-yellow-500 mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Crown), { class: "w-5 h-5 text-yellow-500 mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u041D\u0438\u0436\u043D\u0435\u0435 \u043C\u0435\u043D\u044E</p><p class="px-4 pb-2 text-xs text-sber-gray" data-v-cdf68cb8>\u0412\u043A\u043B\u044E\u0447\u0430\u0439\u0442\u0435 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \u0438 \u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435\u043C.</p><!--[-->`);
      ssrRenderList(unref(orderedBottomMenuItems), (item) => {
        _push(`<div class="flex items-center gap-3 px-4 py-3 border-b border-sber-gray-light last:border-0" draggable="true" data-v-cdf68cb8>`);
        _push(ssrRenderComponent(unref(GripVertical), { class: "w-4 h-4 text-sber-gray cursor-grab" }, null, _parent));
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-sber-gray" }, null), _parent);
        _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-cdf68cb8>${ssrInterpolate(item.label)}</span>`);
        if (item.id === "settings") {
          _push(`<span class="text-xs font-medium text-sber-gray" data-v-cdf68cb8>\u0412\u0441\u0435\u0433\u0434\u0430</span>`);
        } else {
          _push(`<button class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-cdf68cb8><div class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-cdf68cb8></div></button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435</p><div class="border-b border-sber-gray-light px-4 py-4" data-v-cdf68cb8><div class="flex items-start gap-3" data-v-cdf68cb8><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black"])}" data-v-cdf68cb8>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-cdf68cb8><div class="flex flex-wrap items-center gap-2" data-v-cdf68cb8><p class="text-sm font-semibold text-sber-black" data-v-cdf68cb8>\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0442\u0435\u043C\u044B</p><span class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue-light text-sber-blue" : "bg-sber-green-light text-sber-green", "rounded-full px-2 py-0.5 text-[11px] font-semibold"])}" data-v-cdf68cb8>${ssrInterpolate(unref(isDarkTheme) ? "Dark" : "Light")}</span></div><p class="mt-1 text-xs leading-5 text-sber-gray" data-v-cdf68cb8> \u0418\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435. </p><div class="mt-3 flex flex-wrap items-center gap-3" data-v-cdf68cb8><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white", "group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"])}" data-v-cdf68cb8><span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-v-cdf68cb8></span><span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" data-v-cdf68cb8>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</span></button><button type="button" class="${ssrRenderClass([!unref(isDarkTheme) ? "bg-sber-green text-white" : "bg-[#20242d] text-slate-300", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-cdf68cb8> \u0421\u0432\u0435\u0442\u043B\u0430\u044F </button><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue text-white" : "bg-sber-gray-light text-sber-gray", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-cdf68cb8> \u0422\u0451\u043C\u043D\u0430\u044F </button></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0412\u0438\u0434",
        onClick: runStubAction
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Paintbrush), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Paintbrush), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
        onClick: runStubAction
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Clock), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Clock), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 \u0438 \u0438\u043C\u043F\u043E\u0440\u0442",
        onClick: runStubAction
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Download), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Download), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u0417\u0432\u0443\u043A\u0438 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</p><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-cdf68cb8>`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-cdf68cb8>\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-cdf68cb8><div class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-cdf68cb8></div></button></div><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-cdf68cb8>`);
      _push(ssrRenderComponent(unref(Vibrate), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-cdf68cb8>\u0412\u0438\u0431\u0440\u0430\u0446\u0438\u044F</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-cdf68cb8><div class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-cdf68cb8></div></button></div>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0417\u0432\u0443\u043A \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
        value: getSound(unref(settingsStore).appSettings.notificationSound),
        onClick: ($event) => soundModal.value = "notification"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Volume2), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Volume2), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0417\u0432\u0443\u043A \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
        value: getSound(unref(settingsStore).appSettings.completionSound),
        onClick: ($event) => soundModal.value = "completion"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(CheckCircle), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u0420\u0430\u0437\u0434\u0435\u043B\u044B \u0441\u043F\u0438\u0441\u043A\u0430 \u0437\u0430\u0434\u0430\u0447</p><!--[-->`);
      ssrRenderList(taskGroups, (group) => {
        _push(`<div class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0" data-v-cdf68cb8><div class="w-3 h-3 rounded-full mr-3" style="${ssrRenderStyle({ backgroundColor: group.color })}" data-v-cdf68cb8></div><span class="text-sm font-medium text-sber-black flex-1" data-v-cdf68cb8>${ssrInterpolate(group.label)}</span><button class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-cdf68cb8><div class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-cdf68cb8></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u041E\u0431\u0449\u0435\u0435</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u042F\u0437\u044B\u043A",
        value: unref(selectedLanguageLabel),
        onClick: ($event) => languageModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Globe), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Globe), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-cdf68cb8><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-cdf68cb8>\u041F\u043E\u043C\u043E\u0449\u044C \u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0427\u0430\u0441\u0442\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B (FAQ)",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/app/faq")
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(HelpCircle), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(HelpCircle), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/app/legal")
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(FileText), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(FileText), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u0442\u044C \u0434\u0440\u0443\u0437\u044C\u044F\u043C",
        onClick: shareApp
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Share2), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Share2), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043D\u0430\u043C",
        onClick: ($event) => contactModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MessageSquareText), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(MessageSquareText), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "\u041E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
        onClick: ($event) => aboutModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Info), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Info), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="h-8" data-v-cdf68cb8></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold mb-4" data-v-cdf68cb8>\u0418\u043C\u044F \u0438 \u0444\u0430\u043C\u0438\u043B\u0438\u044F</h3><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-cdf68cb8>\u0418\u043C\u044F</label><input${ssrRenderAttr("value", unref(editFirstName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).first }, "input-field mb-2"])}" placeholder="\u0418\u043C\u044F" data-v-cdf68cb8>`);
          if (unref(nameErrors).first) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-cdf68cb8>${ssrInterpolate(unref(nameErrors).first)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<label class="mb-2 block text-sm font-medium text-sber-gray" data-v-cdf68cb8>\u0424\u0430\u043C\u0438\u043B\u0438\u044F</label><input${ssrRenderAttr("value", unref(editLastName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).last }, "input-field mb-2"])}" placeholder="\u0424\u0430\u043C\u0438\u043B\u0438\u044F" data-v-cdf68cb8>`);
          if (unref(nameErrors).last) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-cdf68cb8>${ssrInterpolate(unref(nameErrors).last)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-cdf68cb8>${ssrInterpolate(unref(nameSaving) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-cdf68cb8>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(passwordModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(passwordModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold mb-2" data-v-cdf68cb8>\u041F\u0430\u0440\u043E\u043B\u044C</h3><p class="mb-4 text-xs text-sber-gray" data-v-cdf68cb8>\u041D\u043E\u0432\u044B\u0439: 8\u201320 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432, Aa + \u0446\u0438\u0444\u0440\u0430 + \u0441\u043F\u0435\u0446\u0441\u0438\u043C\u0432\u043E\u043B (!, @ \u2026).</p><input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required data-v-cdf68cb8>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-cdf68cb8>${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required data-v-cdf68cb8>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-cdf68cb8>${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-cdf68cb8>${ssrInterpolate(unref(passwordSaving) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-cdf68cb8>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        var _a2, _b2, _c2;
        if (unref(premiumModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6" data-v-cdf68cb8><div class="text-center mb-6" data-v-cdf68cb8><div class="text-4xl mb-3" data-v-cdf68cb8>\u2B50</div><h3 class="text-xl font-bold text-sber-black" data-v-cdf68cb8>Otter Premium</h3><p class="text-sm text-sber-gray mt-1" data-v-cdf68cb8>\u0411\u043E\u043B\u044C\u0448\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0439 \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438</p></div>`);
          if (unref(settingsStore).premiumFeaturesLoading) {
            _push2(`<p class="mb-4 text-center text-sm text-sber-gray" data-v-cdf68cb8> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0435\u0439\u2026 </p>`);
          } else {
            _push2(`<div class="space-y-3 mb-6 max-h-48 overflow-y-auto" data-v-cdf68cb8><!--[-->`);
            ssrRenderList(unref(settingsStore).premiumFeatures, (feat) => {
              _push2(`<div class="flex items-center gap-3" data-v-cdf68cb8><div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center" data-v-cdf68cb8>`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-yellow-600" }, null, _parent));
              _push2(`</div><span class="text-sm text-sber-black" data-v-cdf68cb8>${ssrInterpolate(feat.title)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          }
          if (!((_a2 = unref(authStore).user) == null ? void 0 : _a2.isPremium)) {
            _push2(`<button class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(premiumCheckoutLoading)) ? " disabled" : ""} data-v-cdf68cb8>${ssrInterpolate(unref(premiumCheckoutLoading) ? "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u043E\u043F\u043B\u0430\u0442\u0443\u2026" : "\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C 299 \u20BD/\u043C\u0435\u0441\u044F\u0446")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (!((_b2 = unref(authStore).user) == null ? void 0 : _b2.isPremium)) {
            _push2(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(unref(premiumActivateLoading)) ? " disabled" : ""} data-v-cdf68cb8>${ssrInterpolate(unref(premiumActivateLoading) ? "\u0410\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u044F\u2026" : "\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if ((_c2 = unref(authStore).user) == null ? void 0 : _c2.isPremium) {
            _push2(`<p class="text-center text-sm font-semibold text-sber-green" data-v-cdf68cb8> Premium \u0443\u0436\u0435 \u0430\u043A\u0442\u0438\u0432\u0435\u043D </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-center text-xs text-sber-gray mt-3" data-v-cdf68cb8> \u041E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0420\u043E\u0431\u043E\u043A\u0430\u0441\u0441\u0443. \u041F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u042F \u043E\u043F\u043B\u0430\u0442\u0438\u043B \u2014 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C\xBB. </p><button class="btn-secondary mt-2 w-full" type="button" data-v-cdf68cb8>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(soundModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(soundModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold mb-4" data-v-cdf68cb8>${ssrInterpolate(unref(soundModal) === "notification" ? "\u0417\u0432\u0443\u043A \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" : "\u0417\u0432\u0443\u043A \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F")}</h3><div class="flex flex-col gap-2" data-v-cdf68cb8><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([getCurrentSound(unref(soundModal)) === s.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"])}" data-v-cdf68cb8><span class="text-xl" data-v-cdf68cb8>${ssrInterpolate(s.icon)}</span><span class="text-sm font-medium text-sber-black" data-v-cdf68cb8>${ssrInterpolate(s.name)}</span>`);
            if (getCurrentSound(unref(soundModal)) === s.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-sber-green ml-auto" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
          });
          _push2(`<!--]--></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(languageModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(languageModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold mb-4" data-v-cdf68cb8>\u042F\u0437\u044B\u043A \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F</h3><!--[-->`);
          ssrRenderList(languages, (lang) => {
            _push2(`<button class="${ssrRenderClass([unref(selectedLanguage) === lang.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors"])}" data-v-cdf68cb8><span class="flex-1 text-sm font-medium text-sber-black" data-v-cdf68cb8>${ssrInterpolate(lang.label)}</span>`);
            if (unref(selectedLanguage) === lang.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-sber-green" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
          });
          _push2(`<!--]--><button class="btn-secondary mt-3" data-v-cdf68cb8>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(contactModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(contactModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-cdf68cb8><h3 class="text-lg font-bold mb-1" data-v-cdf68cb8>\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043D\u0430\u043C</h3><p class="text-sm text-sber-gray mb-3" data-v-cdf68cb8>\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443 \u0438\u043B\u0438 \u0438\u0434\u0435\u044E, \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442.</p><textarea class="input-field min-h-[120px] mb-3 resize-none" placeholder="\u0412\u0430\u0448\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435..." data-v-cdf68cb8>${ssrInterpolate(unref(contactMessage))}</textarea><input type="file" accept="image/*" class="hidden" data-v-cdf68cb8><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl mb-3" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm text-sber-black" data-v-cdf68cb8>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442</span></button>`);
          if (unref(contactScreenshotName)) {
            _push2(`<div class="mb-3 rounded-xl bg-sber-gray-light px-3 py-2 text-xs text-sber-gray" data-v-cdf68cb8> \u041F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u043E: ${ssrInterpolate(unref(contactScreenshotName))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary" type="button"${ssrIncludeBooleanAttr(unref(contactSending)) ? " disabled" : ""} data-v-cdf68cb8>${ssrInterpolate(unref(contactSending) ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026" : "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C")}</button><button class="btn-secondary mt-3" data-v-cdf68cb8>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(aboutModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(aboutModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><div class="text-center mb-6" data-v-cdf68cb8><div class="mx-auto mb-3 flex justify-center" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(_component_BrandLogo, {
            size: "lg",
            "show-name-from": "always"
          }, null, _parent));
          _push2(`</div><p class="text-sm text-sber-gray" data-v-cdf68cb8>\u0412\u0435\u0440\u0441\u0438\u044F 1.0.0</p></div><div class="space-y-2" data-v-cdf68cb8><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-cdf68cb8>\u041E\u0446\u0435\u043D\u0438\u0442\u044C \u0432 RuStore</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-cdf68cb8>\u041E\u0446\u0435\u043D\u0438\u0442\u044C \u0432 Google Play</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" type="button" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(FileText), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-cdf68cb8>\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B</span></button></div><button class="btn-secondary mt-4" data-v-cdf68cb8>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showLogout)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showLogout)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold text-center mb-2" data-v-cdf68cb8>\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u0440\u043E\u0444\u0438\u043B\u044F?</h3><p class="text-sm text-sber-gray text-center mb-6" data-v-cdf68cb8>\u0412\u044B \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0432\u043E\u0439\u0442\u0438 \u0441\u043D\u043E\u0432\u0430 \u0432 \u043B\u044E\u0431\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.</p><button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" data-v-cdf68cb8> \u0412\u044B\u0439\u0442\u0438 </button><button class="btn-secondary" data-v-cdf68cb8>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(comingSoonVisible)) {
          _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center" data-v-cdf68cb8> \u0423\u0436\u0435 \u0440\u0430\u0437\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u043C, \u0441\u043A\u043E\u0440\u043E \u0431\u0443\u0434\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u043E \u{1F60A} </div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(avatarModal)) {
          _push2(`<div class="overlay" data-v-cdf68cb8></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(avatarModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-cdf68cb8><h3 class="text-lg font-bold mb-4" data-v-cdf68cb8>\u0424\u043E\u0442\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F</h3>`);
          if (unref(avatarSettingsError)) {
            _push2(`<p class="mb-3 text-xs text-red-500" data-v-cdf68cb8>${ssrInterpolate(unref(avatarSettingsError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input type="file" accept="image/*" capture="environment" class="hidden" data-v-cdf68cb8><input type="file" accept="image/*" class="hidden" data-v-cdf68cb8><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` \u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0444\u043E\u0442\u043E </button><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` \u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0433\u0430\u043B\u0435\u0440\u0435\u0438 </button><button class="mb-3 w-full rounded-2xl bg-sber-gray-light px-4 py-4" type="button" data-v-cdf68cb8><span class="flex items-center gap-3 text-sber-black" data-v-cdf68cb8>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u0432\u0430\u0442\u0430\u0440 </span></button><button class="btn-secondary" data-v-cdf68cb8>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cdf68cb8"]]);

export { settings as default };
//# sourceMappingURL=settings-CHxuNuC2.mjs.map
