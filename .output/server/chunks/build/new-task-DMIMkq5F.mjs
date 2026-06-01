import { _ as _sfc_main$1, a as _sfc_main$2 } from './TimeFieldRu-CPDZOlfK.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, unref, createVNode, resolveDynamicComponent, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { ChevronLeft, Paperclip, X, Calendar, Flag, Bell, RefreshCw, Grid2x2, Check, Trash2 } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { d as useRoute, b as useTasksStore, n as navigateTo } from './server.mjs';
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
      () => {
        var _a;
        return editTaskId.value ? (_a = tasksStore.tasks.find((t) => t.id === editTaskId.value)) != null ? _a : null : null;
      }
    );
    ref(null);
    const dueDateFieldRef = ref(null);
    const dueTimeFieldRef = ref(null);
    const durationStartFieldRef = ref(null);
    const durationEndFieldRef = ref(null);
    const mobileSubmitRef = ref(null);
    const desktopSubmitRef = ref(null);
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
    const explicitNoDeadline = ref(false);
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
      { id: "date", label: "\u0414\u0430\u0442\u0430", icon: Calendar },
      { id: "priority", label: "\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442", icon: Flag },
      { id: "notify", label: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435", icon: Bell, iconOnly: true },
      { id: "repeat", label: "\u041F\u043E\u0432\u0442\u043E\u0440", icon: RefreshCw, iconOnly: true },
      { id: "matrix", label: "\u041C\u0430\u0442\u0440\u0438\u0446\u0430", icon: Grid2x2, iconOnly: true }
    ];
    const quickDates = [
      { id: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", value: today },
      { id: "tomorrow", label: "\u0417\u0430\u0432\u0442\u0440\u0430", value: tomorrow },
      { id: "none", label: "\u0411\u0435\u0437 \u0441\u0440\u043E\u043A\u0430", value: "" }
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
      { label: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0433\u043E\u0434", value: "yearly" },
      { label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435", value: "custom" }
    ];
    const weekDays = [
      { label: "\u041F\u043D", value: 1 },
      { label: "\u0412\u0442", value: 2 },
      { label: "\u0421\u0440", value: 3 },
      { label: "\u0427\u0442", value: 4 },
      { label: "\u041F\u0442", value: 5 },
      { label: "\u0421\u0431", value: 6 },
      { label: "\u0412\u0441", value: 7 }
    ];
    const customRepeat = reactive({
      interval: 1,
      unit: "week",
      weekdays: [1],
      monthDay: dayjs().date()
    });
    const matrixBlocks = [
      { id: "urgent-important", title: "\u0421\u0440\u043E\u0447\u043D\u043E \u0438 \u0432\u0430\u0436\u043D\u043E", color: "#FF3B30" },
      { id: "not-urgent-important", title: "\u041D\u0435 \u0441\u0440\u043E\u0447\u043D\u043E, \u043D\u043E \u0432\u0430\u0436\u043D\u043E", color: "#007AFF" },
      { id: "urgent-not-important", title: "\u0421\u0440\u043E\u0447\u043D\u043E, \u043D\u0435 \u0432\u0430\u0436\u043D\u043E", color: "#FF9500" },
      { id: "not-urgent-not-important", title: "\u041D\u0435 \u0441\u0440\u043E\u0447\u043D\u043E, \u043D\u0435 \u0432\u0430\u0436\u043D\u043E", color: "#8E8E93" }
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
      if (newDate !== "") {
        explicitNoDeadline.value = false;
        return;
      }
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
      var _a;
      await nextTick();
      (_a = dueTimeFieldRef.value) == null ? void 0 : _a.focus();
    }
    async function focusDurationStartField() {
      var _a;
      await nextTick();
      (_a = durationStartFieldRef.value) == null ? void 0 : _a.focus();
    }
    async function focusDurationEndField() {
      var _a;
      await nextTick();
      (_a = durationEndFieldRef.value) == null ? void 0 : _a.focus();
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
      const mobile = mobileSubmitRef.value;
      const desktop = desktopSubmitRef.value;
      if (mobile && mobile.offsetParent !== null) {
        mobile.focus();
        return;
      }
      desktop == null ? void 0 : desktop.focus();
    }
    ref(false);
    ref("");
    function isQuickDateActive(quick) {
      if (quick.id === "none") return explicitNoDeadline.value;
      if (explicitNoDeadline.value) return false;
      return form.dueDate === quick.value;
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
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      form.title = task.title;
      form.description = task.description || "";
      form.dueDate = task.dueDate || "";
      form.dueTime = task.dueTime || "";
      form.durationStart = ((_a = task.duration) == null ? void 0 : _a.start) || "";
      form.durationEnd = ((_b = task.duration) == null ? void 0 : _b.end) || "";
      form.priority = task.priority || "none";
      form.notification = task.notification || "";
      form.repeat = task.repeat || "none";
      form.matrixBlock = task.matrixBlock || "not-urgent-not-important";
      customRepeat.interval = ((_c = task.repeatCustom) == null ? void 0 : _c.interval) || 1;
      customRepeat.unit = ((_d = task.repeatCustom) == null ? void 0 : _d.unit) || (((_e = task.repeatDays) == null ? void 0 : _e.length) ? "week" : "week");
      customRepeat.weekdays = ((_g = (_f = task.repeatCustom) == null ? void 0 : _f.weekdays) == null ? void 0 : _g.length) ? [...task.repeatCustom.weekdays] : ((_h = task.repeatDays) == null ? void 0 : _h.length) ? [...task.repeatDays] : [1];
      customRepeat.monthDay = ((_i = task.repeatCustom) == null ? void 0 : _i.monthDay) || dayjs().date();
      attachmentRemoved.value = false;
      if (task.attachment) {
        attachmentName.value = task.attachment.name;
        attachmentMimeType.value = task.attachment.mimeType;
        attachmentDataUrl.value = task.attachment.dataUrl;
      } else {
        resetAttachmentFields();
      }
      explicitNoDeadline.value = !task.dueDate;
    }
    async function loadEditTaskFromRoute() {
      if (!editTaskId.value) return;
      let task = tasksStore.tasks.find((t) => t.id === editTaskId.value);
      if (!task) {
        try {
          task = await tasksStore.fetchTask(editTaskId.value);
        } catch {
          navigateTo("/app", { replace: true });
          return;
        }
      }
      hydrateFromTask(task);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DateFieldRu = _sfc_main$1;
      const _component_TimeFieldRu = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex flex-col bg-sber-gray-light max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-[25] max-lg:mx-auto max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:w-full max-lg:max-w-[430px] max-lg:!min-h-0 max-lg:overflow-hidden max-lg:!pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:static lg:!h-auto lg:!max-h-none lg:!overflow-visible" }, _attrs))}><div class="shrink-0 bg-white px-4 pb-1.5 pt-[max(2.75rem,env(safe-area-inset-top,0px)+1.25rem)] shadow-sm lg:pb-4 lg:pt-14"><div class="flex items-center gap-2 lg:gap-3"><button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sber-gray-light lg:h-10 lg:w-10" type="button">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button><div class="min-w-0"><h1 class="truncate text-lg font-bold text-sber-black lg:text-xl">${ssrInterpolate(unref(isEditMode) ? "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438" : "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430")}</h1><p class="hidden text-sm text-sber-gray lg:block">${ssrInterpolate(unref(isEditMode) ? "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u043F\u043E\u043B\u044F \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\xBB." : "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0434\u0435\u0442\u0430\u043B\u0438.")}</p></div></div></div><div class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-3 py-1 lg:px-4 lg:py-4"><form class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-card lg:min-h-0 lg:overflow-visible lg:rounded-3xl"><div class="shrink-0 px-3 pb-1.5 pt-2 lg:px-5 lg:pb-4 lg:pt-5"><label class="mb-0.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:text-sm">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438</label><input${ssrRenderAttr("value", unref(form).title)} placeholder="\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u043E\u0442\u0447\u0451\u0442, \u0441\u043E\u0437\u0432\u043E\u043D, \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u2026" class="${ssrRenderClass([{ "border-red-400 bg-red-50 placeholder:text-red-300": unref(errors).title }, "input-field py-2 text-sm font-medium !px-3 max-lg:py-2 max-lg:text-sm lg:py-3 lg:!px-4 lg:text-base"])}">`);
      if (unref(errors).title) {
        _push(`<p class="mt-1 text-xs font-medium text-red-500 lg:mt-2">${ssrInterpolate(unref(errors).title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isEditMode)) {
        _push(`<button type="button" class="mt-1.5 text-left text-xs font-semibold text-sber-green lg:hidden">${ssrInterpolate(unref(mobileDescOpen) ? "\u2212 \u0421\u043A\u0440\u044B\u0442\u044C \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" : "+ \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([unref(isEditMode) || unref(mobileDescOpen) ? "max-lg:block" : "max-lg:hidden", "lg:block"])}"><label class="mb-0.5 mt-1.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:mt-4 lg:text-sm">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label><textarea placeholder="\u0414\u0435\u0442\u0430\u043B\u0438, \u0441\u0441\u044B\u043B\u043A\u0438\u2026" class="input-field resize-none py-1.5 text-sm !px-3 max-lg:min-h-[52px] max-lg:py-2 lg:min-h-[88px] lg:py-3 lg:!px-4 lg:text-base" rows="2">${ssrInterpolate(unref(form).description)}</textarea></div><div class="mt-1.5 lg:mt-3"><input type="file" class="hidden"><button type="button" class="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-sber-green/40 bg-sber-green-light px-2 py-1 text-[11px] font-semibold leading-tight text-sber-green transition-colors hover:bg-sber-green/20 lg:gap-2 lg:rounded-xl lg:px-3 lg:py-2 lg:text-sm">`);
      _push(ssrRenderComponent(unref(Paperclip), { class: "h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" }, null, _parent));
      _push(`<span class="truncate lg:hidden">\u0424\u0430\u0439\u043B / \u0444\u043E\u0442\u043E</span><span class="hidden truncate lg:inline">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0444\u0430\u0439\u043B</span></button></div>`);
      if (unref(attachmentName)) {
        _push(`<div class="mt-2 rounded-xl border border-sber-gray-light bg-sber-gray-light/60 p-2 lg:mt-3 lg:rounded-2xl lg:p-3"><div class="flex items-start gap-2 lg:gap-3">`);
        if (unref(attachmentPreviewUrl)) {
          _push(`<img${ssrRenderAttr("src", unref(attachmentPreviewUrl))} alt="\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F" class="h-12 w-12 rounded-lg object-cover lg:h-16 lg:w-16 lg:rounded-xl">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="min-w-0 flex-1"><p class="truncate text-xs font-medium text-sber-black lg:text-sm">${ssrInterpolate(unref(attachmentName))}</p><p class="mt-0.5 text-[10px] text-sber-gray lg:mt-1 lg:text-xs">${ssrInterpolate(unref(attachmentPreviewUrl) ? "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u043E" : "\u0424\u0430\u0439\u043B \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D")}</p></div><button type="button" class="rounded-lg p-1 text-sber-gray transition-colors hover:bg-white hover:text-red-500">`);
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
        _push(`<div class="pb-1 pt-1.5 lg:pb-4 lg:pt-3"><p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">\u0414\u0430\u0442\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F</p><div class="mb-1.5 flex flex-wrap gap-1 lg:mb-4 lg:gap-2"><!--[-->`);
        ssrRenderList(quickDates, (quick) => {
          _push(`<button type="button" class="${ssrRenderClass([isQuickDateActive(quick) ? "bg-sber-green text-white border-sber-green" : "bg-white text-sber-black border-sber-gray-mid", "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors lg:rounded-xl lg:px-3 lg:py-1.5 lg:text-sm"])}">${ssrInterpolate(quick.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (!unref(explicitNoDeadline)) {
          _push(`<!--[--><div class="grid max-lg:grid-cols-2 max-lg:gap-x-2 max-lg:gap-y-1 lg:grid-cols-1 lg:gap-y-3"><div class="min-w-0"><p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">\u0414\u0430\u0442\u0430</p>`);
          _push(ssrRenderComponent(_component_DateFieldRu, {
            ref_key: "dueDateFieldRef",
            ref: dueDateFieldRef,
            modelValue: unref(form).dueDate,
            "onUpdate:modelValue": ($event) => unref(form).dueDate = $event,
            "field-class": "border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:pr-12 lg:text-base",
            onKeydown: onDueDateKeydown
          }, null, _parent));
          _push(`</div><div class="min-w-0"><p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:hidden">\u0412\u0440\u0435\u043C\u044F</p><p class="mb-2 hidden text-xs font-semibold uppercase tracking-wide text-sber-gray lg:block">\u0412\u0440\u0435\u043C\u044F \u0441\u0440\u043E\u043A\u0430</p>`);
          _push(ssrRenderComponent(_component_TimeFieldRu, {
            ref_key: "dueTimeFieldRef",
            ref: dueTimeFieldRef,
            modelValue: unref(form).dueTime,
            "onUpdate:modelValue": ($event) => unref(form).dueTime = $event,
            "field-class": "border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:pr-12 lg:text-base",
            onKeydown: onDueTimeKeydown
          }, null, _parent));
          _push(`</div></div><p class="mb-0.5 mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:mt-3 lg:text-xs">\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</p><div class="flex gap-1.5 lg:gap-2"><div class="min-w-0 flex-1"><label class="mb-0.5 block text-[10px] text-sber-gray lg:mb-1 lg:text-xs">\u041D\u0430\u0447\u0430\u043B\u043E</label>`);
          _push(ssrRenderComponent(_component_TimeFieldRu, {
            ref_key: "durationStartFieldRef",
            ref: durationStartFieldRef,
            modelValue: unref(form).durationStart,
            "onUpdate:modelValue": [($event) => unref(form).durationStart = $event, ($event) => unref(errors).duration = ""],
            "field-class": "border-2 border-sber-green/50 py-2 text-xs !px-2 max-lg:py-1.5 lg:py-4 lg:!px-4 lg:text-base",
            onKeydown: onDurationStartKeydown
          }, null, _parent));
          _push(`</div><div class="min-w-0 flex-1"><label class="mb-0.5 block text-[10px] text-sber-gray lg:mb-1 lg:text-xs">\u041A\u043E\u043D\u0435\u0446</label>`);
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
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "priority") {
        _push(`<div class="pb-3 pt-2 lg:px-0 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
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
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
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
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">\u041F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435</p><div class="flex flex-col gap-1.5 lg:gap-2"><!--[-->`);
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
          _push(`<div class="mt-2 rounded-xl border border-sber-green/30 bg-sber-green-light/30 p-3 lg:mt-3 lg:rounded-2xl lg:p-4"><p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435</p><div class="mt-3 flex flex-wrap items-center gap-2"><span class="text-sm text-sber-gray">\u041A\u0430\u0436\u0434\u044B\u0435</span><input${ssrRenderAttr("value", unref(customRepeat).interval)} type="number" min="1" max="31" class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "week" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> \u041D\u0435\u0434\u0435\u043B\u0438 </button><button type="button" class="${ssrRenderClass([unref(customRepeat).unit === "month" ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-black", "rounded-xl border px-3 py-2 text-sm font-medium transition-colors"])}"> \u041C\u0435\u0441\u044F\u0446\u0430 </button></div>`);
          if (unref(customRepeat).unit === "week") {
            _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0414\u043D\u0438 \u043D\u0435\u0434\u0435\u043B\u0438</p><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(weekDays, (day) => {
              _push(`<button type="button" class="${ssrRenderClass([unref(customRepeat).weekdays.includes(day.value) ? "border-sber-green bg-sber-green text-white" : "border-sber-gray-mid bg-white text-sber-gray", "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"])}">${ssrInterpolate(day.label)}</button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<div class="mt-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">\u0414\u0435\u043D\u044C \u043C\u0435\u0441\u044F\u0446\u0430</p><input${ssrRenderAttr("value", unref(customRepeat).monthDay)} type="number" min="1" max="31" class="w-28 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"></div>`);
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
        _push(`<div class="pb-3 pt-2 lg:pb-4 lg:pt-3"><p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">\u0411\u043B\u043E\u043A \u043C\u0430\u0442\u0440\u0438\u0446\u044B</p><div class="grid grid-cols-2 gap-1.5 lg:gap-2"><!--[-->`);
        ssrRenderList(matrixBlocks, (block) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(form).matrixBlock === block.id ? "border-current" : "border-sber-gray-light", "flex flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-left transition-all lg:gap-1 lg:rounded-2xl lg:px-3 lg:py-3"])}" style="${ssrRenderStyle(unref(form).matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + "15" } : {})}"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: block.color })}"></div><span class="text-[10px] font-medium leading-tight text-sber-black lg:text-xs">${ssrInterpolate(block.title)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="shrink-0 border-t border-sber-gray-light bg-white px-3 pb-2 pt-2 lg:px-4 lg:pb-4 lg:pt-3">`);
      if (unref(isEditMode) && unref(editingTask)) {
        _push(`<!--[--><div class="max-lg:space-y-2 lg:hidden"><button class="${ssrRenderClass([unref(editingTask).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-xs font-semibold transition-colors"])}" type="button">`);
        _push(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(editingTask).completed ? "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" : "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E")}</button><div class="flex gap-1.5"><button class="btn-secondary min-w-0 flex-1 !w-auto !py-2.5 !text-xs" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="flex min-w-0 flex-[0.9] items-center justify-center gap-1 rounded-2xl bg-red-50 py-2.5 text-[11px] font-semibold text-red-500 transition-colors" type="button">`);
        _push(ssrRenderComponent(unref(Trash2), { class: "h-3.5 w-3.5 shrink-0" }, null, _parent));
        _push(`<span class="truncate">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</span></button><button class="btn-primary min-w-0 flex-[1.15] !w-auto !py-2.5 !text-xs" type="submit"> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button></div></div><div class="hidden lg:block"><button class="btn-secondary mb-3" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button><div class="mb-3 space-y-2"><button class="${ssrRenderClass([unref(editingTask).completed ? "bg-sber-gray-light text-sber-gray" : "bg-sber-green-light text-sber-green", "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-colors"])}" type="button">`);
        _push(ssrRenderComponent(unref(Check), { class: "h-5 w-5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(editingTask).completed ? "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" : "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E")}</button><button class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition-colors" type="button">`);
        _push(ssrRenderComponent(unref(Trash2), { class: "h-5 w-5" }, null, _parent));
        _push(` \u0423\u0434\u0430\u043B\u0438\u0442\u044C </button></div><button class="btn-primary" type="submit"> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="flex gap-1.5 lg:hidden"><button class="btn-secondary min-w-0 flex-1 !w-auto !py-2.5 !text-sm" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="btn-primary min-w-0 flex-[1.35] !w-auto !py-2.5 !text-sm" type="submit"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 </button></div><div class="hidden lg:block"><button class="btn-secondary mb-3" type="button"> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="btn-primary" type="submit"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 </button></div><!--]-->`);
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

export { _sfc_main as default };
//# sourceMappingURL=new-task-DMIMkq5F.mjs.map
