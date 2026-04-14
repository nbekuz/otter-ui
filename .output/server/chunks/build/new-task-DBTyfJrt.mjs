import { defineComponent, reactive, ref, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { ChevronLeft, Calendar, Flag, Bell, RefreshCw, Grid2x2, Check } from 'lucide-vue-next';
import dayjs from 'dayjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new-task",
  __ssrInlineRender: true,
  setup(__props) {
    useTasksStore();
    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const form = reactive({
      title: "",
      dueDate: "",
      dueTime: "",
      durationStart: "",
      durationEnd: "",
      priority: "none",
      notification: "",
      repeat: "none",
      matrixBlock: "not-urgent-not-important"
    });
    const errors = reactive({
      title: "",
      duration: ""
    });
    const activeTab = ref("date");
    const tabs = [
      { id: "date", label: "\u0414\u0430\u0442\u0430", icon: Calendar },
      { id: "priority", label: "\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442", icon: Flag },
      { id: "notify", label: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435", icon: Bell },
      { id: "repeat", label: "\u041F\u043E\u0432\u0442\u043E\u0440", icon: RefreshCw },
      { id: "matrix", label: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430", icon: Grid2x2 }
    ];
    const quickDates = [
      { label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", value: today },
      { label: "\u0417\u0430\u0432\u0442\u0440\u0430", value: tomorrow },
      { label: "\u0411\u0435\u0437 \u0441\u0440\u043E\u043A\u0430", value: "" }
    ];
    const priorities = [
      { value: "high", label: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439", color: "#FF3B30" },
      { value: "medium", label: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439", color: "#FF9500" },
      { value: "low", label: "\u041D\u0438\u0437\u043A\u0438\u0439", color: "#34C759" },
      { value: "none", label: "\u0411\u0435\u0437 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430", color: "#C7C7CC" }
    ];
    const notifyOptions = [
      { label: "\u0412 \u043C\u043E\u043C\u0435\u043D\u0442 \u0441\u0440\u043E\u043A\u0430", value: "0" },
      { label: "\u0417\u0430 5 \u043C\u0438\u043D\u0443\u0442", value: "5" },
      { label: "\u0417\u0430 15 \u043C\u0438\u043D\u0443\u0442", value: "15" },
      { label: "\u0417\u0430 30 \u043C\u0438\u043D\u0443\u0442", value: "30" },
      { label: "\u0417\u0430 1 \u0447\u0430\u0441", value: "60" },
      { label: "\u0417\u0430 1 \u0434\u0435\u043D\u044C", value: "1440" },
      { label: "\u0411\u0435\u0437 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", value: "" }
    ];
    const repeatOptions = [
      { label: "\u041D\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0442\u044C", value: "none" },
      { label: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C", value: "daily" },
      { label: "\u041A\u0430\u0436\u0434\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E", value: "weekly" },
      { label: "\u041A\u0430\u0436\u0434\u044B\u0439 \u043C\u0435\u0441\u044F\u0446", value: "monthly" },
      { label: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0433\u043E\u0434", value: "yearly" }
    ];
    const matrixBlocks = [
      { id: "urgent-important", title: "\u0421\u0440\u043E\u0447\u043D\u043E \u0438 \u0432\u0430\u0436\u043D\u043E", color: "#FF3B30" },
      { id: "not-urgent-important", title: "\u041D\u0435 \u0441\u0440\u043E\u0447\u043D\u043E, \u043D\u043E \u0432\u0430\u0436\u043D\u043E", color: "#007AFF" },
      { id: "urgent-not-important", title: "\u0421\u0440\u043E\u0447\u043D\u043E, \u043D\u0435 \u0432\u0430\u0436\u043D\u043E", color: "#FF9500" },
      { id: "not-urgent-not-important", title: "\u041D\u0435 \u0441\u0440\u043E\u0447\u043D\u043E, \u043D\u0435 \u0432\u0430\u0436\u043D\u043E", color: "#8E8E93" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="bg-white px-4 pt-14 pb-4 shadow-sm"><div class="flex items-center gap-3"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div><h1 class="text-xl font-bold text-sber-black">\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430</h1><p class="text-sm text-sber-gray">\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0434\u0435\u0442\u0430\u043B\u0438.</p></div></div></div><div class="mx-auto w-full max-w-3xl px-4 py-4"><form class="rounded-3xl bg-white shadow-card"><div class="px-5 pt-5 pb-4"><label class="mb-2 block text-sm font-semibold text-sber-black">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438</label><input${ssrRenderAttr("value", unref(form).title)} placeholder="\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u043E\u0442\u0447\u0451\u0442 \u0438\u043B\u0438 \u0441\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C\u0441\u044F \u0441 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u043C" class="${ssrRenderClass([{ "border-red-400 bg-red-50 placeholder:text-red-300": unref(errors).title }, "input-field py-3 text-base font-medium"])}" autofocus>`);
      if (unref(errors).title) {
        _push(`<p class="mt-2 text-xs font-medium text-red-500">${ssrInterpolate(unref(errors).title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4 flex border-b border-sber-gray-light px-4 gap-1 overflow-x-auto no-scrollbar"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeTab) === tab.id ? "text-sber-green bg-sber-green-light border-b-2 border-sber-green" : "text-sber-gray", "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-t-lg transition-colors"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "w-4 h-4" }, null), _parent);
        _push(` ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(activeTab) === "date") {
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">\u0414\u0430\u0442\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F</p><div class="flex gap-2 flex-wrap mb-4"><!--[-->`);
        ssrRenderList(quickDates, (quick) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).dueDate === quick.value ? "bg-sber-green text-white border-sber-green" : "bg-white text-sber-black border-sber-gray-mid", "px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors"])}">${ssrInterpolate(quick.label)}</button>`);
        });
        _push(`<!--]--></div><input${ssrRenderAttr("value", unref(form).dueDate)} type="date" class="input-field mb-3"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">\u0412\u0440\u0435\u043C\u044F \u0441\u0440\u043E\u043A\u0430</p><input${ssrRenderAttr("value", unref(form).dueTime)} type="time" class="input-field mb-3"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</p><div class="flex gap-2"><div class="flex-1"><label class="text-xs text-sber-gray mb-1 block">\u041D\u0430\u0447\u0430\u043B\u043E</label><input${ssrRenderAttr("value", unref(form).durationStart)} type="time" class="input-field"></div><div class="flex-1"><label class="text-xs text-sber-gray mb-1 block">\u041A\u043E\u043D\u0435\u0446</label><input${ssrRenderAttr("value", unref(form).durationEnd)} type="time" class="input-field"></div></div>`);
        if (unref(errors).duration) {
          _push(`<p class="mt-2 text-xs font-medium text-red-500">${ssrInterpolate(unref(errors).duration)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "priority") {
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442</p><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(priorities, (p) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).priority === p.value ? "border-current bg-opacity-10" : "border-sber-gray-light bg-white", "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"])}" style="${ssrRenderStyle(unref(form).priority === p.value ? { borderColor: p.color, backgroundColor: p.color + "15" } : {})}"><div class="w-4 h-4 rounded-full" style="${ssrRenderStyle({ backgroundColor: p.color })}"></div><span class="text-sm font-medium text-sber-black">${ssrInterpolate(p.label)}</span>`);
          if (unref(form).priority === p.value) {
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 ml-auto text-sber-green" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "notify") {
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435</p><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(notifyOptions, (n) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).notification === n.value ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"])}">`);
          _push(ssrRenderComponent(unref(Bell), {
            class: ["w-4 h-4", unref(form).notification === n.value ? "text-sber-green" : "text-sber-gray"]
          }, null, _parent));
          _push(`<span class="text-sm text-sber-black">${ssrInterpolate(n.label)}</span>`);
          if (unref(form).notification === n.value) {
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 ml-auto text-sber-green" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "repeat") {
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">\u041F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435</p><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(repeatOptions, (r) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).repeat === r.value ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"])}">`);
          _push(ssrRenderComponent(unref(RefreshCw), {
            class: ["w-4 h-4", unref(form).repeat === r.value ? "text-sber-green" : "text-sber-gray"]
          }, null, _parent));
          _push(`<span class="text-sm text-sber-black">${ssrInterpolate(r.label)}</span>`);
          if (unref(form).repeat === r.value) {
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 ml-auto text-sber-green" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "matrix") {
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">\u0411\u043B\u043E\u043A \u043C\u0430\u0442\u0440\u0438\u0446\u044B</p><div class="grid grid-cols-2 gap-2"><!--[-->`);
        ssrRenderList(matrixBlocks, (block) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).matrixBlock === block.id ? "border-current" : "border-sber-gray-light", "flex flex-col gap-1 px-3 py-3 rounded-2xl border-2 text-left transition-all"])}" style="${ssrRenderStyle(unref(form).matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + "15" } : {})}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-xs font-medium text-sber-black leading-tight">${ssrInterpolate(block.title)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-4 pb-6 pt-2"><button class="btn-secondary mb-3" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="btn-primary" type="submit"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/new-task.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-task-DBTyfJrt.mjs.map
