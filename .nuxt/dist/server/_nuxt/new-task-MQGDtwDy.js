import { _ as _sfc_main$1, a as _sfc_main$2 } from "./TimeFieldRu-CPDZOlfK.js";
import { defineComponent, computed, ref, reactive, watch, mergeProps, unref, createVNode, resolveDynamicComponent, nextTick, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from "vue/server-renderer";
import { ChevronLeft, Paperclip, X, Calendar, Flag, Bell, RefreshCw, Grid2x2, Check, Trash2 } from "lucide-vue-next";
import dayjs from "dayjs";
import "/Users/nodirbek/Desktop/otter-app/node_modules/hookable/dist/index.mjs";
import { a as useRoute, n as navigateTo } from "../server.mjs";
import { u as useTasksStore } from "./tasks-NRltayIc.js";
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
    const route = useRoute();
    const tasksStore = useTasksStore();
    const editTaskId = computed(() => {
      const raw = route.query.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      return typeof id === "string" && id.length > 0 ? id : null;
    });
    const isEditMode = computed(() => !!editTaskId.value);
    const editingTask = computed(
      () => editTaskId.value ? tasksStore.tasks.find((t) => t.id === editTaskId.value) ?? null : null
    );
    ref(null);
    const dueDateFieldRef = ref(null);
    const dueTimeFieldRef = ref(null);
    const durationStartFieldRef = ref(null);
    const durationEndFieldRef = ref(null);
    const submitButtonRef = ref(null);
    const attachmentInputRef = ref(null);
    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const form = reactive({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      durationStart: "",
      durationEnd: "",
      priority: "none",
      notification: "",
      repeat: "none",
      matrixBlock: "not-urgent-not-important"
    });
    const attachmentRemoved = ref(false);
    const mobileDescOpen = ref(false);
    watch(isEditMode, (editing) => {
      mobileDescOpen.value = editing;
    }, { immediate: true });
    const attachmentName = ref("");
    const attachmentMimeType = ref("");
    const attachmentDataUrl = ref("");
    const errors = reactive({
      title: "",
      duration: "",
      repeat: ""
    });
    const activeTab = ref("date");
    const tabs = [
      { id: "date", label: "Дата", icon: Calendar },
      { id: "priority", label: "Приоритет", icon: Flag },
      { id: "notify", label: "Уведомление", icon: Bell, iconOnly: true },
      { id: "repeat", label: "Повтор", icon: RefreshCw, iconOnly: true },
      { id: "matrix", label: "Матрица", icon: Grid2x2, iconOnly: true }
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
      { label: "Каждый год", value: "yearly" },
      { label: "Настроить повторение", value: "custom" }
    ];
    const weekDays = [
      { label: "Пн", value: 1 },
      { label: "Вт", value: 2 },
      { label: "Ср", value: 3 },
      { label: "Чт", value: 4 },
      { label: "Пт", value: 5 },
      { label: "Сб", value: 6 },
      { label: "Вс", value: 7 }
    ];
    const customRepeat = reactive({
      interval: 1,
      unit: "week",
      weekdays: [1],
      monthDay: dayjs().date()
    });
    const matrixBlocks = [
      { id: "urgent-important", title: "Срочно и важно", color: "#FF3B30" },
      { id: "not-urgent-important", title: "Не срочно, но важно", color: "#007AFF" },
      { id: "urgent-not-important", title: "Срочно, не важно", color: "#FF9500" },
      { id: "not-urgent-not-important", title: "Не срочно, не важно", color: "#8E8E93" }
    ];
    const attachmentPreviewUrl = computed(
      () => attachmentMimeType.value.startsWith("image/") ? attachmentDataUrl.value : ""
    );
    watch(() => form.dueTime, (newTime, oldTime) => {
      if (!newTime) return;
      if (!form.durationStart || form.durationStart === oldTime) {
        form.durationStart = newTime;
      }
    });
    watch(() => form.dueDate, (newDate) => {
      if (newDate !== "") return;
      form.dueTime = "";
      form.durationStart = "";
      form.durationEnd = "";
    });
    watch(editTaskId, () => {
      loadEditTaskFromRoute();
    });
    function onDueDateKeydown(e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      focusDueTimeField();
    }
    async function focusDueTimeField() {
      await nextTick();
      dueTimeFieldRef.value?.focus();
    }
    async function focusDurationStartField() {
      await nextTick();
      durationStartFieldRef.value?.focus();
    }
    async function focusDurationEndField() {
      await nextTick();
      durationEndFieldRef.value?.focus();
    }
    function onDueTimeKeydown(e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      focusDurationStartField();
    }
    function onDurationStartKeydown(e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      focusDurationEndField();
    }
    function onDurationEndKeydown(e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      focusSubmitButton();
    }
    async function focusSubmitButton() {
      await nextTick();
      submitButtonRef.value?.focus();
    }
    function resetAttachmentFields() {
      attachmentName.value = "";
      attachmentMimeType.value = "";
      attachmentDataUrl.value = "";
      if (attachmentInputRef.value) {
        attachmentInputRef.value.value = "";
      }
    }
    function hydrateFromTask(task) {
      form.title = task.title;
      form.description = task.description || "";
      form.dueDate = task.dueDate || "";
      form.dueTime = task.dueTime || "";
      form.durationStart = task.duration?.start || "";
      form.durationEnd = task.duration?.end || "";
      form.priority = task.priority || "none";
      form.notification = task.notification || "";
      form.repeat = task.repeat || "none";
      form.matrixBlock = task.matrixBlock || "not-urgent-not-important";
      customRepeat.interval = task.repeatCustom?.interval || 1;
      customRepeat.unit = task.repeatCustom?.unit || (task.repeatDays?.length ? "week" : "week");
      customRepeat.weekdays = task.repeatCustom?.weekdays?.length ? [...task.repeatCustom.weekdays] : task.repeatDays?.length ? [...task.repeatDays] : [1];
      customRepeat.monthDay = task.repeatCustom?.monthDay || dayjs().date();
      attachmentRemoved.value = false;
      if (task.attachment) {
        attachmentName.value = task.attachment.name;
        attachmentMimeType.value = task.attachment.mimeType;
        attachmentDataUrl.value = task.attachment.dataUrl;
      } else {
        resetAttachmentFields();
      }
    }
    function loadEditTaskFromRoute() {
      if (!editTaskId.value) return;
      const task = tasksStore.tasks.find((t) => t.id === editTaskId.value);
      if (!task) {
        navigateTo("/app", { replace: true });
        return;
      }
      hydrateFromTask(task);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DateFieldRu = _sfc_main$1;
      const _component_TimeFieldRu = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex flex-col bg-sber-gray-light max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-[25] max-lg:mx-auto max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:w-full max-lg:max-w-[430px] max-lg:!min-h-0 max-lg:overflow-hidden max-lg:!pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:static lg:!h-auto lg:!max-h-none lg:!overflow-visible" }, _attrs))}><div class="shrink-0 bg-white px-4 pb-1.5 pt-[max(2.75rem,env(safe-area-inset-top,0px)+1.25rem)] shadow-sm lg:pb-4 lg:pt-14"><div class="flex items-center gap-2 lg:gap-3"><button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sber-gray-light lg:h-10 lg:w-10" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div class="min-w-0"><h1 class="truncate text-lg font-bold text-sber-black lg:text-xl">${ssrInterpolate(unref(isEditMode) ? "Редактирование задачи" : "Новая задача")}</h1><p class="hidden text-sm text-sber-gray lg:block">${ssrInterpolate(unref(isEditMode) ? "Измените поля и нажмите «Сохранить»." : "Заполните название и при необходимости добавьте детали.")}</p></div></div></div><div class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-3 py-1 lg:px-4 lg:py-4"><form class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-card lg:min-h-0 lg:overflow-visible lg:rounded-3xl"><div class="shrink-0 px-3 pb-1.5 pt-2 lg:px-5 lg:pb-4 lg:pt-5"><label class="mb-0.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:text-sm">Название задачи</label><input${ssrRenderAttr("value", unref(form).title)} placeholder="Например: отчёт, созвон, встреча…" class="${ssrRenderClass([{ "border-red-400 bg-red-50 placeholder:text-red-300": unref(errors).title }, "input-field py-2 text-sm font-medium !px-3 max-lg:py-2 max-lg:text-sm lg:py-3 lg:!px-4 lg:text-base"])}">`);
      if (unref(errors).title) {
        _push(`<p class="mt-1 text-xs font-medium text-red-500 lg:mt-2">${ssrInterpolate(unref(errors).title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isEditMode)) {
        _push(`<button type="button" class="mt-1.5 text-left text-xs font-semibold text-sber-green lg:hidden">${ssrInterpolate(unref(mobileDescOpen) ? "− Скрыть описание" : "+ Описание (необязательно)")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([unref(isEditMode) || unref(mobileDescOpen) ? "max-lg:block" : "max-lg:hidden", "lg:block"])}"><label class="mb-0.5 mt-1.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:mt-4 lg:text-sm">Описание</label><textarea placeholder="Детали, ссылки…" class="input-field resize-none py-1.5 text-sm !px-3 max-lg:min-h-[52px] max-lg:py-2 lg:min-h-[88px] lg:py-3 lg:!px-4 lg:text-base" rows="2">${ssrInterpolate(unref(form).description)}</textarea></div><div class="mt-1.5 lg:mt-3"><input type="file" class="hidden"><button type="button" class="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-sber-green/40 bg-sber-green-light px-2 py-1 text-[11px] font-semibold leading-tight text-sber-green transition-colors hover:bg-sber-green/20 lg:gap-2 lg:rounded-xl lg:px-3 lg:py-2 lg:text-sm">`);
      _push(ssrRenderComponent(unref(Paperclip), { class: "h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" }, null, _parent));
      _push(`<span class="truncate lg:hidden">Файл / фото</span><span class="hidden truncate lg:inline">Добавить изображение или файл</span></button></div>`);
      if (unref(attachmentName)) {
        _push(`<div class="mt-2 rounded-xl border border-sber-gray-light bg-sber-gray-light/60 p-2 lg:mt-3 lg:rounded-2xl lg:p-3"><div class="flex items-start gap-2 lg:gap-3">`);
        if (unref(attachmentPreviewUrl)) {
          _push(`<img${ssrRenderAttr("src", unref(attachmentPreviewUrl))} alt="Предпросмотр вложения" class="h-12 w-12 rounded-lg object-cover lg:h-16 lg:w-16 lg:rounded-xl">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="min-w-0 flex-1"><p class="truncate text-xs font-medium text-sber-black lg:text-sm">${ssrInterpolate(unref(attachmentName))}</p><p class="mt-0.5 text-[10px] text-sber-gray lg:mt-1 lg:text-xs">${ssrInterpolate(unref(attachmentPreviewUrl) ? "Изображение прикреплено" : "Файл прикреплен")}</p></div><button type="button" class="rounded-lg p-1 text-sber-gray transition-colors hover:bg-white hover:text-red-500">`);
        _push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex shrink-0 gap-0.5 overflow-x-auto border-b border-sber-gray-light px-2 no-scrollbar lg:mb-0 lg:gap-1 lg:px-4"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([[
          unref(activeTab) === tab.id ? "text-sber-green bg-sber-green-light border-b-2 border-sber-green" : "text-sber-gray",
          tab.iconOnly ? "justify-center gap-0 px-2 lg:px-2.5" : "px-2 lg:gap-1.5 lg:px-3"
        ], "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-t-lg py-1.5 text-[10px] font-medium transition-colors lg:gap-1.5 lg:py-2 lg:text-xs"])}"${ssrRenderAttr("aria-label", tab.iconOnly ? tab.label : void 0)}${ssrRenderAttr("title", tab.iconOnly ? tab.label : void 0)}>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" }, null), _parent);
        if (!tab.iconOnly) {
          _push(`<span>${ssrInterpolate(tab.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 lg:flex-none lg:overflow-visible lg:px-4">`);
      if (unref(activeTab) === "date") {
        _push(`<div class="pb-1 pt-1.5 lg:pb-4 lg:pt-3"><p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Дата выполнения</p><div class="mb-1.5 flex flex-wrap gap-1 lg:mb-4 lg:gap-2"><!--[-->`);
        ssrRenderList(quickDates, (quick) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).dueDate === quick.value ? "bg-sber-green text-white border-sber-green" : "bg-white text-sber-black border-sber-gray-mid", "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors lg:rounded-xl lg:px-3 lg:py-1.5 lg:text-sm"])}">${ssrInterpolate(quick.label)}</button>`);
        });
        _push(`<!--]--></div><div class="grid max-lg:grid-cols-2 max-lg:gap-x-2 max-lg:gap-y-1 lg:grid-cols-1 lg:gap-y-3"><div class="min-w-0"><p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">Дата</p>`);
        _push(ssrRenderComponent(_component_DateFieldRu, {
          ref_key: "dueDateFieldRef",
          ref: dueDateFieldRef,
          modelValue: unref(form).dueDate,
          "onUpdate:modelValue": ($event) => unref(form).dueDate = $event,
          "field-class": "border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:pr-12 lg:text-base",
          onKeydown: onDueDateKeydown
        }, null, _parent));
        _push(`</div><div class="min-w-0"><p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:hidden">Время</p><p class="mb-2 hidden text-xs font-semibold uppercase tracking-wide text-sber-gray lg:block">Время срока</p>`);
        _push(ssrRenderComponent(_component_TimeFieldRu, {
          ref_key: "dueTimeFieldRef",
          ref: dueTimeFieldRef,
          modelValue: unref(form).dueTime,
          "onUpdate:modelValue": ($event) => unref(form).dueTime = $event,
          "field-class": "border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:pr-12 lg:text-base",
          onKeydown: onDueTimeKeydown
        }, null, _parent));
        _push(`</div></div><p class="mb-0.5 mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:mt-3 lg:text-xs">Длительность</p><div class="flex gap-1.5 lg:gap-2"><div class="min-w-0 flex-1"><label class="mb-0.5 block text-[10px] text-sber-gray lg:mb-1 lg:text-xs">Начало</label>`);
        _push(ssrRenderComponent(_component_TimeFieldRu, {
          ref_key: "durationStartFieldRef",
          ref: durationStartFieldRef,
          modelValue: unref(form).durationStart,
          "onUpdate:modelValue": [($event) => unref(form).durationStart = $event, ($event) => unref(errors).duration = ""],
          "field-class": "border-2 border-sber-green/50 py-2 text-xs !px-2 max-lg:py-1.5 lg:py-4 lg:!px-4 lg:text-base",
          onKeydown: onDurationStartKeydown
        }, null, _parent));
        _push(`</div><div class="min-w-0 flex-1"><label class="mb-0.5 block text-[10px] text-sber-gray lg:mb-1 lg:text-xs">Конец</label>`);
        _push(ssrRenderComponent(_component_TimeFieldRu, {
          ref_key: "durationEndFieldRef",
          ref: durationEndFieldRef,
          modelValue: unref(form).durationEnd,
          "onUpdate:modelValue": [($event) => unref(form).durationEnd = $event, ($event) => unref(errors).duration = ""],
          "field-class": "border-2 border-sber-green/50 py-2 text-xs !px-2 max-lg:py-1.5 lg:py-4 lg:!px-4 lg:text-base",
          onKeydown: onDurationEndKeydown
        }, null, _parent));
        _push(`</div></div>`);
        if (unref(errors).duration) {
          _push(`<p class="mt-1 text-xs font-medium text-red-500 lg:mt-2">${ssrInterpolate(unref(errors).duration)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "priority") {
        _push(`<div class="pb-3 pt-2 lg:px-0 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Приоритет</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
        ssrRenderList(priorities, (p) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).priority === p.value ? "border-current bg-opacity-10" : "border-sber-gray-light bg-white", "flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"])}" style="${ssrRenderStyle(unref(form).priority === p.value ? { borderColor: p.color, backgroundColor: p.color + "15" } : {})}"><div class="w-4 h-4 rounded-full" style="${ssrRenderStyle({ backgroundColor: p.color })}"></div><span class="text-xs font-medium text-sber-black lg:text-sm">${ssrInterpolate(p.label)}</span>`);
          if (unref(form).priority === p.value) {
            _push(ssrRenderComponent(unref(Check), { class: "ml-auto h-4 w-4 text-sber-green" }, null, _parent));
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
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Уведомление</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
        ssrRenderList(notifyOptions, (n) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).notification === n.value ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"])}">`);
          _push(ssrRenderComponent(unref(Bell), {
            class: ["w-4 h-4", unref(form).notification === n.value ? "text-sber-green" : "text-sber-gray"]
          }, null, _parent));
          _push(`<span class="text-xs text-sber-black lg:text-sm">${ssrInterpolate(n.label)}</span>`);
          if (unref(form).notification === n.value) {
            _push(ssrRenderComponent(unref(Check), { class: "ml-auto h-4 w-4 text-sber-green" }, null, _parent));
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
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Повторение</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
        ssrRenderList(repeatOptions, (r) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).repeat === r.value ? "border-sber-green bg-sber-green-light" : "border-sber-gray-light bg-white", "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"])}">`);
          _push(ssrRenderComponent(unref(RefreshCw), {
            class: ["w-4 h-4", unref(form).repeat === r.value ? "text-sber-green" : "text-sber-gray"]
          }, null, _parent));
          _push(`<span class="text-xs text-sber-black lg:text-sm">${ssrInterpolate(r.label)}</span>`);
          if (unref(form).repeat === r.value) {
            _push(ssrRenderComponent(unref(Check), { class: "ml-auto h-4 w-4 text-sber-green" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(form).repeat === "custom") {
          _push(`<div class="mt-2 rounded-xl border border-sber-green/30 bg-sber-green-light/30 p-3 lg:mt-3 lg:rounded-2xl lg:p-4"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p><div class="mt-3 flex flex-wrap items-center gap-2"><span class="text-sm text-sber-gray">Каждые</span><input${ssrRenderAttr("value", unref(customRepeat).interval)} type="number" min="1" max="31" class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "week" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> Недели </button><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "month" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> Месяца </button></div>`);
          if (unref(customRepeat).unit === "week") {
            _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(weekDays, (day) => {
              _push(`<button type="button" class="${ssrRenderClass([unref(customRepeat).weekdays.includes(day.value) ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-gray", "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"])}">${ssrInterpolate(day.label)}</button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p><input${ssrRenderAttr("value", unref(customRepeat).monthDay)} type="number" min="1" max="31" class="w-28 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"></div>`);
          }
          if (unref(errors).repeat) {
            _push(`<p class="mt-2 text-xs font-medium text-red-500">${ssrInterpolate(unref(errors).repeat)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "matrix") {
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Блок матрицы</p><div class="grid grid-cols-2 gap-1.5 lg:gap-2"><!--[-->`);
        ssrRenderList(matrixBlocks, (block) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).matrixBlock === block.id ? "border-current" : "border-sber-gray-light", "flex flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-left transition-all lg:gap-1 lg:rounded-2xl lg:px-3 lg:py-3"])}" style="${ssrRenderStyle(unref(form).matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + "15" } : {})}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-[10px] font-medium leading-tight text-sber-black lg:text-xs">${ssrInterpolate(block.title)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="shrink-0 border-t border-sber-gray-light bg-white px-3 pb-2 pt-2 lg:px-4 lg:pb-4 lg:pt-3"><button class="btn-secondary mb-2 max-lg:!py-2.5 max-lg:!text-sm lg:mb-3" type="button"> Отмена </button>`);
      if (unref(isEditMode) && unref(editingTask)) {
        _push(`<!--[--><div class="mb-2 space-y-1.5 lg:mb-3 lg:space-y-2"><button class="${ssrRenderClass([unref(editingTask).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-semibold transition-colors max-lg:py-2.5 lg:py-3.5 lg:text-sm"])}" type="button">`);
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4 lg:h-5 lg:w-5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(editingTask).completed ? "В работе" : "Выполнено")}</button><button class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-2.5 text-xs font-semibold text-red-500 transition-colors max-lg:py-2.5 lg:py-3.5 lg:text-sm" type="button">`);
        _push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4 lg:h-5 lg:w-5" }, null, _parent));
        _push(` Удалить </button></div><button class="btn-primary max-lg:!py-2.5 max-lg:!text-sm" type="submit"> Сохранить </button><!--]-->`);
      } else {
        _push(`<button class="btn-primary max-lg:!py-2.5 max-lg:!text-sm" type="submit"> Добавить задачу </button>`);
      }
      _push(`</div></form></div></div>`);
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
//# sourceMappingURL=new-task-MQGDtwDy.js.map
