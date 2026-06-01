import { defineComponent, withAsyncContext, useSSRContext } from "vue";
import { n as navigateTo } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "vue/server-renderer";
import "lucide-vue-next";
import "dayjs/locale/ru.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "matrix",
  async setup(__props) {
    let __temp, __restore;
    [__temp, __restore] = withAsyncContext(() => navigateTo("/app/matrix", { redirectCode: 301 })), await __temp, __restore();
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/matrix.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=matrix-BlkikQGg.js.map
