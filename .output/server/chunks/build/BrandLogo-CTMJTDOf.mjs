import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { l as logoUrl } from './logo-DVdZXLLs.mjs';
import { c as useSettingsStore } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BrandLogo",
  __ssrInlineRender: true,
  props: {
    name: { default: "Otter" },
    textClass: { default: "text-sber-black" },
    showNameFrom: { default: "md" },
    size: { default: "md" },
    centered: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const logoClassMap = {
      sm: "h-9 w-9 rounded-2xl",
      md: "h-11 w-11 rounded-2xl",
      lg: "h-16 w-16 rounded-[22px]"
    };
    const textSizeClassMap = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-3xl"
    };
    const nameClassMap = {
      sm: "hidden sm:inline",
      md: "hidden md:inline",
      lg: "hidden lg:inline",
      always: "inline"
    };
    const settingsStore = useSettingsStore();
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const logoClass = computed(() => logoClassMap[props.size || "md"]);
    const textSizeClass = computed(() => textSizeClassMap[props.size || "md"]);
    const logoToneClass = computed(() => {
      const needsLightLogo = props.textClass.includes("text-white") || isDarkTheme.value;
      return needsLightLogo ? "brightness-0 invert opacity-95" : "brightness-0";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center gap-2", __props.centered ? "justify-center" : ""]
      }, _attrs))}><img${ssrRenderAttr("src", unref(logoUrl))} alt="Otter logo" class="${ssrRenderClass([unref(logoClass), unref(logoToneClass)])}"><span class="${ssrRenderClass([nameClassMap[__props.showNameFrom], __props.textClass, unref(textSizeClass), "font-bold tracking-tight"])}">${ssrInterpolate(__props.name)}</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BrandLogo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BrandLogo-CTMJTDOf.mjs.map
