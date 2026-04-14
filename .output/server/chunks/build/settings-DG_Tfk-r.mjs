import { u as useSettingsStore, f as faqData, n as navigateTo, s as soundOptions } from './server.mjs';
import { defineComponent, ref, reactive, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { Camera, ChevronRight, User, Lock, Smartphone, Crown, Sun, Moon, EyeOff, Clock, Download, Share2, Bell, Vibrate, Volume2, CheckCircle, Globe, HelpCircle, Info, Check, Search, ChevronDown, Star, Image } from 'lucide-vue-next';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
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
    const newName = ref(((_a = authStore.user) == null ? void 0 : _a.name) || "");
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
      { id: "overdue", label: "\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E", color: "#FF3B30" },
      { id: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", color: "#FF9500" },
      { id: "tomorrow", label: "\u0417\u0430\u0432\u0442\u0440\u0430", color: "#007AFF" },
      { id: "later", label: "\u041F\u043E\u0437\u0436\u0435", color: "#AF52DE" },
      { id: "nodate", label: "\u0411\u0435\u0437 \u0441\u0440\u043E\u043A\u0430", color: "#8E8E93" },
      { id: "completed", label: "\u0413\u043E\u0442\u043E\u0432\u043E", color: "#21A038" }
    ];
    const premiumFeatures = [
      "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u0435\u0436\u0434\u0443 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438",
      "\u041D\u0435\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043F\u0438\u0441\u043A\u0438",
      "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430",
      "\u0422\u0435\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
      "\u041E\u0431\u043B\u0430\u0447\u043D\u044B\u0439 \u0431\u0435\u043A\u0430\u043F"
    ];
    function showComingSoon() {
      comingSoonVisible.value = true;
      setTimeout(() => {
        comingSoonVisible.value = false;
      }, 2500);
    }
    function shareApp() {
      if ((void 0).share) {
        (void 0).share({ title: "Otter - \u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A", url: (void 0).location.origin });
      } else {
        showComingSoon();
      }
    }
    function getSound(soundId) {
      var _a2;
      return ((_a2 = soundOptions.find((s) => s.id === soundId)) == null ? void 0 : _a2.name) || "";
    }
    function getCurrentSound(modal) {
      if (modal === "notification") return settingsStore.appSettings.notificationSound;
      return settingsStore.appSettings.completionSound;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_SettingsSettingsRow = resolveComponent("SettingsSettingsRow");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))} data-v-9ad57962><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a] shadow-none" : "bg-white shadow-sm", "px-4 pt-14 pb-4"])}" data-v-9ad57962><div class="flex items-center justify-between" data-v-9ad57962><h1 class="text-xl font-bold text-sber-black" data-v-9ad57962>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h1><button class="text-sm font-semibold text-red-500" data-v-9ad57962> \u0412\u044B\u0439\u0442\u0438 </button></div></div><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"])}" data-v-9ad57962><div class="flex items-center gap-4" data-v-9ad57962><div class="relative" data-v-9ad57962><div class="${ssrRenderClass([((_a2 = unref(authStore).user) == null ? void 0 : _a2.isPremium) ? "ring-2 ring-yellow-400 ring-offset-2" : "", "w-16 h-16 rounded-full overflow-hidden"])}" data-v-9ad57962>`);
      if (!((_b = unref(authStore).user) == null ? void 0 : _b.avatar)) {
        _push(`<div class="w-full h-full bg-sber-green flex items-center justify-center" data-v-9ad57962><span class="text-white text-2xl font-bold" data-v-9ad57962>${ssrInterpolate(((_e = (_d = (_c = unref(authStore).user) == null ? void 0 : _c.name) == null ? void 0 : _d[0]) == null ? void 0 : _e.toUpperCase()) || "A")}</span></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="w-full h-full object-cover" data-v-9ad57962>`);
      }
      _push(`</div><div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full flex items-center justify-center" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-3 h-3 text-white" }, null, _parent));
      _push(`</div></div><div class="flex-1" data-v-9ad57962><div class="flex items-center gap-2" data-v-9ad57962><p class="text-base font-bold text-sber-black" data-v-9ad57962>${ssrInterpolate((_f = unref(authStore).user) == null ? void 0 : _f.name)}</p>`);
      if ((_g = unref(authStore).user) == null ? void 0 : _g.isPremium) {
        _push(`<span class="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full" data-v-9ad57962> \u2B50 \u041F\u0420\u0415\u041C\u0418\u0423\u041C </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-sm text-sber-gray" data-v-9ad57962>${ssrInterpolate((_h = unref(authStore).user) == null ? void 0 : _h.email)}</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-gray-mid flex-shrink-0" }, null, _parent));
      _push(`</div></button><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u0418\u043C\u044F",
        value: (_i = unref(authStore).user) == null ? void 0 : _i.name,
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
        label: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C",
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435</p><div class="border-b border-sber-gray-light px-4 py-4" data-v-9ad57962><div class="flex items-start gap-3" data-v-9ad57962><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black"])}" data-v-9ad57962>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-9ad57962><div class="flex flex-wrap items-center gap-2" data-v-9ad57962><p class="text-sm font-semibold text-sber-black" data-v-9ad57962>\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0442\u0435\u043C\u044B</p><span class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue-light text-sber-blue" : "bg-sber-green-light text-sber-green", "rounded-full px-2 py-0.5 text-[11px] font-semibold"])}" data-v-9ad57962>${ssrInterpolate(unref(isDarkTheme) ? "Dark" : "Light")}</span></div><p class="mt-1 text-xs leading-5 text-sber-gray" data-v-9ad57962> \u0418\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435. </p><div class="mt-3 flex flex-wrap items-center gap-3" data-v-9ad57962><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white", "group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"])}" data-v-9ad57962><span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-v-9ad57962></span><span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" data-v-9ad57962>`);
      if (unref(isDarkTheme)) {
        _push(ssrRenderComponent(unref(Sun), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</span></button><button type="button" class="${ssrRenderClass([!unref(isDarkTheme) ? "bg-sber-green text-white" : "bg-[#20242d] text-slate-300", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-9ad57962> \u0421\u0432\u0435\u0442\u043B\u0430\u044F </button><button type="button" class="${ssrRenderClass([unref(isDarkTheme) ? "bg-sber-blue text-white" : "bg-sber-gray-light text-sber-gray", "rounded-xl px-3 py-2 text-sm font-medium transition-colors"])}" data-v-9ad57962> \u0422\u0451\u043C\u043D\u0430\u044F </button></div></div></div></div>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435",
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
        label: "\u0424\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u0442\u044B \u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0438",
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
        label: "\u0418\u043C\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445",
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
        label: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C",
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>\u0417\u0432\u0443\u043A\u0438 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</p><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).appSettings.notifications ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div><div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light" data-v-9ad57962>`);
      _push(ssrRenderComponent(unref(Vibrate), { class: "w-5 h-5 text-sber-gray mr-3" }, null, _parent));
      _push(`<span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>\u0412\u0438\u0431\u0440\u0430\u0446\u0438\u044F</span><button class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).appSettings.vibration ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
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
      _push(`</div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>\u0420\u0430\u0437\u0434\u0435\u043B\u044B \u0441\u043F\u0438\u0441\u043A\u0430</p><!--[-->`);
      ssrRenderList(taskGroups, (group) => {
        _push(`<div class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0" data-v-9ad57962><div class="w-3 h-3 rounded-full mr-3" style="${ssrRenderStyle({ backgroundColor: group.color })}" data-v-9ad57962></div><span class="text-sm font-medium text-sber-black flex-1" data-v-9ad57962>${ssrInterpolate(group.label)}</span><button class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "bg-sber-green" : "bg-sber-gray-mid", "w-12 h-6 rounded-full transition-colors relative"])}" data-v-9ad57962><div class="${ssrRenderClass([unref(settingsStore).isGroupVisible(group.id) ? "translate-x-7" : "translate-x-1", "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"])}" data-v-9ad57962></div></button></div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border border-[#2a303a] shadow-none" : "bg-white shadow-sm", "mx-4 mt-4 rounded-2xl overflow-hidden"])}" data-v-9ad57962><p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide" data-v-9ad57962>\u041E\u0431\u0449\u0435\u0435</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u042F\u0437\u044B\u043A",
        value: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
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
        label: "\u0426\u0435\u043D\u0442\u0440 \u043F\u043E\u043C\u043E\u0449\u0438",
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
      _push(`</div><div class="h-8" data-v-9ad57962></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay" data-v-9ad57962></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>\u0418\u043C\u044F</h3><input${ssrRenderAttr("value", unref(newName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameError) }, "input-field mb-2"])}" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F" required data-v-9ad57962>`);
          if (unref(nameError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(nameError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3" data-v-9ad57962>\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button><button class="btn-secondary" data-v-9ad57962>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>\u041F\u0430\u0440\u043E\u043B\u044C</h3><input${ssrRenderAttr("value", unref(passwordForm).current)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).current }, "input-field mb-2"])}" type="password" placeholder="\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required data-v-9ad57962>`);
          if (unref(passwordErrors).current) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).current)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required data-v-9ad57962>`);
          if (unref(passwordErrors).next) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).next)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).confirm)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).confirm }, "input-field mb-2"])}" type="password" placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required data-v-9ad57962>`);
          if (unref(passwordErrors).confirm) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500" data-v-9ad57962>${ssrInterpolate(unref(passwordErrors).confirm)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3" data-v-9ad57962>\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button><button class="btn-secondary" data-v-9ad57962>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-6" data-v-9ad57962><div class="text-center mb-6" data-v-9ad57962><div class="text-4xl mb-3" data-v-9ad57962>\u2B50</div><h3 class="text-xl font-bold text-sber-black" data-v-9ad57962>Otter Premium</h3><p class="text-sm text-sber-gray mt-1" data-v-9ad57962>\u0411\u043E\u043B\u044C\u0448\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0439 \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438</p></div><div class="space-y-3 mb-6" data-v-9ad57962><!--[-->`);
          ssrRenderList(premiumFeatures, (feat) => {
            _push2(`<div class="flex items-center gap-3" data-v-9ad57962><div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center" data-v-9ad57962>`);
            _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-yellow-600" }, null, _parent));
            _push2(`</div><span class="text-sm text-sber-black" data-v-9ad57962>${ssrInterpolate(feat)}</span></div>`);
          });
          _push2(`<!--]--></div><button class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90" data-v-9ad57962> \u041F\u0440\u0435\u043C\u0438\u0443\u043C \u0437\u0430 299 \u20BD/\u043C\u0435\u0441\u044F\u0446 </button><p class="text-center text-xs text-sber-gray mt-3" data-v-9ad57962> \u041E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0420\u043E\u0431\u043E\u043A\u0430\u0441\u0441\u0443. \u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0443 \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0432 \u043B\u044E\u0431\u043E\u0439 \u043C\u043E\u043C\u0435\u043D\u0442. </p><button class="btn-secondary mt-2" data-v-9ad57962>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>${ssrInterpolate(unref(soundModal) === "notification" ? "\u0417\u0432\u0443\u043A \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" : "\u0417\u0432\u0443\u043A \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F")}</h3><div class="flex flex-col gap-2" data-v-9ad57962><!--[-->`);
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
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}" data-v-9ad57962><h3 class="text-lg font-bold mb-1" data-v-9ad57962>\u0426\u0435\u043D\u0442\u0440 \u043F\u043E\u043C\u043E\u0449\u0438</h3><div class="relative mb-4" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", unref(faqSearch))} placeholder="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0432\u043E\u043F\u0440\u043E\u0441\u0430\u043C..." class="input-field pl-11 py-3 text-sm" data-v-9ad57962></div><!--[-->`);
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
          _push2(`<!--]--><button class="btn-primary mt-4" data-v-9ad57962>\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043D\u0430\u043C\u0438</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><div class="text-center mb-6" data-v-9ad57962><div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sber-green to-sber-blue mx-auto mb-3 flex items-center justify-center" data-v-9ad57962><span class="text-white font-bold text-2xl" data-v-9ad57962>\u{1F9A6}</span></div><h3 class="text-lg font-bold" data-v-9ad57962>Otter</h3><p class="text-sm text-sber-gray" data-v-9ad57962>\u0412\u0435\u0440\u0441\u0438\u044F 1.0.0</p></div><div class="space-y-2" data-v-9ad57962><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-9ad57962>\u041E\u0446\u0435\u043D\u0438\u0442\u044C \u0432 RuStore</span></button><button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-sber-gray" }, null, _parent));
          _push2(`<span class="text-sm" data-v-9ad57962>\u041E\u0446\u0435\u043D\u0438\u0442\u044C \u0432 Google Play</span></button></div><button class="btn-secondary mt-4" data-v-9ad57962>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold text-center mb-2" data-v-9ad57962>\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u0440\u043E\u0444\u0438\u043B\u044F?</h3><p class="text-sm text-sber-gray text-center mb-6" data-v-9ad57962>\u0412\u044B \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0432\u043E\u0439\u0442\u0438 \u0441\u043D\u043E\u0432\u0430 \u0432 \u043B\u044E\u0431\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.</p><button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" data-v-9ad57962> \u0412\u044B\u0439\u0442\u0438 </button><button class="btn-secondary" data-v-9ad57962>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(comingSoonVisible)) {
          _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center" data-v-9ad57962> \u0421\u043A\u043E\u0440\u043E \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F </div>`);
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
          _push2(`<div class="app-modal px-5 py-5" data-v-9ad57962><h3 class="text-lg font-bold mb-4" data-v-9ad57962>\u0424\u043E\u0442\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F</h3><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Camera), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` \u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0444\u043E\u0442\u043E </button><button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-3" data-v-9ad57962>`);
          _push2(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
          _push2(` \u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0433\u0430\u043B\u0435\u0440\u0435\u0438 </button><button class="btn-secondary" data-v-9ad57962>\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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

export { settings as default };
//# sourceMappingURL=settings-DG_Tfk-r.mjs.map
