import { _ as _sfc_main$1 } from "./TaskDetailModal-suNQDuqu.js";
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr } from "vue/server-renderer";
import { Settings, Check, Clock } from "lucide-vue-next";
import dayjs from "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { u as useTasksStore } from "./tasks-BcYdj5cJ.js";
import { u as useSettingsStore } from "../server.mjs";
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
  __name: "matrix",
  __ssrInlineRender: true,
  setup(__props) {
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
    const dateFilters = [
      { value: "overdue", label: "Просроч." },
      { value: "today", label: "Сегодня" },
      { value: "tomorrow", label: "Завтра" },
      { value: "later", label: "Позже" },
      { value: "nodate", label: "Без даты" }
    ];
    const priorityFilters = [
      { value: "high", label: "Высок.", color: "#FF3B30" },
      { value: "medium", label: "Средн.", color: "#FF9500" },
      { value: "low", label: "Низкий", color: "#34C759" },
      { value: "none", label: "Без", color: "#8E8E93" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskDetailModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["page-container", unref(isDarkTheme) ? "bg-[#0f1115]" : "bg-sber-gray-light"]
      }, _attrs))}><div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-b border-[#2a303a]" : "bg-white shadow-sm", "px-4 pt-14 pb-4"])}"><div class="flex items-center justify-between"><h1 class="text-xl font-bold text-sber-black">Матрица Эйзенхауэра</h1><button class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#20242d]" : "bg-sber-gray-light", "w-9 h-9 rounded-xl flex items-center justify-center"])}">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`</button></div><p class="text-xs text-sber-gray mt-1">Приоритизируйте задачи по важности и срочности</p></div><div class="p-3 grid grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(unref(blocks), (block) => {
        _push(`<div class="rounded-2xl overflow-hidden border" style="${ssrRenderStyle(getBlockContainerStyle(block))}"><div class="px-3 pt-3 pb-2 border-b" style="${ssrRenderStyle({ borderColor: block.color + "30" })}"><div class="flex items-center justify-between mb-1"><div class="w-2.5 h-2.5 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style="${ssrRenderStyle({ backgroundColor: block.color })}">${ssrInterpolate(getBlockTasks(block.id).length)}</span></div><p class="text-xs font-bold leading-tight" style="${ssrRenderStyle({ color: block.color })}">${ssrInterpolate(block.title)}</p><p class="text-[10px] text-sber-gray">${ssrInterpolate(block.description)}</p></div><div class="px-2 py-2 min-h-[100px] max-h-[220px] overflow-y-auto no-scrollbar"><!--[-->`);
        ssrRenderList(getBlockTasks(block.id), (task) => {
          _push(`<div class="${ssrRenderClass([unref(isDarkTheme) ? "bg-[#171a21] border-[#2a303a]" : "bg-white border-transparent", "rounded-xl px-3 py-2 mb-1.5 cursor-pointer active:opacity-70 border"])}" draggable="true"><div class="flex items-start gap-2"><button class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5" style="${ssrRenderStyle({ borderColor: block.color, backgroundColor: task.completed ? block.color : "transparent" })}">`);
          if (task.completed) {
            _push(ssrRenderComponent(unref(Check), { class: "w-2.5 h-2.5 text-white" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button><p class="${ssrRenderClass([task.completed ? "line-through text-sber-gray" : "", "text-xs font-medium text-sber-black line-clamp-2 leading-snug"])}">${ssrInterpolate(task.title)}</p></div>`);
          if (task.dueDate) {
            _push(`<div class="flex items-center gap-1 mt-1 ml-6">`);
            _push(ssrRenderComponent(unref(Clock), { class: "w-2.5 h-2.5 text-sber-gray" }, null, _parent));
            _push(`<span class="text-[10px] text-sber-gray">${ssrInterpolate(formatDate(task.dueDate))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--><div style="${ssrRenderStyle({ borderColor: block.color + "50" })}" class="${ssrRenderClass([unref(dragTarget) === block.id ? unref(isDarkTheme) ? "bg-[#20242d]" : "bg-white/80" : "", "border-2 border-dashed rounded-xl py-4 flex items-center justify-center transition-colors mt-1"])}"><span class="text-[10px]" style="${ssrRenderStyle({ color: block.color })}">${ssrInterpolate(unref(dragTarget) === block.id ? "Отпустите здесь" : "+ перетащите")}</span></div></div></div>`);
      });
      _push(`<!--]--></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsOpen)) {
          _push2(`<div class="overlay"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(settingsOpen)) {
          _push2(`<div class="app-modal px-5 py-5" style="${ssrRenderStyle({ "max-height": "85dvh", "overflow-y": "auto" })}"><h3 class="text-lg font-bold text-sber-black mb-4">Настройки блоков</h3><!--[-->`);
          ssrRenderList(unref(blocks), (block) => {
            _push2(`<div class="mb-5"><div class="flex items-center gap-2 mb-3"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><p class="text-sm font-semibold text-sber-black">${ssrInterpolate(block.title)}</p></div><div class="space-y-2"><div><label class="text-xs text-sber-gray mb-1 block">Название блока</label><input${ssrRenderAttr("value", block.title)} type="text" class="input-field text-sm py-2.5"></div><div><label class="text-xs text-sber-gray mb-1 block">Фильтр по дате</label><div class="flex flex-wrap gap-1.5"><!--[-->`);
            ssrRenderList(dateFilters, (df) => {
              _push2(`<button class="${ssrRenderClass([block.dateFilter?.includes(df.value) ? "text-white border-transparent" : "border-sber-gray-mid text-sber-gray bg-white", "px-3 py-1 rounded-xl text-xs font-medium border transition-colors"])}" style="${ssrRenderStyle(block.dateFilter?.includes(df.value) ? { backgroundColor: block.color } : {})}">${ssrInterpolate(df.label)}</button>`);
            });
            _push2(`<!--]--></div></div><div><label class="text-xs text-sber-gray mb-1 block">Фильтр по приоритету</label><div class="flex gap-1.5"><!--[-->`);
            ssrRenderList(priorityFilters, (pf) => {
              _push2(`<button class="${ssrRenderClass([block.priorityFilter?.includes(pf.value) ? "text-white border-transparent" : "border-sber-gray-mid text-sber-gray bg-white", "px-3 py-1 rounded-xl text-xs font-medium border transition-colors"])}" style="${ssrRenderStyle(block.priorityFilter?.includes(pf.value) ? { backgroundColor: pf.color } : {})}">${ssrInterpolate(pf.label)}</button>`);
            });
            _push2(`<!--]--></div></div></div><div class="h-px bg-sber-gray-light mt-4"></div></div>`);
          });
          _push2(`<!--]--><button class="btn-primary">Сохранить</button></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      if (unref(selectedTaskId)) {
        _push(ssrRenderComponent(_component_TasksTaskDetailModal, {
          "task-id": unref(selectedTaskId),
          onClose: ($event) => selectedTaskId.value = null
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
export {
  _sfc_main as default
};
//# sourceMappingURL=matrix-DZdtYh22.js.map
