import { u as useSettingsStore, f as faqData, n as navigateTo, s as soundOptions } from "../server.mjs";
import { defineComponent, ref, reactive, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport } from "vue/server-renderer";
import { Camera, ChevronRight, User, Lock, Smartphone, Crown, Sun, Moon, EyeOff, Clock, Download, Share2, Bell, Vibrate, Volume2, CheckCircle, Globe, HelpCircle, Info, Check, Search, ChevronDown, Star, Image } from "lucide-vue-next";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-CYHEneUG.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const nameModal = ref(false);
    const passwordModal = ref(false);
    const premiumModal = ref(false);
    const soundModal = ref(null);
    const helpModal = ref(false);
    const aboutModal = ref(false);
    const avatarModal = ref(false);
    const showLogout = ref(false);
    const comingSoonVisible = ref(false);
    const newName = ref(authStore.user?.name || "");
    const nameError = ref("");
    const passwordForm = reactive({
      current: "",
      next: "",
      confirm: ""
    });
    const passwordErrors = reactive({
      current: "",
      next: "",
      confirm: ""
    });
    const faqSearch = ref("");
    const faqItems = ref(faqData.map((f) => ({ ...f, open: false })));
    const filteredFaq = computed(() => {
      if (!faqSearch.value) return faqItems.value;
      return faqItems.value.filter(
        (f) => f.question.toLowerCase().includes(faqSearch.value.toLowerCase())
      );
    });
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const taskGroups = [
      { id: "overdue", label: "Просрочено", color: "#FF3B30" },
      { id: "today", label: "Сегодня", color: "#FF9500" },
      { id: "tomorrow", label: "Завтра", color: "#007AFF" },
      { id: "later", label: "Позже", color: "#AF52DE" },
      { id: "nodate", label: "Без срока", color: "#8E8E93" },
      { id: "completed", label: "Готово", color: "#21A038" }
    ];
    const premiumFeatures = [
      "Синхронизация между устройствами",
      "Неограниченные задачи и списки",
      "Расширенная статистика",
      "Темная тема",
      "Облачный бекап"
    ];
    function showComingSoon() {
      comingSoonVisible.value = true;
      setTimeout(() => {
        comingSoonVisible.value = false;
      }, 2500);
    }
    function shareApp() {
      if ((void 0).share) {
        (void 0).share({ title: "Otter - Планировщик", url: (void 0).location.origin });
      } else {
        showComingSoon();
      }
    }
    function getSound(soundId) {
      return soundOptions.find((s) => s.id === soundId)?.name || "";
    }
    function getCurrentSound(modal) {
      if (modal === "notification") return settingsStore.appSettings.notificationSound;
      return settingsStore.appSettings.completionSound;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SettingsSettingsRow = resolveComponent("SettingsSettingsRow");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))} data-v-9ad57962><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "px-4 pt-14 pb-4"])}" data-v-9ad57962><div class="flex items-center justify-between" data-v-9ad57962><h1 class="text-xl font-bold text-sber-black" data-v-9ad57962>Настройки</h1><button class="text-sm font-semibold text-red-500" data-v-9ad57962> Выйти </button></div></div><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"])}" data-v-9ad57962><div class="flex items-center gap-4" data-v-9ad57962><div class="relative" data-v-9ad57962><div class="${ssrRenderClass([unref(authStore).user?.isPremium ? "ring-2 ring-yellow-400 ring-offset-2" : "", "w-16 h-16 rounded-full overflow-hidden"])}" data-v-9ad57962>`);
      if (!unref(authStore).user?.avatar) {
        _push(`<div class="w-full h-full bg-sber-green flex items-center justify-center" data-v-9ad57962><span class="text-white text-2xl font-bold" data-v-9ad57962>${ssrInterpolate(unref(authStore).user?.name?.[0]?.toUpperCase() || "A")}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover" data-v-9ad57962>`);
      }
      _push(`</div><div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full flex items-center justify-center" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-3 h-3 text-white" }, null, _parent));
      _push(`</div></div><div class="flex-1" data-v-9ad57962><div class="flex items-center gap-2" data-v-9ad57962><p class="text-base font-bold text-sber-black" data-v-9ad57962>${ssrInterpolate(unref(authStore).user?.name)}</p>`);
      if (unref(authStore).user?.isPremium) {
        _push(`<span class="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full" data-v-9ad57962> ⭐ ПРЕМИУМ </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-sm text-sber-gray" data-v-9ad57962>${ssrInterpolate(unref(authStore).user?.email)}</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-gray-mid flex-shrink-0" }, null, _parent));
      _push(`</div></button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>Аккаунт</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Имя",
        value: unref(authStore).user?.name,
        onClick: ($event) => nameModal.value = true
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
        label: "Профиль",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/app/profile")
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
        onClick: ($event) => showComingSoon()
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>Приложение</p><div class="border-b border-sber-gray-light px-4 py-4" data-v-9ad57962><div class="flex items-start gap-3" data-v-9ad57962><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black"])}" data-v-9ad57962>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-9ad57962><div class="flex flex-wrap items-center gap-2" data-v-9ad57962><p class="text-sm font-semibold text-sber-black" data-v-9ad57962>Переключение темы</p><span class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue-light text-sber-blue" : "bg-sber-green-light text-sber-green", "rounded-full px-2 py-0.5 text-[11px] font-semibold"])}" data-v-9ad57962>${ssrInterpolate(unref(isDarkTheme) ? "Dark" : "Light")}</span></div><p class="mt-1 text-xs leading-5 text-sber-gray" data-v-9ad57962> Интерфейс переключается мгновенно и сохраняет выбранное оформление. </p><div class="mt-3 flex flex-wrap items-center gap-3" data-v-9ad57962><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white", "group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"])}" data-v-9ad57962><span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-v-9ad57962></span><span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" data-v-9ad57962>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</span></button><button type="button" class="${ssrRenderClass([!unref(isDarkTheme) ? "bg-sber-green text-white" : "bg-[#20242d] text-slate-300", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-9ad57962> Светлая </button><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue text-white" : "bg-sber-gray-light text-sber-gray", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-9ad57962> Тёмная </button></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Оформление",
        onClick: ($event) => showComingSoon()
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
        label: "Формат даты и времени",
        onClick: ($event) => showComingSoon()
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
        label: "Импорт данных",
        onClick: ($event) => showComingSoon()
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
        label: "Поделиться приложением",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>Звуки и уведомления</p><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>Уведомления</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Vibrate), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>Вибрация</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div>`);
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>Разделы списка</p><!--[-->`);
      ssrRenderList(taskGroups, (group) => {
        _push(`<div class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0" data-v-9ad57962><div class="w-3 h-3 rounded-full mr-3" style="${ssrRenderStyle({ backgroundColor: group.color })}" data-v-9ad57962></div><span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>${ssrInterpolate(group.label)}</span><button class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>Общее</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Язык",
        value: "Русский"
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
      _push(`</div><div class="h-8" data-v-9ad57962></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>Имя</h3><input${ssrRenderAttr("value", unref(newName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameError) }, "input-field mb-2"])}" placeholder="Введите имя" required data-v-9ad57962>`);
          if (unref(nameError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(nameError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3" data-v-9ad57962>Сохранить</button><button class="btn-secondary" data-v-9ad57962>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(passwordModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(passwordModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>Пароль</h3><input${ssrRenderAttr("value", unref(passwordForm).current)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).current }, "input-field mb-2"])}" type="password" placeholder="Текущий пароль" required data-v-9ad57962>`);
          if (unref(passwordErrors).current) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).current)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="Новый пароль" required data-v-9ad57962>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="Повторите новый пароль" required data-v-9ad57962>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3" data-v-9ad57962>Сохранить</button><button class="btn-secondary" data-v-9ad57962>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(premiumModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(premiumModal)) {
          _push2(`<div class="app-modal px-5 py-6" data-v-9ad57962><div class="text-center mb-6" data-v-9ad57962><div class="text-4xl mb-3" data-v-9ad57962>⭐</div><h3 class="text-xl font-bold text-sber-black" data-v-9ad57962>Otter Premium</h3><p class="text-sm text-sber-gray mt-1" data-v-9ad57962>Больше функций в приложении</p></div><div class="space-y-3 mb-6" data-v-9ad57962><!--[-->`);
          ssrRenderList(premiumFeatures, (feat) => {
            _push2(`<div class="flex items-center gap-3" data-v-9ad57962><div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center" data-v-9ad57962>`);
            _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-yellow-600" }, null, _parent));
            _push2(`</div><span class="text-sm text-sber-black" data-v-9ad57962>${ssrInterpolate(feat)}</span></div>`);
          });
          _push2(`<!--]--></div><button class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90" data-v-9ad57962> Премиум за 299 ₽/месяц </button><p class="text-center text-xs text-sber-gray mt-3" data-v-9ad57962> Оплата через Робокассу. Подписку можно отменить в любой момент. </p><button class="btn-secondary mt-2" data-v-9ad57962>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(soundModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(soundModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>${ssrInterpolate(unref(soundModal) === "notification" ? "Звук уведомления" : "Звук подтверждения")}</h3><div class="flex flex-col gap-2" data-v-9ad57962><!--[-->`);
          ssrRenderList(unref(soundOptions), (s) => {
            _push2(`<button class="${ssrRenderClass([getCurrentSound(unref(soundModal)) === s.id ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"])}" data-v-9ad57962><span class="text-xl" data-v-9ad57962>${ssrInterpolate(s.icon)}</span><span class="text-sm font-medium text-sber-black" data-v-9ad57962>${ssrInterpolate(s.name)}</span>`);
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
        if (unref(helpModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(helpModal)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-9ad57962><h3 class="text-lg font-bold mb-1" data-v-9ad57962>Центр помощи</h3><div class="relative mb-4" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(faqSearch))} placeholder="Поиск по вопросам..." class="input-field pl-11 py-3 text-sm" data-v-9ad57962></div><!--[-->`);
          ssrRenderList(unref(filteredFaq), (faq) => {
            _push2(`<div class="mb-3" data-v-9ad57962><button class="w-full text-left" data-v-9ad57962><div class="flex items-start justify-between gap-2 py-2" data-v-9ad57962><span class="text-sm font-semibold text-sber-black" data-v-9ad57962>${ssrInterpolate(faq.question)}</span>`);
            _push2(ssrRenderComponent(unref(ChevronDown), {
              class: ["w-4 h-4 text-sber-gray flex-shrink-0 mt-0.5", faq.open ? "rotate-180" : ""]
            }, null, _parent));
            _push2(`</div></button>`);
            if (faq.open) {
              _push2(`<p class="text-sm text-sber-gray pb-2 leading-relaxed" data-v-9ad57962>${ssrInterpolate(faq.answer)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="h-px bg-sber-gray-light" data-v-9ad57962></div></div>`);
          });
          _push2(`<!--]--><button class="btn-primary mt-4" data-v-9ad57962>Связаться с нами</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(aboutModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(aboutModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><div class="text-center mb-6" data-v-9ad57962><div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sber-green to-sber-blue mx-auto mb-3 flex items-center justify-center" data-v-9ad57962><span class="text-white font-bold text-2xl" data-v-9ad57962>🦦</span></div><h3 class="text-lg font-bold" data-v-9ad57962>Otter</h3><p class="text-sm text-sber-gray" data-v-9ad57962>Версия 1.0.0</p></div><div class="space-y-2" data-v-9ad57962><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-9ad57962>Оценить в RuStore</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-9ad57962>Оценить в Google Play</span></button></div><button class="btn-secondary mt-4" data-v-9ad57962>Закрыть</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showLogout)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showLogout)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold text-center mb-2" data-v-9ad57962>Выйти из профиля?</h3><p class="text-sm text-sber-gray text-center mb-6" data-v-9ad57962>Вы сможете войти снова в любое время.</p><button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" data-v-9ad57962> Выйти </button><button class="btn-secondary" data-v-9ad57962>Отмена</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(comingSoonVisible)) {
          _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center" data-v-9ad57962> Скоро появится </div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(avatarModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(avatarModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>Фото профиля</h3><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` Сделать фото </button><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-3" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` Выбрать из галереи </button><button class="btn-secondary" data-v-9ad57962>Отмена</button></div>`);
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
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9ad57962"]]);
export {
  settings as default
};
//# sourceMappingURL=settings-DG_Tfk-r.js.map
