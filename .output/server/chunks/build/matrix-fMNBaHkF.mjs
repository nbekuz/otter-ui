import { _ as _sfc_main$1 } from './TaskDetailModal-B68qELG2.mjs';
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { Settings, Check, Clock } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { b as useRoute, a as useSettingsStore, n as navigateTo } from './server.mjs';
import { u as useTasksStore } from './tasks-BRvQftZO.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "matrix",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const tasksStore = useTasksStore();
    const settingsStore = useSettingsStore();
    const isDarkTheme = computed(() => settingsStore.appSettings.theme === "dark");
    const settingsOpen = ref(false);
    const selectedTaskId = ref(null);
    const dragTarget = ref(null);
    const blocks = computed(() => Object.values(settingsStore.matrixBlocks));
    function getBlockTasks(blockId) {
      return tasksStore.getTasksForMatrix(blockId);
    }
    function getBlockContainerStyle(block) {
      if (!isDarkTheme.value) {
        return {
          backgroundColor: block.bgColor,
          borderColor: `${block.color}25`
        };
      }
      return {
        backgroundColor: `${block.color}12`,
        borderColor: `${block.color}40`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
      };
    }
    function formatDate(date) {
      return dayjs(date).format("D MMM");
    }
    function formatTaskMeta(dueDate, dueTime) {
      const parts = [];
      if (dueDate) parts.push(formatDate(dueDate));
      if (dueTime) parts.push(dueTime);
      return parts.join(", ");
    }
    const dateFilters = [
      { value: "overdue", label: "\u041F\u0440\u043E\u0441\u0440\u043E\u0447." },
      { value: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" },
      { value: "tomorrow", label: "\u0417\u0430\u0432\u0442\u0440\u0430" },
      { value: "later", label: "\u041F\u043E\u0437\u0436\u0435" },
      { value: "nodate", label: "\u0411\u0435\u0437 \u0434\u0430\u0442\u044B" }
    ];
    const priorityFilters = [
      { value: "high", label: "\u0412\u044B\u0441\u043E\u043A.", color: "#FF3B30" },
      { value: "medium", label: "\u0421\u0440\u0435\u0434\u043D.", color: "#FF9500" },
      { value: "low", label: "\u041D\u0438\u0437\u043A\u0438\u0439", color: "#34C759" },
      { value: "none", label: "\u0411\u0435\u0437", color: "#8E8E93" }
    ];
    function openTaskFromDetailModal(taskId) {
      selectedTaskId.value = null;
      navigateTo({ path: "/app/new-task", query: { id: taskId, returnTo: route.path } });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskDetailModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container flex min-h-0 flex-col overflow-hidden max-lg:!min-h-0 max-lg:h-dvh max-lg:max-h-dvh lg:h-full lg:min-h-0 lg:pb-6", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a]" : "bg-white shadow-sm", "shrink-0 px-4 pt-14 pb-4"])}"><div class="flex items-center justify-between"><h1 class="text-xl font-bold text-sber-black">\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u042D\u0439\u0437\u0435\u043D\u0445\u0430\u0443\u044D\u0440\u0430</h1><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "w-9 h-9 rounded-xl flex items-center justify-center"])}">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`</button></div><p class="mt-1 text-xs text-sber-gray">\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043F\u043E \u0432\u0430\u0436\u043D\u043E\u0441\u0442\u0438 \u0438 \u0441\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u0438</p></div><div class="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-3" style="${ssrRenderStyle({ "grid-template-rows": "minmax(0, 1fr) minmax(0, 1fr)", "grid-template-columns": "minmax(0, 1fr) minmax(0, 1fr)" })}"><!--[-->`);
      ssrRenderList(unref(blocks), (block) => {
        _push(`<div class="flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border" style="${ssrRenderStyle(getBlockContainerStyle(block))}"><div class="border-b px-3 pt-3 pb-2" style="${ssrRenderStyle({ borderColor: block.color + "30" })}"><div class="mb-1 flex items-center justify-between gap-2"><div class="flex min-w-0 items-center gap-3"><div class="h-2.5 w-2.5 flex-shrink-0 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><p class="truncate pr-2 text-xs font-bold leading-tight" style="${ssrRenderStyle({ color: block.color })}">${ssrInterpolate(block.title)}</p></div><span class="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style="${ssrRenderStyle({ backgroundColor: block.color })}">${ssrInterpolate(getBlockTasks(block.id).length)}</span></div></div><div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 py-2"><div style="${ssrRenderStyle({ borderColor: block.color + "50", backgroundColor: unref(isDarkTheme) ? "#171a21" : block.bgColor })}" class="${ssrRenderClass([unref(dragTarget) === block.id ? unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white/90" : "", "sticky top-0 z-20 mb-2 flex items-center justify-center rounded-xl border-2 border-dashed py-[5px] transition-colors"])}"><span class="text-[10px]" style="${ssrRenderStyle({ color: block.color })}">${ssrInterpolate(unref(dragTarget) === block.id ? "\u041E\u0442\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C" : "+ \u043F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435")}</span></div><!--[-->`);
        ssrRenderList(getBlockTasks(block.id), (task) => {
          _push(`<div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-[#2a303a]" : "bg-white border-transparent", "rounded-xl px-3 py-2 mb-1.5 cursor-pointer active:opacity-70 border"])}" draggable="true"><div class="flex items-start gap-2"><button class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: block.color, backgroundColor: task.completed ? block.color : "transparent" })}">`);
          if (task.completed) {
            _push(ssrRenderComponent(unref(Check), { class: "w-2.5 h-2.5 text-white" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button><div class="min-w-0 flex-1"><p class="${ssrRenderClass([task.completed ? "line-through text-sber-gray" : "", "break-words text-xs font-medium leading-snug text-sber-black"])}">${ssrInterpolate(task.title)}</p>`);
          if (task.dueDate || task.dueTime) {
            _push(`<div class="mt-1 flex items-center gap-1 text-[10px] text-sber-gray">`);
            _push(ssrRenderComponent(unref(Clock), { class: "h-2.5 w-2.5 shrink-0 text-sber-gray" }, null, _parent));
            _push(`<span>${ssrInterpolate(formatTaskMeta(task.dueDate, task.dueTime))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsOpen)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(settingsOpen)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}"><h3 class="text-lg font-bold text-sber-black mb-4">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u043B\u043E\u043A\u043E\u0432</h3><!--[-->`);
          ssrRenderList(unref(blocks), (block) => {
            _push2(`<div class="mb-5"><div class="flex items-center gap-2 mb-3"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(block.title)}</p></div><div class="space-y-2"><div><label class="text-xs text-sber-gray mb-1 block">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0431\u043B\u043E\u043A\u0430</label><input${ssrRenderAttr("value", block.title)} type="text" class="input-field text-sm py-2.5"></div><div><label class="text-xs text-sber-gray mb-1 block">\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0434\u0430\u0442\u0435</label><div class="flex flex-wrap gap-1.5"><!--[-->`);
            ssrRenderList(dateFilters, (df) => {
              var _a, _b;
              _push2(`<button class="${ssrRenderClass([((_a = block.dateFilter) == null ? void 0 : _a.includes(df.value)) ? "text-white border-transparent" : "border-sber-gray-mid text-sber-gray bg-white", "w-20 whitespace-nowrap px-2 py-1 rounded-xl text-center text-xs font-medium border transition-colors"])}" style="${ssrRenderStyle(((_b = block.dateFilter) == null ? void 0 : _b.includes(df.value)) ? { backgroundColor: block.color } : {})}">${ssrInterpolate(df.label)}</button>`);
            });
            _push2(`<!--]--></div></div><div><label class="text-xs text-sber-gray mb-1 block">\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0443</label><div class="flex gap-1.5"><!--[-->`);
            ssrRenderList(priorityFilters, (pf) => {
              var _a, _b;
              _push2(`<button class="${ssrRenderClass([((_a = block.priorityFilter) == null ? void 0 : _a.includes(pf.value)) ? "text-white border-transparent" : "border-sber-gray-mid text-sber-gray bg-white", "w-20 whitespace-nowrap px-2 py-1 rounded-xl text-center text-xs font-medium border transition-colors"])}" style="${ssrRenderStyle(((_b = block.priorityFilter) == null ? void 0 : _b.includes(pf.value)) ? { backgroundColor: pf.color } : {})}">${ssrInterpolate(pf.label)}</button>`);
            });
            _push2(`<!--]--></div></div></div><div class="h-px bg-sber-gray-light mt-4"></div></div>`);
          });
          _push2(`<!--]--><button class="btn-primary">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      if (unref(selectedTaskId)) {
        _push(ssrRenderComponent(_component_TasksTaskDetailModal, {
          "task-id": unref(selectedTaskId),
          onClose: ($event) => selectedTaskId.value = null,
          onEdit: openTaskFromDetailModal
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/matrix.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=matrix-fMNBaHkF.mjs.map
