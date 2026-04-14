import { defineComponent, ref, reactive, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { ChevronLeft, Camera, User, Mail, Lock, Settings, ChevronRight, Crown } from 'lucide-vue-next';
import { u as useAuthStore } from './auth-CYHEneUG.mjs';
import { u as useTasksStore } from './tasks-BcYdj5cJ.mjs';
import './server.mjs';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const authStore = useAuthStore();
    const tasksStore = useTasksStore();
    const nameModal = ref(false);
    const passwordModal = ref(false);
    const avatarModal = ref(false);
    const premiumModal = ref(false);
    const showLogout = ref(false);
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
    const initials = computed(() => {
      var _a2, _b, _c;
      return ((_c = (_b = (_a2 = authStore.user) == null ? void 0 : _a2.name) == null ? void 0 : _b[0]) == null ? void 0 : _c.toUpperCase()) || "A";
    });
    const stats = computed(() => {
      var _a2, _b;
      return [
        {
          label: "\u0417\u0430\u0434\u0430\u0447\u0438",
          value: tasksStore.tasks.length,
          caption: "\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u0434\u0430\u0447 \u0432 \u0432\u0430\u0448\u0435\u043C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435"
        },
        {
          label: "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",
          value: tasksStore.completedTasks.length,
          caption: "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0445 \u0437\u0430\u0434\u0430\u0447 \u043D\u0430 \u0434\u0430\u043D\u043D\u044B\u0439 \u043C\u043E\u043C\u0435\u043D\u0442"
        },
        {
          label: "\u0421\u0442\u0430\u0442\u0443\u0441",
          value: ((_a2 = authStore.user) == null ? void 0 : _a2.isPremium) ? "PRO" : "FREE",
          caption: ((_b = authStore.user) == null ? void 0 : _b.isPremium) ? "\u041F\u0440\u0435\u043C\u0438\u0443\u043C \u0430\u043A\u0442\u0438\u0432\u0435\u043D" : "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 \u0442\u0430\u0440\u0438\u0444"
        }
      ];
    });
    const avatarOptions = computed(() => {
      const letter = initials.value;
      const makeAvatar = (id, from, to, label) => ({
        id,
        label,
        url: `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${from}" />
            <stop offset="100%" stop-color="${to}" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="32" fill="url(#g)"/>
        <circle cx="64" cy="46" r="18" fill="rgba(255,255,255,0.22)"/>
        <text x="64" y="78" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="white">${letter}</text>
      </svg>`
        )}`
      });
      return [
        makeAvatar("green", "#21A038", "#007AFF", "Green"),
        makeAvatar("violet", "#7C3AED", "#EC4899", "Violet"),
        makeAvatar("sunset", "#F59E0B", "#EF4444", "Sunset"),
        makeAvatar("sky", "#0EA5E9", "#22C55E", "Sky"),
        makeAvatar("midnight", "#334155", "#0F172A", "Midnight"),
        makeAvatar("peach", "#FB7185", "#F59E0B", "Peach")
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g;
      const _component_SettingsSettingsRow = resolveComponent("SettingsSettingsRow");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="bg-white px-4 pt-14 pb-4 shadow-sm lg:px-6"><div class="flex items-center gap-3"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div><p class="text-xs text-sber-gray">\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p><h1 class="text-xl font-bold text-sber-black">\u041F\u0440\u043E\u0444\u0438\u043B\u044C</h1></div></div></div><div class="mx-auto w-full max-w-5xl px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-4 lg:px-6"><div class="space-y-4"><div class="rounded-[28px] bg-white p-5 shadow-sm"><div class="flex flex-col gap-5 sm:flex-row sm:items-center"><button class="relative self-start" type="button"><div class="${ssrRenderClass([((_a2 = unref(authStore).user) == null ? void 0 : _a2.isPremium) ? "ring-2 ring-yellow-400 ring-offset-2" : "", "h-24 w-24 overflow-hidden rounded-[28px]"])}">`);
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
      _push(`</div><p class="mt-1 truncate text-sm text-sber-gray">${ssrInterpolate((_e = unref(authStore).user) == null ? void 0 : _e.email)}</p><div class="mt-4 flex flex-wrap gap-3"><button class="rounded-2xl bg-sber-green px-4 py-2.5 text-sm font-semibold text-white" type="button"> \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043C\u044F </button><button class="rounded-2xl bg-sber-gray-light px-4 py-2.5 text-sm font-semibold text-sber-black" type="button"> \u0421\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C </button></div></div></div></div><div class="grid grid-cols-2 gap-3 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="rounded-2xl bg-white px-4 py-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">${ssrInterpolate(stat.label)}</p><p class="mt-2 text-2xl font-bold text-sber-black">${ssrInterpolate(stat.value)}</p><p class="mt-1 text-xs leading-5 text-sber-gray">${ssrInterpolate(stat.caption)}</p></div>`);
      });
      _push(`<!--]--></div><div class="overflow-hidden rounded-2xl bg-white shadow-sm"><p class="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-sber-gray">\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</p>`);
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u0418\u043C\u044F",
        value: (_f = unref(authStore).user) == null ? void 0 : _f.name,
        onClick: ($event) => nameModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(User), { class: "mr-3 h-5 w-5 text-sber-gray" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(User), { class: "mr-3 h-5 w-5 text-sber-gray" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "Email",
        value: (_g = unref(authStore).user) == null ? void 0 : _g.email
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Mail), { class: "mr-3 h-5 w-5 text-sber-gray" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Mail), { class: "mr-3 h-5 w-5 text-sber-gray" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SettingsSettingsRow, {
        label: "\u041F\u0430\u0440\u043E\u043B\u044C",
        value: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
        onClick: ($event) => passwordModal.value = true
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Lock), { class: "mr-3 h-5 w-5 text-sber-gray" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Lock), { class: "mr-3 h-5 w-5 text-sber-gray" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-4 space-y-4 lg:mt-0"><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0410\u043A\u043A\u0430\u0443\u043D\u0442</p><div class="mt-3 space-y-3"><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Settings), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F</p><p class="text-xs text-sber-gray">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F, \u0437\u0432\u0443\u043A\u0438 \u0438 \u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button><button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button">`);
      _push(ssrRenderComponent(unref(Crown), { class: "h-5 w-5 text-yellow-500" }, null, _parent));
      _push(`<div class="flex-1"><p class="text-sm font-semibold text-sber-black">Otter Premium</p><p class="text-xs text-sber-gray">\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0438 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F</p></div>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-sber-gray" }, null, _parent));
      _push(`</button></div></div><div class="rounded-2xl bg-white p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C</p><div class="mt-3 rounded-2xl border border-sber-gray-light p-4"><p class="text-sm font-semibold text-sber-black">\u0414\u0435\u043C\u043E-\u0441\u0435\u0441\u0441\u0438\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0430</p><p class="mt-1 text-xs leading-5 text-sber-gray"> \u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E. \u041F\u0440\u0438 \u0432\u044B\u0445\u043E\u0434\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u0435\u0441\u0441\u0438\u0438 \u0431\u0443\u0434\u0443\u0442 \u043E\u0447\u0438\u0449\u0435\u043D\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435. </p></div><button class="mt-4 w-full rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white" type="button"> \u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 </button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(nameModal)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(nameModal)) {
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-4 text-lg font-bold text-sber-black">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043C\u044F</h3><input${ssrRenderAttr("value", unref(newName))} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(nameError) }, "input-field mb-2"])}" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F" required>`);
          if (unref(nameError)) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(nameError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="btn-primary mb-3" type="button">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button><button class="btn-secondary" type="button">\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-4 text-lg font-bold text-sber-black">\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C</h3><input${ssrRenderAttr("value", unref(passwordForm).current)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).current }, "input-field mb-2"])}" type="password" placeholder="\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required>`);
          if (unref(passwordErrors).current) {
            _push2(`<p class="mb-3 ml-1 text-xs text-red-500">${ssrInterpolate(unref(passwordErrors).current)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<input${ssrRenderAttr("value", unref(passwordForm).next)} class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(passwordErrors).next }, "input-field mb-2"])}" type="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required>`);
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
          _push2(`<button class="btn-primary mb-3" type="button">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button><button class="btn-secondary" type="button">\u041E\u0442\u043C\u0435\u043D\u0430</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-5"><h3 class="mb-4 text-lg font-bold text-sber-black">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0430\u0432\u0430\u0442\u0430\u0440</h3><div class="grid grid-cols-3 gap-3"><!--[-->`);
          ssrRenderList(unref(avatarOptions), (avatar) => {
            var _a3;
            _push2(`<button class="${ssrRenderClass([((_a3 = unref(authStore).user) == null ? void 0 : _a3.avatar) === avatar.url ? "border-sber-green" : "border-transparent", "overflow-hidden rounded-2xl border-2 bg-sber-gray-light p-1 transition-colors"])}" type="button"><img${ssrRenderAttr("src", avatar.url)}${ssrRenderAttr("alt", avatar.label)} class="h-24 w-full rounded-xl object-cover"></button>`);
          });
          _push2(`<!--]--></div><button class="btn-secondary mt-4" type="button">\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button></div>`);
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
          _push2(`<div class="app-modal px-5 py-6"><div class="text-center"><div class="mb-3 text-4xl">\u2B50</div><h3 class="text-xl font-bold text-sber-black">Otter Premium</h3><p class="mt-2 text-sm text-sber-gray">\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u0435\u0436\u0434\u0443 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438, \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u0433\u0438\u0431\u043A\u043E\u0441\u0442\u0438 \u0432 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438.</p></div><button class="mt-6 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white" type="button"> \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C Premium </button><button class="btn-secondary mt-3" type="button">\u041F\u043E\u0437\u0436\u0435</button></div>`);
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
//# sourceMappingURL=profile-CU7WiI37.mjs.map
