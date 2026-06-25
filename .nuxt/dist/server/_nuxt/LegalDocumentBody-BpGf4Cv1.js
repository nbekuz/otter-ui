import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList } from "vue/server-renderer";
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
      const lines = props.content.split("\n");
      let index = 0;
      while (index < lines.length) {
        const rawLine = lines[index] ?? "";
        const line = rawLine.trim();
        if (!line || line.startsWith("_")) {
          index += 1;
          continue;
        }
        if (line.startsWith("|")) {
          const tableLines = [];
          while (index < lines.length && (lines[index] ?? "").trim().startsWith("|")) {
            tableLines.push((lines[index] ?? "").trim());
            index += 1;
          }
          const tableBlock = parseTable(tableLines);
          if (tableBlock) result.push(tableBlock);
          continue;
        }
        if (line.startsWith("- ")) {
          const items = [];
          while (index < lines.length) {
            const listLine = (lines[index] ?? "").trim();
            if (!listLine.startsWith("- ")) break;
            items.push(formatInline(listLine.slice(2).trim()));
            index += 1;
          }
          result.push({ kind: "list", items });
          continue;
        }
        if (line.startsWith("### ")) {
          result.push({ kind: "h3", html: formatInline(line.slice(4).trim()) });
          index += 1;
          continue;
        }
        if (line.startsWith("## ")) {
          result.push({ kind: "h2", html: formatInline(line.slice(3).trim()) });
          index += 1;
          continue;
        }
        if (line.startsWith("# ")) {
          result.push({ kind: "h1", html: formatInline(line.slice(2).trim()) });
          index += 1;
          continue;
        }
        result.push({ kind: "p", html: formatInline(line) });
        index += 1;
      }
      if (result[0]?.kind === "h1") {
        result.shift();
      }
      return result;
    });
    function parseTable(lines) {
      if (lines.length < 2) return null;
      const rows = lines.map(parseTableRow);
      const [headers, separator, ...body] = rows;
      if (!headers || !separator || !separator.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")))) {
        return null;
      }
      return {
        kind: "table",
        headers: headers.map(formatInline),
        rows: body.map((row) => row.map(formatInline))
      };
    }
    function parseTableRow(line) {
      return line.split("|").slice(1, -1).map((cell) => cell.trim());
    }
    function formatInline(value) {
      let html = escapeHtml(value);
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => {
        const safeHref = escapeAttribute(href);
        return `<a href="${safeHref}" class="font-medium text-sber-green underline underline-offset-2">${label}</a>`;
      });
      return html;
    }
    function escapeHtml(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function escapeAttribute(value) {
      return escapeHtml(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "legal-document-body space-y-4 text-sm leading-relaxed text-sber-gray" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(blocks), (block, index) => {
        _push(`<!--[-->`);
        if (block.kind === "h1") {
          _push(`<h1 class="text-lg font-bold text-sber-black">${block.html ?? ""}</h1>`);
        } else if (block.kind === "h2") {
          _push(`<h2 class="pt-2 text-base font-semibold text-sber-black">${block.html ?? ""}</h2>`);
        } else if (block.kind === "h3") {
          _push(`<h3 class="pt-1 text-sm font-semibold text-sber-black">${block.html ?? ""}</h3>`);
        } else if (block.kind === "p") {
          _push(`<p class="whitespace-pre-wrap">${block.html ?? ""}</p>`);
        } else if (block.kind === "list") {
          _push(`<ul class="list-disc space-y-2 pl-5"><!--[-->`);
          ssrRenderList(block.items, (item, itemIndex) => {
            _push(`<li>${item ?? ""}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else if (block.kind === "table") {
          _push(`<div class="overflow-x-auto"><table class="min-w-full border-collapse text-left text-sm text-sber-gray"><thead><tr><!--[-->`);
          ssrRenderList(block.headers, (header, headerIndex) => {
            _push(`<th class="border border-sber-gray-light bg-sber-gray-light px-3 py-2 font-semibold text-sber-black">${header ?? ""}</th>`);
          });
          _push(`<!--]--></tr></thead><tbody><!--[-->`);
          ssrRenderList(block.rows, (row, rowIndex) => {
            _push(`<tr><!--[-->`);
            ssrRenderList(row, (cell, cellIndex) => {
              _push(`<td class="border border-sber-gray-light px-3 py-2 align-top">${cell ?? ""}</td>`);
            });
            _push(`<!--]--></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
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
//# sourceMappingURL=LegalDocumentBody-BpGf4Cv1.js.map
