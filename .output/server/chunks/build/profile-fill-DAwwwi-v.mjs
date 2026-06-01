import { defineComponent, reactive, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Camera } from 'lucide-vue-next';
import { _ as _export_sfc, u as useAuthStore, n as navigateTo } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile-fill",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const authStore = useAuthStore();
    const form = reactive({
      first_name: authStore.profileFirstName || "",
      last_name: authStore.profileLastName || ""
    });
    const errors = reactive({
      first_name: "",
      last_name: "",
      avatar: ""
    });
    const isSubmitting = ref(false);
    ref(null);
    const avatarPreview = ref(((_a = authStore.user) == null ? void 0 : _a.avatar) || "");
    ref(null);
    ref(null);
    const toast = reactive({
      visible: false,
      type: "success",
      message: ""
    });
    const initials = computed(() => {
      const first = form.first_name.trim().charAt(0);
      const last = form.last_name.trim().charAt(0);
      return `${first}${last}`.trim().toUpperCase() || "U";
    });
    if (!authStore.isLoggedIn) {
      navigateTo("/");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10" }, _attrs))} data-v-a751b2ce><div class="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-sm lg:p-8" data-v-a751b2ce><div class="mb-6 flex justify-center" data-v-a751b2ce><div class="relative" data-v-a751b2ce><div class="h-32 w-32 overflow-hidden rounded-full bg-sber-gray-light ring-2 ring-white shadow-md" data-v-a751b2ce>`);
      if (unref(avatarPreview)) {
        _push(`<img${ssrRenderAttr("src", unref(avatarPreview))} alt="Avatar preview" class="h-full w-full object-cover" data-v-a751b2ce>`);
      } else {
        _push(`<div class="flex h-full w-full items-center justify-center text-4xl font-bold text-sber-gray" data-v-a751b2ce>${ssrInterpolate(unref(initials))}</div>`);
      }
      _push(`</div><button type="button" class="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition hover:brightness-95" data-v-a751b2ce>`);
      _push(ssrRenderComponent(unref(Camera), { class: "h-5 w-5" }, null, _parent));
      _push(`</button><input type="file" accept="image/*" class="hidden" data-v-a751b2ce></div></div><h1 class="text-2xl font-bold text-sber-black" data-v-a751b2ce>\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044C</h1><p class="mt-2 text-sm text-sber-gray" data-v-a751b2ce>\u0418\u043C\u044F \u0438 \u0444\u0430\u043C\u0438\u043B\u0438\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B. \u0410\u0432\u0430\u0442\u0430\u0440 \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E.</p><form class="mt-6 space-y-4" data-v-a751b2ce><div data-v-a751b2ce><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-a751b2ce>\u0418\u043C\u044F</label><input${ssrRenderAttr("value", unref(form).first_name)} type="text" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).first_name }, "input-field"])}" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F" data-v-a751b2ce>`);
      if (unref(errors).first_name) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-a751b2ce>${ssrInterpolate(unref(errors).first_name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-a751b2ce><label class="mb-2 block text-sm font-medium text-sber-gray" data-v-a751b2ce>\u0424\u0430\u043C\u0438\u043B\u0438\u044F</label><input${ssrRenderAttr("value", unref(form).last_name)} type="text" class="${ssrRenderClass([{ "border-red-400 bg-red-50": unref(errors).last_name }, "input-field"])}" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E" data-v-a751b2ce>`);
      if (unref(errors).last_name) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-a751b2ce>${ssrInterpolate(unref(errors).last_name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(errors).avatar) {
        _push(`<p class="mt-1 ml-1 text-xs text-red-500" data-v-a751b2ce>${ssrInterpolate(unref(errors).avatar)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(toast).visible) {
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "border border-sber-green bg-sber-green-light" : "border border-red-300 bg-red-50", "mt-2 flex items-center gap-3 rounded-2xl px-4 py-3"])}" data-v-a751b2ce><p class="${ssrRenderClass([unref(toast).type === "success" ? "text-sber-green" : "text-red-600", "text-sm font-medium"])}" data-v-a751b2ce>${ssrInterpolate(unref(toast).message)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60" type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-a751b2ce>${ssrInterpolate(unref(isSubmitting) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C")}</button></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile-fill.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profileFill = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a751b2ce"]]);

export { profileFill as default };
//# sourceMappingURL=profile-fill-DAwwwi-v.mjs.map
