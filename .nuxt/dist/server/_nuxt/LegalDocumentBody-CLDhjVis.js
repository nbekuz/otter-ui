import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LegalDocumentBody",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const blocks = computed(() => {
      const result = [];
      for (const rawLine of props.content.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("_")) continue;
        if (line.startsWith("# ")) {
          result.push({ kind: "h1", text: line.slice(2).trim() });
          continue;
        }
        if (line.startsWith("## ")) {
          result.push({ kind: "h2", text: line.slice(3).trim() });
          continue;
        }
        result.push({ kind: "p", text: line.replace(/\*\*/g, "") });
      }
      return result;
    });
    function blockClass(block) {
      if (block.kind === "h1") {
        return "text-lg font-bold text-sber-black";
      }
      if (block.kind === "h2") {
        return "pt-2 text-base font-semibold text-sber-black";
      }
      return "whitespace-pre-wrap";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "legal-document-body space-y-3 text-sm leading-relaxed text-sber-gray" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(blocks), (block, index) => {
        _push(`<p class="${ssrRenderClass(blockClass(block))}">${ssrInterpolate(block.text)}</p>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LegalDocumentBody.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=LegalDocumentBody-CLDhjVis.js.map
