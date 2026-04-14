import { defineComponent, reactive, ref, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from "vue/server-renderer";
import { ChevronLeft, Calendar, Flag, Bell, RefreshCw, Grid2x2, Check } from "lucide-vue-next";
import dayjs from "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useTasksStore } from "./tasks-BcYdj5cJ.js";
import "../server.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/ufo/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
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
      { id: "date", label: "Дата", icon: Calendar },
      { id: "priority", label: "Приоритет", icon: Flag },
      { id: "notify", label: "Уведомление", icon: Bell },
      { id: "repeat", label: "Повтор", icon: RefreshCw },
      { id: "matrix", label: "Матрица", icon: Grid2x2 }
    ];
    const quickDates = [
      { label: "Сегодня", value: today },
      { label: "Завтра", value: tomorrow },
      { label: "Без срока", value: "" }
    ];
    const priorities = [
      { value: "high", label: "Высокий", color: "#FF3B30" },
      { value: "medium", label: "Средний", color: "#FF9500" },
      { value: "low", label: "Низкий", color: "#34C759" },
      { value: "none", label: "Без приоритета", color: "#C7C7CC" }
    ];
    const notifyOptions = [
      { label: "В момент срока", value: "0" },
      { label: "За 5 минут", value: "5" },
      { label: "За 15 минут", value: "15" },
      { label: "За 30 минут", value: "30" },
      { label: "За 1 час", value: "60" },
      { label: "За 1 день", value: "1440" },
      { label: "Без уведомления", value: "" }
    ];
    const repeatOptions = [
      { label: "Не повторять", value: "none" },
      { label: "Каждый день", value: "daily" },
      { label: "Каждую неделю", value: "weekly" },
      { label: "Каждый месяц", value: "monthly" },
      { label: "Каждый год", value: "yearly" }
    ];
    const matrixBlocks = [
      { id: "urgent-important", title: "Срочно и важно", color: "#FF3B30" },
      { id: "not-urgent-important", title: "Не срочно, но важно", color: "#007AFF" },
      { id: "urgent-not-important", title: "Срочно, не важно", color: "#FF9500" },
      { id: "not-urgent-not-important", title: "Не срочно, не важно", color: "#8E8E93" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-sber-gray-light" }, _attrs))}><div class="bg-white px-4 pt-14 pb-4 shadow-sm"><div class="flex items-center gap-3"><button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div><h1 class="text-xl font-bold text-sber-black">Новая задача</h1><p class="text-sm text-sber-gray">Заполните название и при необходимости добавьте детали.</p></div></div></div><div class="mx-auto w-full max-w-3xl px-4 py-4"><form class="rounded-3xl bg-white shadow-card"><div class="px-5 pt-5 pb-4"><label class="mb-2 block text-sm font-semibold text-sber-black">Название задачи</label><input${ssrRenderAttr("value", unref(form).title)} placeholder="Например: подготовить отчёт или созвониться с клиентом" class="${ssrRenderClass([{ "border-red-400 bg-red-50 placeholder:text-red-300": unref(errors).title }, "input-field py-3 text-base font-medium"])}" autofocus>`);
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
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Дата выполнения</p><div class="flex gap-2 flex-wrap mb-4"><!--[-->`);
        ssrRenderList(quickDates, (quick) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).dueDate === quick.value ? "bg-sber-green text-white border-sber-green" : "bg-white text-sber-black border-sber-gray-mid", "px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors"])}">${ssrInterpolate(quick.label)}</button>`);
        });
        _push(`<!--]--></div><input${ssrRenderAttr("value", unref(form).dueDate)} type="date" class="input-field mb-3"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Время срока</p><input${ssrRenderAttr("value", unref(form).dueTime)} type="time" class="input-field mb-3"><p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Длительность</p><div class="flex gap-2"><div class="flex-1"><label class="text-xs text-sber-gray mb-1 block">Начало</label><input${ssrRenderAttr("value", unref(form).durationStart)} type="time" class="input-field"></div><div class="flex-1"><label class="text-xs text-sber-gray mb-1 block">Конец</label><input${ssrRenderAttr("value", unref(form).durationEnd)} type="time" class="input-field"></div></div>`);
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
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Приоритет</p><div class="flex flex-col gap-2"><!--[-->`);
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
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Уведомление</p><div class="flex flex-col gap-2"><!--[-->`);
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
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Повторение</p><div class="flex flex-col gap-2"><!--[-->`);
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
        _push(`<div class="px-4 pb-4"><p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Блок матрицы</p><div class="grid grid-cols-2 gap-2"><!--[-->`);
        ssrRenderList(matrixBlocks, (block) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).matrixBlock === block.id ? "border-current" : "border-sber-gray-light", "flex flex-col gap-1 px-3 py-3 rounded-2xl border-2 text-left transition-all"])}" style="${ssrRenderStyle(unref(form).matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + "15" } : {})}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-xs font-medium text-sber-black leading-tight">${ssrInterpolate(block.title)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-4 pb-6 pt-2"><button class="btn-secondary mb-3" type="button"> Отмена </button><button class="btn-primary" type="submit"> Добавить задачу </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/new-task.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=new-task-DBTyfJrt.js.map
