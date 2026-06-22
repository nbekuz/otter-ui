import { defineComponent, computed, mergeProps, unref, useSSRContext, ref, reactive, watch, withCtx, createVNode, resolveDynamicComponent } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { ChevronRight, CheckSquare, Calendar, Grid2x2, Timer, Settings, Camera, User, Info, Lock, Smartphone, Crown, GripVertical, Sun, Moon, Paintbrush, Clock, Download, Bell, Vibrate, Volume2, CheckCircle, Globe, HelpCircle, FileText, Share2, MessageSquareText, Check, Image, Star } from "lucide-vue-next";
import { b as useSettingsStore, u as useAuthStore, e as useAppToast, d as useRoute, n as navigateTo, s as soundOptions, t as getApiErrorMessage, _ as _export_sfc } from "../server.mjs";
import { _ as _sfc_main$2 } from "./BrandLogo-BjHNx0bu.js";
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
import "./logo-DVdZXLLs.js";
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
      { id: "ru", label: "Русский" }
    ];
    const bottomMenuCatalog = [
      { id: "tasks", label: "Задачи", icon: CheckSquare },
      { id: "calendar", label: "Календарь", icon: Calendar },
      { id: "matrix", label: "Матрица", icon: Grid2x2 },
      { id: "pomodoro", label: "Помодоро", icon: Timer },
      { id: "settings", label: "Настройки", icon: Settings }
    ];
    const orderedBottomMenuItems = computed(() => {
      const enabled = settingsStore.appSettings.bottomNavItems || [];
      const byId = new Map(bottomMenuCatalog.map((item) => [item.id, item]));
      const ordered = enabled.map((id) => byId.get(id)).filter(Boolean);
      const rest = bottomMenuCatalog.filter((item) => !enabled.includes(item.id));
      return [...ordered, ...rest];
    });
    const selectedLanguageLabel = computed(
      () => languages.find((l) => l.id === selectedLanguage.value)?.label || "Русский"
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
      const raw = `${authStore.profileFirstName || ""} ${authStore.profileLastName || ""}`.trim();
      return raw || authStore.user?.name || "—";
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
    const taskGroups = [
      { id: "overdue", label: "Просрочено", color: "#FF3B30" },
      { id: "today", label: "Сегодня", color: "#FF9500" },
      { id: "tomorrow", label: "Завтра", color: "#007AFF" },
      { id: "later", label: "Позже", color: "#AF52DE" },
      { id: "nodate", label: "Без срока", color: "#8E8E93" },
      { id: "completed", label: "Готово", color: "#21A038" }
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
        (void 0).share({ title: "Otter - Планировщик", url: (void 0).location.origin });
      } else {
        showComingSoon();
      }
    }
    function openNameModal() {
      nameErrors.first = "";
      nameErrors.last = "";
      editFirstName.value = authStore.profileFirstName.trim();
      editLastName.value = authStore.profileLastName.trim();
      if ((!editFirstName.value || !editLastName.value) && authStore.user?.name?.trim()) {
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
      return soundOptions.find((s) => s.id === soundId)?.name || "";
    }
    function getCurrentSound(modal) {
      if (modal === "notification") return settingsStore.appSettings.notificationSound;
      return settingsStore.appSettings.completionSound;
    }
    function isBottomMenuEnabled(itemId) {
      return settingsStore.appSettings.bottomNavItems.includes(itemId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SettingsRow = _sfc_main$1;
      const _component_BrandLogo = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))} data-v-f2022847><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "page-header-top px-4 pb-4"])}" data-v-f2022847><div class="flex items-center justify-between" data-v-f2022847><h1 class="text-xl font-bold text-sber-black" data-v-f2022847>Настройки</h1><button class="text-sm font-semibold text-red-500" data-v-f2022847> Выйти </button></div></div><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"])}" data-v-f2022847><div class="flex items-center gap-4" data-v-f2022847><div class="relative" data-v-f2022847><div class="${ssrRenderClass([unref(authStore).user?.isPremium ? "ring-2 ring-yellow-400 ring-offset-2" : "", "w-16 h-16 rounded-full overflow-hidden"])}" data-v-f2022847>`);
      if (!unref(authStore).user?.avatar) {
        _push(`<div class="w-full h-full bg-sber-green flex items-center justify-center" data-v-f2022847><span class="text-white text-2xl font-bold" data-v-f2022847>${ssrInterpolate(unref(authStore).user?.name?.[0]?.toUpperCase() || "A")}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover" data-v-f2022847>`);
      }
      _push(`</div><div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full flex items-center justify-center" data-v-f2022847>`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-3 h-3 text-white" }, null, _parent));
      _push(`</div></div><div class="min-w-0 flex-1" data-v-f2022847><div class="flex items-center gap-2" data-v-f2022847><p class="truncate text-base font-bold text-sber-black" data-v-f2022847>${ssrInterpolate(unref(authStore).user?.name)}</p>`);
      if (unref(authStore).user?.isPremium) {
        _push(`<span class="shrink-0 text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full" data-v-f2022847> ⭐ ПРЕМИУМ </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="truncate text-sm text-sber-gray" data-v-f2022847>${ssrInterpolate(unref(authStore).user?.email)}</p>`);
      if (unref(authStore).user?.isPremium && unref(premiumExpiresLabel)) {
        _push(`<p class="mt-1 text-xs font-medium text-yellow-700" data-v-f2022847> Срок до ${ssrInterpolate(unref(premiumExpiresLabel))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15" : "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100", "mt-3 w-full rounded-xl border px-3 py-2 text-left transition-colors"])}" data-v-f2022847><p class="text-[10px] font-semibold uppercase tracking-wide text-yellow-600" data-v-f2022847>Premium</p><p class="mt-0.5 text-xs font-semibold text-sber-black" data-v-f2022847>${ssrInterpolate(unref(authStore).user?.isPremium ? "Premium активен" : "Подключить Premium")}</p></button></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-gray-mid flex-shrink-0" }, null, _parent));
      _push(`</div></button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Аккаунт</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "Имя",
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
        label: "Аватар",
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
        label: "Профиль",
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
        label: "Пароль",
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
        label: "Устройства",
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
        label: "Премиум",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Нижнее меню</p><p class="px-4 pb-2 text-xs text-sber-gray" data-v-f2022847>Включайте вкладки и меняйте порядок перетаскиванием.</p><!--[-->`);
      ssrRenderList(unref(orderedBottomMenuItems), (item) => {
        _push(`<div class="flex items-center gap-3 px-4 py-3 border-b border-sber-gray-light last:border-0" draggable="true" data-v-f2022847>`);
        _push(ssrRenderComponent(unref(GripVertical), { class: "w-4 h-4 text-sber-gray cursor-grab" }, null, _parent));
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-sber-gray" }, null), _parent);
        _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-f2022847>${ssrInterpolate(item.label)}</span>`);
        if (item.id === "settings") {
          _push(`<span class="text-xs font-medium text-sber-gray" data-v-f2022847>Всегда</span>`);
        } else {
          _push(`<button class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-f2022847><div class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-f2022847></div></button>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Приложение</p><div class="border-b border-sber-gray-light px-4 py-4" data-v-f2022847><div class="flex items-start gap-3" data-v-f2022847><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black"])}" data-v-f2022847>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-f2022847><div class="flex flex-wrap items-center gap-2" data-v-f2022847><p class="text-sm font-semibold text-sber-black" data-v-f2022847>Переключение темы</p><span class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue-light text-sber-blue" : "bg-sber-green-light text-sber-green", "rounded-full px-2 py-0.5 text-[11px] font-semibold"])}" data-v-f2022847>${ssrInterpolate(unref(isDarkTheme) ? "Dark" : "Light")}</span></div><p class="mt-1 text-xs leading-5 text-sber-gray" data-v-f2022847> Интерфейс переключается мгновенно и сохраняет выбранное оформление. </p><div class="mt-3 flex flex-wrap items-center gap-3" data-v-f2022847><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white", "group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"])}" data-v-f2022847><span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-v-f2022847></span><span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" data-v-f2022847>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</span></button><button type="button" class="${ssrRenderClass([!unref(isDarkTheme) ? "bg-sber-green text-white" : "bg-[#20242d] text-slate-300", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-f2022847> Светлая </button><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue text-white" : "bg-sber-gray-light text-sber-gray", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-f2022847> Тёмная </button></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "Вид",
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
        label: "Дата и время",
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
        label: "Интеграции и импорт",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Звуки и уведомления</p><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-f2022847>`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-f2022847>Уведомления</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-f2022847><div class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-f2022847></div></button></div><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-f2022847>`);
      _push(ssrRenderComponent(unref(Vibrate), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-f2022847>Вибрация</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-f2022847><div class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-f2022847></div></button></div>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "Звук уведомления",
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
        label: "Звук подтверждения",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Разделы списка задач</p><!--[-->`);
      ssrRenderList(taskGroups, (group) => {
        _push(`<div class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0" data-v-f2022847><div class="w-3 h-3 rounded-full mr-3" style="${ssrRenderStyle({ backgroundColor: group.color })}" data-v-f2022847></div><span class="text-sm font-medium text-sber-black flex-1" data-v-f2022847>${ssrInterpolate(group.label)}</span><button class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-f2022847><div class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-f2022847></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Общее</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "Язык",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-f2022847><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-f2022847>Помощь и информация</p>`);
      _push(ssrRenderComponent(_component_SettingsRow, {
        label: "Частые вопросы (FAQ)",
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
        label: "Юридические документы",
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
        label: "Рекомендовать друзьям",
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
        label: "Написать нам",
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
        label: "О приложении",
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
      _push(`</div><div class="h-8" data-v-f2022847></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold mb-4" data-v-f2022847>Имя и фамилия</h3><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-f2022847>Имя</label><input${ssrRenderAttr("value", unref(editFirstName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).first }, "input-field mb-2"])}" placeholder="Имя" data-v-f2022847>`);
          if (unref(nameErrors).first) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-f2022847>${ssrInterpolate(unref(nameErrors).first)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<label class="mb-2 block text-sm font-medium text-sber-gray" data-v-f2022847>Фамилия</label><input${ssrRenderAttr("value", unref(editLastName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).last }, "input-field mb-2"])}" placeholder="Фамилия" data-v-f2022847>`);
          if (unref(nameErrors).last) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-f2022847>${ssrInterpolate(unref(nameErrors).last)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-f2022847>${ssrInterpolate(unref(nameSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-f2022847>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(passwordModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(passwordModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold mb-2" data-v-f2022847>Пароль</h3><p class="mb-4 text-xs text-sber-gray" data-v-f2022847>Новый: 8–20 символов, Aa + цифра + спецсимвол (!, @ …).</p><input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="Новый пароль" required data-v-f2022847>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-f2022847>${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="Повторите новый пароль" required data-v-f2022847>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-f2022847>${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-f2022847>${ssrInterpolate(unref(passwordSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-f2022847>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(premiumModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6" data-v-f2022847><div class="text-center mb-6" data-v-f2022847><div class="text-4xl mb-3" data-v-f2022847>⭐</div><h3 class="text-xl font-bold text-sber-black" data-v-f2022847>Otter Premium</h3><p class="text-sm text-sber-gray mt-1" data-v-f2022847>Больше функций в приложении</p></div>`);
          if (unref(settingsStore).premiumFeaturesLoading) {
            _push2(`<p class="mb-4 text-center text-sm text-sber-gray" data-v-f2022847> Загрузка возможностей… </p>`);
          } else {
            _push2(`<div class="space-y-3 mb-6 max-h-48 overflow-y-auto" data-v-f2022847><!--[-->`);
            ssrRenderList(unref(settingsStore).premiumFeatures, (feat) => {
              _push2(`<div class="flex items-center gap-3" data-v-f2022847><div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center" data-v-f2022847>`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-yellow-600" }, null, _parent));
              _push2(`</div><span class="text-sm text-sber-black" data-v-f2022847>${ssrInterpolate(feat.title)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(premiumCheckoutLoading)) ? " disabled" : ""} data-v-f2022847>${ssrInterpolate(unref(premiumCheckoutLoading) ? "Открываем оплату…" : "Оплатить 150 ₽/месяц")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(unref(premiumActivateLoading)) ? " disabled" : ""} data-v-f2022847>${ssrInterpolate(unref(premiumActivateLoading) ? "Активация…" : "Я оплатил — активировать")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(authStore).user?.isPremium) {
            _push2(`<p class="text-center text-sm font-semibold text-sber-green" data-v-f2022847> Premium уже активен </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-center text-xs text-sber-gray mt-3" data-v-f2022847> Оплата через Робокассу. После оплаты нажмите «Я оплатил — активировать». </p><button class="btn-secondary mt-2 w-full" type="button" data-v-f2022847>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(soundModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(soundModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold mb-4" data-v-f2022847>${ssrInterpolate(unref(soundModal) === "notification" ? "Звук уведомления" : "Звук подтверждения")}</h3><div class="flex flex-col gap-2" data-v-f2022847><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([getCurrentSound(unref(soundModal)) === s.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"])}" data-v-f2022847><span class="text-xl" data-v-f2022847>${ssrInterpolate(s.icon)}</span><span class="text-sm font-medium text-sber-black" data-v-f2022847>${ssrInterpolate(s.name)}</span>`);
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
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(languageModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold mb-4" data-v-f2022847>Язык приложения</h3><!--[-->`);
          ssrRenderList(languages, (lang) => {
            _push2(`<button class="${ssrRenderClass([unref(selectedLanguage) === lang.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors"])}" data-v-f2022847><span class="flex-1 text-sm font-medium text-sber-black" data-v-f2022847>${ssrInterpolate(lang.label)}</span>`);
            if (unref(selectedLanguage) === lang.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-sber-green" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
          });
          _push2(`<!--]--><button class="btn-secondary mt-3" data-v-f2022847>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(contactModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(contactModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-f2022847><h3 class="text-lg font-bold mb-1" data-v-f2022847>Написать нам</h3><p class="text-sm text-sber-gray mb-3" data-v-f2022847>Опишите проблему или идею, можно добавить скриншот.</p><textarea class="input-field min-h-[120px] mb-3 resize-none" placeholder="Ваше сообщение..." data-v-f2022847>${ssrInterpolate(unref(contactMessage))}</textarea><input type="file" accept="image/*" class="hidden" data-v-f2022847><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl mb-3" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm text-sber-black" data-v-f2022847>Добавить скриншот</span></button>`);
          if (unref(contactScreenshotName)) {
            _push2(`<div class="mb-3 rounded-xl bg-sber-gray-light px-3 py-2 text-xs text-sber-gray" data-v-f2022847> Прикреплено: ${ssrInterpolate(unref(contactScreenshotName))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary" type="button"${ssrIncludeBooleanAttr(unref(contactSending)) ? " disabled" : ""} data-v-f2022847>${ssrInterpolate(unref(contactSending) ? "Отправка…" : "Отправить")}</button><button class="btn-secondary mt-3" data-v-f2022847>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(aboutModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(aboutModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><div class="text-center mb-6" data-v-f2022847><div class="mx-auto mb-3 flex justify-center" data-v-f2022847>`);
          _push2(ssrRenderComponent(_component_BrandLogo, {
            size: "lg",
            "show-name-from": "always"
          }, null, _parent));
          _push2(`</div><p class="text-sm text-sber-gray" data-v-f2022847>Версия 1.0.0</p></div><div class="space-y-2" data-v-f2022847><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-f2022847>Оценить в RuStore</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-f2022847>Оценить в Google Play</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" type="button" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(FileText), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-f2022847>Юридические документы</span></button></div><button class="btn-secondary mt-4" data-v-f2022847>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showLogout)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showLogout)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold text-center mb-2" data-v-f2022847>Выйти из профиля?</h3><p class="text-sm text-sber-gray text-center mb-6" data-v-f2022847>Вы сможете войти снова в любое время.</p><button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" data-v-f2022847> Выйти </button><button class="btn-secondary" data-v-f2022847>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(comingSoonVisible)) {
          _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center" data-v-f2022847> Уже разрабатываем, скоро будет готово 😊 </div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(avatarModal)) {
          _push2(`<div class="overlay" data-v-f2022847></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(avatarModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-f2022847><h3 class="text-lg font-bold mb-4" data-v-f2022847>Фото профиля</h3>`);
          if (unref(avatarSettingsError)) {
            _push2(`<p class="mb-3 text-xs text-red-500" data-v-f2022847>${ssrInterpolate(unref(avatarSettingsError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input type="file" accept="image/*" capture="environment" class="hidden" data-v-f2022847><input type="file" accept="image/*" class="hidden" data-v-f2022847><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` Сделать фото </button><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` Выбрать из галереи </button><button class="mb-3 w-full rounded-2xl bg-sber-gray-light px-4 py-4" type="button" data-v-f2022847><span class="flex items-center gap-3 text-sber-black" data-v-f2022847>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` Удалить аватар </span></button><button class="btn-secondary" data-v-f2022847>Отмена</button></div>`);
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
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f2022847"]]);
export {
  settings as default
};
//# sourceMappingURL=settings-S0XLaLly.js.map
