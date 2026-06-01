import { u as useAuthStore, c as useSettingsStore, e as useAppToast, n as navigateTo, s as soundOptions, k as getApiErrorMessage, _ as _export_sfc } from "../server.mjs";
import { defineComponent, ref, reactive, computed, watch, resolveComponent, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { CheckSquare, Calendar, Grid2x2, Timer, Settings, Camera, ChevronRight, User, Info, Lock, Smartphone, Crown, GripVertical, Sun, Moon, EyeOff, Clock, Download, Share2, Bell, Vibrate, Volume2, CheckCircle, Globe, HelpCircle, MessageSquareText, Check, Search, ChevronDown, Image, Star } from "lucide-vue-next";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
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
    const helpModal = ref(false);
    const contactModal = ref(false);
    const aboutModal = ref(false);
    const legalModal = ref(false);
    const selectedLegalDoc = ref(null);
    const premiumCheckoutLoading = ref(false);
    const premiumActivateLoading = ref(false);
    const contactSending = ref(false);
    ref(null);
    const avatarModal = ref(false);
    const avatarSettingsError = ref("");
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
    const faqSearch = ref("");
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
    const filteredFaq = computed(() => {
      const items = settingsStore.helpFaq;
      if (!faqSearch.value.trim()) return items;
      const q = faqSearch.value.trim().toLowerCase();
      return items.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
    async function loadHelpFaq() {
      await settingsStore.fetchHelpFaq();
    }
    watch(helpModal, (open) => {
      if (open) void loadHelpFaq();
    });
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
      const _component_SettingsSettingsRow = resolveComponent("SettingsSettingsRow");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))} data-v-a624c8aa><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "px-4 pt-14 pb-4"])}" data-v-a624c8aa><div class="flex items-center justify-between" data-v-a624c8aa><h1 class="text-xl font-bold text-sber-black" data-v-a624c8aa>Настройки</h1><button class="text-sm font-semibold text-red-500" data-v-a624c8aa> Выйти </button></div></div><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"])}" data-v-a624c8aa><div class="flex items-center gap-4" data-v-a624c8aa><div class="relative" data-v-a624c8aa><div class="${ssrRenderClass([unref(authStore).user?.isPremium ? "ring-2 ring-yellow-400 ring-offset-2" : "", "w-16 h-16 rounded-full overflow-hidden"])}" data-v-a624c8aa>`);
      if (!unref(authStore).user?.avatar) {
        _push(`<div class="w-full h-full bg-sber-green flex items-center justify-center" data-v-a624c8aa><span class="text-white text-2xl font-bold" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.name?.[0]?.toUpperCase() || "A")}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover" data-v-a624c8aa>`);
      }
      _push(`</div><div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full flex items-center justify-center" data-v-a624c8aa>`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-3 h-3 text-white" }, null, _parent));
      _push(`</div></div><div class="flex-1" data-v-a624c8aa><div class="flex items-center gap-2" data-v-a624c8aa><p class="text-base font-bold text-sber-black" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.name)}</p>`);
      if (unref(authStore).user?.isPremium) {
        _push(`<span class="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full" data-v-a624c8aa> ⭐ ПРЕМИУМ </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-sm text-sber-gray" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.email)}</p>`);
      if (unref(authStore).user?.isPremium && unref(premiumExpiresLabel)) {
        _push(`<p class="mt-1 text-xs font-medium text-yellow-700" data-v-a624c8aa> Срок до ${ssrInterpolate(unref(premiumExpiresLabel))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-gray-mid flex-shrink-0" }, null, _parent));
      _push(`</div></button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-a624c8aa>Аккаунт</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "border-yellow-500/30 bg-[#171a21]" : "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50", "mx-4 mt-4 rounded-2xl border p-4 shadow-sm"])}" data-v-a624c8aa><div class="flex items-center justify-between gap-3" data-v-a624c8aa><div class="min-w-0" data-v-a624c8aa><p class="text-xs font-semibold uppercase tracking-wide text-yellow-600" data-v-a624c8aa>Premium</p><p class="mt-1 text-sm font-semibold text-sber-black" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.isPremium ? "Premium активен" : "Расширьте возможности приложения")}</p><p class="mt-1 text-xs text-sber-gray" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.isPremium ? "Синхронизация, расширенная статистика и дополнительные инструменты уже доступны." : "Подключите Premium для расширенной статистики и синхронизации.")}</p></div><button class="${ssrRenderClass([unref(authStore).user?.isPremium ? "bg-yellow-500/70" : "bg-gradient-to-r from-yellow-400 to-yellow-600", "rounded-xl px-3 py-2 text-sm font-semibold text-white transition-colors"])}" data-v-a624c8aa>${ssrInterpolate(unref(authStore).user?.isPremium ? "Управлять" : "Подключить Premium")}</button></div></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-a624c8aa>Нижнее меню</p><p class="px-4 pb-2 text-xs text-sber-gray" data-v-a624c8aa>Включайте вкладки и меняйте порядок перетаскиванием.</p><!--[-->`);
      ssrRenderList(unref(orderedBottomMenuItems), (item) => {
        _push(`<div class="flex items-center gap-3 px-4 py-3 border-b border-sber-gray-light last:border-0" draggable="true" data-v-a624c8aa>`);
        _push(ssrRenderComponent(unref(GripVertical), { class: "w-4 h-4 text-sber-gray cursor-grab" }, null, _parent));
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-sber-gray" }, null), _parent);
        _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-a624c8aa>${ssrInterpolate(item.label)}</span><button class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-a624c8aa><div class="${ssrRenderClass([isBottomMenuEnabled(item.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-a624c8aa></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-a624c8aa>Приложение</p><div class="border-b border-sber-gray-light px-4 py-4" data-v-a624c8aa><div class="flex items-start gap-3" data-v-a624c8aa><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black"])}" data-v-a624c8aa>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-a624c8aa><div class="flex flex-wrap items-center gap-2" data-v-a624c8aa><p class="text-sm font-semibold text-sber-black" data-v-a624c8aa>Переключение темы</p><span class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue-light text-sber-blue" : "bg-sber-green-light text-sber-green", "rounded-full px-2 py-0.5 text-[11px] font-semibold"])}" data-v-a624c8aa>${ssrInterpolate(unref(isDarkTheme) ? "Dark" : "Light")}</span></div><p class="mt-1 text-xs leading-5 text-sber-gray" data-v-a624c8aa> Интерфейс переключается мгновенно и сохраняет выбранное оформление. </p><div class="mt-3 flex flex-wrap items-center gap-3" data-v-a624c8aa><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white", "group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"])}" data-v-a624c8aa><span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-v-a624c8aa></span><span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" data-v-a624c8aa>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</span></button><button type="button" class="${ssrRenderClass([!unref(isDarkTheme) ? "bg-sber-green text-white" : "bg-[#20242d] text-slate-300", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-a624c8aa> Светлая </button><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue text-white" : "bg-sber-gray-light text-sber-gray", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-a624c8aa> Тёмная </button></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Вид",
        onClick: runStubAction
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(EyeOff), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(EyeOff), { class: "w-5 h-5 text-sber-gray mr-3" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-a624c8aa>Звуки и уведомления</p><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-a624c8aa>`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-a624c8aa>Уведомления</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-a624c8aa><div class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-a624c8aa></div></button></div><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-a624c8aa>`);
      _push(ssrRenderComponent(unref(Vibrate), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-a624c8aa>Вибрация</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-a624c8aa><div class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-a624c8aa></div></button></div>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-a624c8aa>Разделы списка</p><!--[-->`);
      ssrRenderList(taskGroups, (group) => {
        _push(`<div class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0" data-v-a624c8aa><div class="w-3 h-3 rounded-full mr-3" style="${ssrRenderStyle({ backgroundColor: group.color })}" data-v-a624c8aa></div><span class="text-sm font-medium text-sber-black flex-1" data-v-a624c8aa>${ssrInterpolate(group.label)}</span><button class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-a624c8aa><div class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-a624c8aa></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-a624c8aa>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Центр помощи",
        onClick: ($event) => helpModal.value = true
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(`</div><div class="h-8" data-v-a624c8aa></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold mb-4" data-v-a624c8aa>Имя и фамилия</h3><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-a624c8aa>Имя</label><input${ssrRenderAttr("value", unref(editFirstName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).first }, "input-field mb-2"])}" placeholder="Имя" data-v-a624c8aa>`);
          if (unref(nameErrors).first) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(nameErrors).first)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<label class="mb-2 block text-sm font-medium text-sber-gray" data-v-a624c8aa>Фамилия</label><input${ssrRenderAttr("value", unref(editLastName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameErrors).last }, "input-field mb-2"])}" placeholder="Фамилия" data-v-a624c8aa>`);
          if (unref(nameErrors).last) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(nameErrors).last)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-a624c8aa>${ssrInterpolate(unref(nameSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(nameSaving)) ? " disabled" : ""} data-v-a624c8aa>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(passwordModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(passwordModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold mb-2" data-v-a624c8aa>Пароль</h3><p class="mb-4 text-xs text-sber-gray" data-v-a624c8aa>Новый: 8–20 символов, Aa + цифра + спецсимвол (!, @ …).</p><input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="Новый пароль" required data-v-a624c8aa>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="Повторите новый пароль" required data-v-a624c8aa>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3 w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-a624c8aa>${ssrInterpolate(unref(passwordSaving) ? "Сохранение…" : "Сохранить")}</button><button class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""} data-v-a624c8aa>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(premiumModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6" data-v-a624c8aa><div class="text-center mb-6" data-v-a624c8aa><div class="text-4xl mb-3" data-v-a624c8aa>⭐</div><h3 class="text-xl font-bold text-sber-black" data-v-a624c8aa>Otter Premium</h3><p class="text-sm text-sber-gray mt-1" data-v-a624c8aa>Больше функций в приложении</p></div>`);
          if (unref(settingsStore).premiumFeaturesLoading) {
            _push2(`<p class="mb-4 text-center text-sm text-sber-gray" data-v-a624c8aa> Загрузка возможностей… </p>`);
          } else {
            _push2(`<div class="space-y-3 mb-6 max-h-48 overflow-y-auto" data-v-a624c8aa><!--[-->`);
            ssrRenderList(unref(settingsStore).premiumFeatures, (feat) => {
              _push2(`<div class="flex items-center gap-3" data-v-a624c8aa><div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center" data-v-a624c8aa>`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-yellow-600" }, null, _parent));
              _push2(`</div><span class="text-sm text-sber-black" data-v-a624c8aa>${ssrInterpolate(feat.title)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90 disabled:opacity-60" type="button"${ssrIncludeBooleanAttr(unref(premiumCheckoutLoading)) ? " disabled" : ""} data-v-a624c8aa>${ssrInterpolate(unref(premiumCheckoutLoading) ? "Открываем оплату…" : "Оплатить 299 ₽/месяц")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (!unref(authStore).user?.isPremium) {
            _push2(`<button class="btn-secondary mt-2 w-full" type="button"${ssrIncludeBooleanAttr(unref(premiumActivateLoading)) ? " disabled" : ""} data-v-a624c8aa>${ssrInterpolate(unref(premiumActivateLoading) ? "Активация…" : "Я оплатил — активировать")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(authStore).user?.isPremium) {
            _push2(`<p class="text-center text-sm font-semibold text-sber-green" data-v-a624c8aa> Premium уже активен </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-center text-xs text-sber-gray mt-3" data-v-a624c8aa> Оплата через Робокассу. После оплаты нажмите «Я оплатил — активировать». </p><button class="btn-secondary mt-2 w-full" type="button" data-v-a624c8aa>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(soundModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(soundModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold mb-4" data-v-a624c8aa>${ssrInterpolate(unref(soundModal) === "notification" ? "Звук уведомления" : "Звук подтверждения")}</h3><div class="flex flex-col gap-2" data-v-a624c8aa><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([getCurrentSound(unref(soundModal)) === s.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"])}" data-v-a624c8aa><span class="text-xl" data-v-a624c8aa>${ssrInterpolate(s.icon)}</span><span class="text-sm font-medium text-sber-black" data-v-a624c8aa>${ssrInterpolate(s.name)}</span>`);
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
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(languageModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold mb-4" data-v-a624c8aa>Язык приложения</h3><!--[-->`);
          ssrRenderList(languages, (lang) => {
            _push2(`<button class="${ssrRenderClass([unref(selectedLanguage) === lang.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors"])}" data-v-a624c8aa><span class="flex-1 text-sm font-medium text-sber-black" data-v-a624c8aa>${ssrInterpolate(lang.label)}</span>`);
            if (unref(selectedLanguage) === lang.id) {
              _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-sber-green" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
          });
          _push2(`<!--]--><button class="btn-secondary mt-3" data-v-a624c8aa>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(helpModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(helpModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-a624c8aa><h3 class="text-lg font-bold mb-1" data-v-a624c8aa>Центр помощи</h3><div class="relative mb-4" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(faqSearch))} placeholder="Поиск по вопросам..." class="input-field pl-11 py-3 text-sm" data-v-a624c8aa></div>`);
          if (unref(settingsStore).helpFaqLoading) {
            _push2(`<p class="py-6 text-center text-sm text-sber-gray" data-v-a624c8aa> Загрузка… </p>`);
          } else if (unref(settingsStore).helpFaqError) {
            _push2(`<p class="py-4 text-center text-sm text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(settingsStore).helpFaqError)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(settingsStore).helpFaqError) {
            _push2(`<button class="btn-secondary mb-4 w-full" type="button" data-v-a624c8aa> Повторить </button>`);
          } else if (unref(filteredFaq).length === 0) {
            _push2(`<p class="py-6 text-center text-sm text-sber-gray" data-v-a624c8aa> Вопросы не найдены </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<!--[-->`);
          ssrRenderList(unref(filteredFaq), (faq) => {
            _push2(`<div class="mb-3" data-v-a624c8aa><button class="w-full text-left" data-v-a624c8aa><div class="flex items-start justify-between gap-2 py-2" data-v-a624c8aa><span class="text-sm font-semibold text-sber-black" data-v-a624c8aa>${ssrInterpolate(faq.question)}</span>`);
            _push2(ssrRenderComponent(unref(ChevronDown), {
              class: ["w-4 h-4 text-sber-gray flex-shrink-0 mt-0.5", faq.open ? "rotate-180" : ""]
            }, null, _parent));
            _push2(`</div></button>`);
            if (faq.open) {
              _push2(`<p class="text-sm text-sber-gray pb-2 leading-relaxed" data-v-a624c8aa>${ssrInterpolate(faq.answer)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="h-px bg-sber-gray-light" data-v-a624c8aa></div></div>`);
          });
          _push2(`<!--]--><button class="btn-primary mt-4" data-v-a624c8aa>Связаться с нами</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(contactModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(contactModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-a624c8aa><h3 class="text-lg font-bold mb-1" data-v-a624c8aa>Написать нам</h3><p class="text-sm text-sber-gray mb-3" data-v-a624c8aa>Опишите проблему или идею, можно добавить скриншот.</p><textarea class="input-field min-h-[120px] mb-3 resize-none" placeholder="Ваше сообщение..." data-v-a624c8aa>${ssrInterpolate(unref(contactMessage))}</textarea><input type="file" accept="image/*" class="hidden" data-v-a624c8aa><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl mb-3" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm text-sber-black" data-v-a624c8aa>Добавить скриншот</span></button>`);
          if (unref(contactScreenshotName)) {
            _push2(`<div class="mb-3 rounded-xl bg-sber-gray-light px-3 py-2 text-xs text-sber-gray" data-v-a624c8aa> Прикреплено: ${ssrInterpolate(unref(contactScreenshotName))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary" type="button"${ssrIncludeBooleanAttr(unref(contactSending)) ? " disabled" : ""} data-v-a624c8aa>${ssrInterpolate(unref(contactSending) ? "Отправка…" : "Отправить")}</button><button class="btn-secondary mt-3" data-v-a624c8aa>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(aboutModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(aboutModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><div class="text-center mb-6" data-v-a624c8aa><div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sber-green to-sber-blue mx-auto mb-3 flex items-center justify-center" data-v-a624c8aa><span class="text-white font-bold text-2xl" data-v-a624c8aa>🦦</span></div><h3 class="text-lg font-bold" data-v-a624c8aa>Otter</h3><p class="text-sm text-sber-gray" data-v-a624c8aa>Версия 1.0.0</p></div><div class="space-y-2" data-v-a624c8aa><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-a624c8aa>Оценить в RuStore</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-a624c8aa>Оценить в Google Play</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" type="button" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Info), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-a624c8aa>Лицензии и информация</span></button></div><button class="btn-secondary mt-4" data-v-a624c8aa>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(legalModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(legalModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-a624c8aa><h3 class="text-lg font-bold mb-3" data-v-a624c8aa>Юридические документы</h3>`);
          if (unref(settingsStore).legalDocumentsLoading) {
            _push2(`<p class="py-6 text-center text-sm text-sber-gray" data-v-a624c8aa> Загрузка… </p>`);
          } else if (unref(settingsStore).legalDocumentsError) {
            _push2(`<p class="py-4 text-center text-sm text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(settingsStore).legalDocumentsError)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(settingsStore).legalDocumentsError) {
            _push2(`<button class="btn-secondary mb-4 w-full" type="button" data-v-a624c8aa> Повторить </button>`);
          } else if (unref(selectedLegalDoc)) {
            _push2(`<!--[--><button class="mb-3 text-sm font-semibold text-sber-green" type="button" data-v-a624c8aa> ← Назад к списку </button><h4 class="text-base font-bold text-sber-black mb-2" data-v-a624c8aa>${ssrInterpolate(unref(selectedLegalDoc).title)}</h4><p class="whitespace-pre-wrap text-sm leading-relaxed text-sber-gray" data-v-a624c8aa>${ssrInterpolate(unref(selectedLegalDoc).content)}</p><!--]-->`);
          } else {
            _push2(`<div class="space-y-2" data-v-a624c8aa><!--[-->`);
            ssrRenderList(unref(settingsStore).legalDocuments, (doc) => {
              _push2(`<button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button" data-v-a624c8aa>`);
              _push2(ssrRenderComponent(unref(Info), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
              _push2(`<span class="text-sm text-sber-black" data-v-a624c8aa>${ssrInterpolate(doc.title)}</span>`);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "ml-auto h-4 w-4 text-sber-gray" }, null, _parent));
              _push2(`</button>`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`<button class="btn-secondary mt-4 w-full" type="button" data-v-a624c8aa>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showLogout)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showLogout)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold text-center mb-2" data-v-a624c8aa>Выйти из профиля?</h3><p class="text-sm text-sber-gray text-center mb-6" data-v-a624c8aa>Вы сможете войти снова в любое время.</p><button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" data-v-a624c8aa> Выйти </button><button class="btn-secondary" data-v-a624c8aa>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(comingSoonVisible)) {
          _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center" data-v-a624c8aa> Уже разрабатываем, скоро будет готово 😊 </div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(avatarModal)) {
          _push2(`<div class="overlay" data-v-a624c8aa></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(avatarModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-a624c8aa><h3 class="text-lg font-bold mb-4" data-v-a624c8aa>Фото профиля</h3>`);
          if (unref(avatarSettingsError)) {
            _push2(`<p class="mb-3 text-xs text-red-500" data-v-a624c8aa>${ssrInterpolate(unref(avatarSettingsError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input type="file" accept="image/*" class="hidden" data-v-a624c8aa><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` Выбрать изображение </button><button class="mb-3 w-full rounded-2xl bg-sber-gray-light px-4 py-4" type="button" data-v-a624c8aa><span class="flex items-center gap-3 text-sber-black" data-v-a624c8aa>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
          _push2(` Удалить аватар </span></button><button class="btn-secondary" data-v-a624c8aa>Отмена</button></div>`);
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
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a624c8aa"]]);
export {
  settings as default
};
//# sourceMappingURL=settings-B-dtX1jh.js.map
