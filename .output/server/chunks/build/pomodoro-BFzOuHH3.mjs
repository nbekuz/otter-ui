import { defineComponent, withAsyncContext, useSSRContext } from 'vue';
import { n as navigateTo } from './server.mjs';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';
import 'axios';
import 'dayjs';
import 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pomodoro",
  async setup(__props) {
    let __temp, __restore;
    [__temp, __restore] = withAsyncContext(() => navigateTo("/app/pomodoro", { redirectCode: 301 })), await __temp, __restore();
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pomodoro.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pomodoro-BFzOuHH3.mjs.map
