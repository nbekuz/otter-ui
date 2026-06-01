import { _ as _sfc_main$1 } from './TaskDetailModal-D0BO3hOm.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { LayoutGrid, CalendarDays, CalendarRange, Calendar, Columns, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { d as useRoute, b as useTasksStore, f as defineStore, n as navigateTo } from './server.mjs';
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

const useCalendarStore = defineStore("calendar", () => {
  const currentDate = ref(dayjs().format("YYYY-MM-DD"));
  const viewType = ref("day");
  const collapsedEarlyHours = ref(true);
  const collapsedLateHours = ref(true);
  const displayLabel = computed(() => {
    const d = dayjs(currentDate.value);
    switch (viewType.value) {
      case "day":
        return d.format("D MMMM YYYY");
      case "week": {
        const start = d.startOf("week");
        const end = d.endOf("week");
        if (start.month() === end.month()) {
          return `${start.format("D")}\u2013${end.format("D MMMM YYYY")}`;
        }
        return `${start.format("D MMM")} \u2013 ${end.format("D MMM YYYY")}`;
      }
      case "month":
        return d.format("MMMM YYYY");
      case "year":
        return d.format("YYYY");
    }
  });
  function goNext() {
    const d = dayjs(currentDate.value);
    switch (viewType.value) {
      case "day":
        currentDate.value = d.add(1, "day").format("YYYY-MM-DD");
        break;
      case "week":
        currentDate.value = d.add(1, "week").format("YYYY-MM-DD");
        break;
      case "month":
        currentDate.value = d.add(1, "month").format("YYYY-MM-DD");
        break;
      case "year":
        currentDate.value = d.add(1, "year").format("YYYY-MM-DD");
        break;
    }
  }
  function goPrev() {
    const d = dayjs(currentDate.value);
    switch (viewType.value) {
      case "day":
        currentDate.value = d.subtract(1, "day").format("YYYY-MM-DD");
        break;
      case "week":
        currentDate.value = d.subtract(1, "week").format("YYYY-MM-DD");
        break;
      case "month":
        currentDate.value = d.subtract(1, "month").format("YYYY-MM-DD");
        break;
      case "year":
        currentDate.value = d.subtract(1, "year").format("YYYY-MM-DD");
        break;
    }
  }
  function goToday() {
    currentDate.value = dayjs().format("YYYY-MM-DD");
  }
  function setDate(date) {
    currentDate.value = date;
  }
  function setView(view) {
    viewType.value = view;
  }
  function toggleEarlyHours() {
    collapsedEarlyHours.value = !collapsedEarlyHours.value;
  }
  function toggleLateHours() {
    collapsedLateHours.value = !collapsedLateHours.value;
  }
  return {
    currentDate,
    viewType,
    displayLabel,
    collapsedEarlyHours,
    collapsedLateHours,
    goNext,
    goPrev,
    goToday,
    setDate,
    setView,
    toggleEarlyHours,
    toggleLateHours
  };
});
const minuteHeightPx = 1;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "calendar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const calendarStore = useCalendarStore();
    const tasksStore = useTasksStore();
    const todayStr = dayjs().format("YYYY-MM-DD");
    const viewMenuOpen = ref(false);
    const selectedTaskId = ref(null);
    ref(null);
    const viewTypes = [
      { value: "day", label: "\u0414\u0435\u043D\u044C", icon: CalendarDays },
      { value: "week", label: "\u041D\u0435\u0434\u0435\u043B\u044F", icon: CalendarRange },
      { value: "month", label: "\u041C\u0435\u0441\u044F\u0446", icon: Calendar },
      { value: "year", label: "\u0413\u043E\u0434", icon: Columns }
    ];
    computed(() => {
      const now = dayjs();
      return (now.hour() * 60 + now.minute()) * (60 / 60);
    });
    const isCurrentTimeInMainRange = computed(() => {
      const now = dayjs();
      const nowMinutes = now.hour() * 60 + now.minute();
      return nowMinutes >= mainStartMinutes && nowMinutes <= mainEndMinutes;
    });
    const currentMainTimePx = computed(() => {
      const now = dayjs();
      const nowMinutes = now.hour() * 60 + now.minute();
      return Math.max(0, nowMinutes - mainStartMinutes) * minuteHeightPx;
    });
    const earlyHours = [0, 1, 2, 3, 4, 5];
    const mainHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const lateHours = [21, 22, 23];
    const mainStartMinutes = mainHours[0] * 60;
    const mainEndMinutes = (mainHours[mainHours.length - 1] + 1) * 60;
    ref(null);
    ref(null);
    const dragPreview = ref(null);
    ref(false);
    ref(false);
    const weekDays = computed(() => {
      const current = dayjs(calendarStore.currentDate);
      const startOfWeek = current.startOf("week");
      return Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeek.add(i, "day");
        return {
          date: d.format("YYYY-MM-DD"),
          dayName: d.format("dd")[0],
          dayNum: d.format("D"),
          isToday: d.format("YYYY-MM-DD") === todayStr
        };
      });
    });
    const weekViewDays = computed(() => {
      const current = dayjs(calendarStore.currentDate);
      const startOfWeek = current.startOf("week");
      return Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeek.add(i, "day");
        return {
          date: d.format("YYYY-MM-DD"),
          dayName: d.format("dd").substring(0, 2),
          dayNum: d.format("D"),
          isToday: d.format("YYYY-MM-DD") === todayStr
        };
      });
    });
    function getHourTasks(hour) {
      return tasksStore.getTasksForDate(calendarStore.currentDate).filter((t) => {
        if (!t.dueTime) return false;
        const h = parseInt(t.dueTime.split(":")[0]);
        return h === hour;
      });
    }
    function intervalsOverlapHalfOpen(aStart, aEnd, bStart, bEnd) {
      return aStart < bEnd && bStart < aEnd;
    }
    function assignDayTimelineOverlapLayout(segments) {
      const layout = /* @__PURE__ */ new Map();
      const n = segments.length;
      if (n === 0) return layout;
      const visited = new Array(n).fill(false);
      for (let startIdx = 0; startIdx < n; startIdx++) {
        if (visited[startIdx]) continue;
        const stack = [startIdx];
        visited[startIdx] = true;
        const comp = [];
        while (stack.length) {
          const u = stack.pop();
          comp.push(u);
          for (let v = 0; v < n; v++) {
            if (visited[v]) continue;
            const su = segments[u];
            const sv = segments[v];
            if (intervalsOverlapHalfOpen(su.rawStart, su.rawEnd, sv.rawStart, sv.rawEnd)) {
              visited[v] = true;
              stack.push(v);
            }
          }
        }
        const endpoints = [];
        for (const idx of comp) {
          const s = segments[idx];
          endpoints.push({ t: s.rawStart, d: 1 });
          endpoints.push({ t: s.rawEnd, d: -1 });
        }
        endpoints.sort((a, b) => a.t !== b.t ? a.t - b.t : a.d - b.d);
        let sweep = 0;
        let maxConc = 0;
        for (const e of endpoints) {
          sweep += e.d;
          maxConc = Math.max(maxConc, sweep);
        }
        const cols = Math.max(1, maxConc);
        const sortedIdx = [...comp].sort((ai, bi) => {
          const a = segments[ai];
          const b = segments[bi];
          if (a.rawStart !== b.rawStart) return a.rawStart - b.rawStart;
          return b.rawEnd - a.rawEnd;
        });
        const columnEnds = [];
        for (const idx of sortedIdx) {
          const t = segments[idx];
          let col = columnEnds.findIndex((end) => end <= t.rawStart);
          if (col === -1) {
            col = columnEnds.length;
            columnEnds.push(t.rawEnd);
          } else {
            columnEnds[col] = t.rawEnd;
          }
          layout.set(t.id, { col, cols });
        }
      }
      return layout;
    }
    function dayTimelineTaskHorizontalStyle(layoutCols, layoutCol) {
      const pad = 4;
      const gap = 3;
      if (layoutCols <= 1) {
        return { left: `${pad}px`, right: `${pad}px` };
      }
      const gapsTotal = gap * (layoutCols - 1);
      const innerPx = 2 * pad + gapsTotal;
      return {
        left: `calc(${pad}px + (100% - ${innerPx}px) * ${layoutCol} / ${layoutCols} + ${gap * layoutCol}px)`,
        width: `calc((100% - ${innerPx}px) / ${layoutCols})`,
        right: "auto"
      };
    }
    const dayTimelineTasks = computed(() => {
      const base = tasksStore.getTasksForDate(calendarStore.currentDate).filter((t) => !!t.dueTime).map((task) => {
        var _a, _b;
        const preview = ((_a = dragPreview.value) == null ? void 0 : _a.taskId) === task.id ? dragPreview.value : null;
        const startMinutes = preview ? preview.start : parseTimeToMinutes(task.dueTime || "00:00");
        const durationMinutes = preview ? preview.end - preview.start : getTaskDurationMinutes(task);
        const endMinutes = Math.min(startMinutes + durationMinutes, mainEndMinutes);
        const clippedStart = Math.max(startMinutes, mainStartMinutes);
        const clippedDuration = Math.max(endMinutes - clippedStart, 15);
        const labelTime = preview ? `${formatMinutesToTime(preview.start)} \u2013 ${formatMinutesToTime(preview.end)}` : ((_b = task.duration) == null ? void 0 : _b.end) ? `${task.dueTime} \u2013 ${task.duration.end}` : task.dueTime || "";
        return {
          ...task,
          rawStart: startMinutes,
          rawEnd: startMinutes + durationMinutes,
          labelTime,
          topPx: (clippedStart - mainStartMinutes) * minuteHeightPx,
          heightPx: clippedDuration * minuteHeightPx
        };
      }).filter((task) => task.topPx < (mainEndMinutes - mainStartMinutes) * minuteHeightPx);
      const layout = assignDayTimelineOverlapLayout(
        base.map((t) => ({ id: t.id, rawStart: t.rawStart, rawEnd: t.rawEnd }))
      );
      return base.map((task) => {
        var _a;
        const slot = (_a = layout.get(task.id)) != null ? _a : { col: 0, cols: 1 };
        return {
          ...task,
          layoutCol: slot.col,
          layoutCols: slot.cols
        };
      });
    });
    function getDateHourTasks(date, hour) {
      return tasksStore.getTasksForDate(date).filter((t) => {
        if (!t.dueTime) return false;
        const h = parseInt(t.dueTime.split(":")[0]);
        return h === hour;
      });
    }
    function getPriorityColor(priority) {
      const colors = {
        high: "#FF3B30",
        medium: "#FF9500",
        low: "#34C759",
        none: "#8E8E93"
      };
      return colors[priority] || "#8E8E93";
    }
    function parseTimeToMinutes(time) {
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      const hours = Number.isFinite(h) ? h : 0;
      const minutes = Number.isFinite(m) ? m : 0;
      return hours * 60 + minutes;
    }
    function formatMinutesToTime(totalMinutes) {
      const clamped = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
      const hours = Math.floor(clamped / 60);
      const minutes = clamped % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    function getTaskDurationMinutes(task) {
      var _a, _b;
      if (((_a = task.duration) == null ? void 0 : _a.start) && ((_b = task.duration) == null ? void 0 : _b.end)) {
        const start = parseTimeToMinutes(task.duration.start);
        const end = parseTimeToMinutes(task.duration.end);
        if (end > start) return end - start;
      }
      return 60;
    }
    function openTaskFromDetailModal(taskId) {
      selectedTaskId.value = null;
      navigateTo({ path: "/app/new-task", query: { id: taskId, returnTo: route.path } });
    }
    const monthCells = computed(() => {
      const d = dayjs(calendarStore.currentDate);
      const startOfMonth = d.startOf("month");
      const endOfMonth = d.endOf("month");
      const startDow = (startOfMonth.day() + 6) % 7;
      const cells = [];
      for (let i = 0; i < startDow; i++) {
        const day = startOfMonth.subtract(startDow - i, "day");
        cells.push({ date: day.format("YYYY-MM-DD"), day: day.date(), isCurrentMonth: false, isToday: false });
      }
      for (let i = 1; i <= endOfMonth.date(); i++) {
        const day = d.date(i);
        cells.push({
          date: day.format("YYYY-MM-DD"),
          day: i,
          isCurrentMonth: true,
          isToday: day.format("YYYY-MM-DD") === todayStr
        });
      }
      return cells;
    });
    function getMonthCellTasks(date) {
      if (!date) return [];
      return tasksStore.getTasksForDate(date).slice(0, 3);
    }
    const yearMonths = computed(() => {
      const year = parseInt(calendarStore.currentDate.substring(0, 4));
      const monthNames = ["\u042F\u043D\u0432", "\u0424\u0435\u0432", "\u041C\u0430\u0440", "\u0410\u043F\u0440", "\u041C\u0430\u0439", "\u0418\u044E\u043D", "\u0418\u044E\u043B", "\u0410\u0432\u0433", "\u0421\u0435\u043D", "\u041E\u043A\u0442", "\u041D\u043E\u044F", "\u0414\u0435\u043A"];
      return Array.from({ length: 12 }, (_, i) => {
        const m = dayjs().year(year).month(i);
        const startDow = (m.startOf("month").day() + 6) % 7;
        const cells = [];
        for (let j = 0; j < startDow; j++) cells.push({ day: null, isToday: false });
        for (let j = 1; j <= m.daysInMonth(); j++) {
          const d = m.date(j);
          cells.push({ day: j, isToday: d.format("YYYY-MM-DD") === todayStr });
        }
        return { index: i, name: monthNames[i], cells };
      });
    });
    watch(
      [() => calendarStore.currentDate, () => calendarStore.viewType],
      ([date, view]) => {
        void tasksStore.fetchCalendar(view, date);
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskDetailModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex min-h-0 flex-col overflow-hidden bg-sber-gray-light max-lg:h-dvh max-lg:max-h-dvh lg:h-full lg:min-h-0 lg:pb-0" }, _attrs))}><div class="relative z-40 shrink-0 bg-white shadow-sm pt-14 pb-3 px-4"><div class="flex items-center justify-between mb-3"><h1 class="text-xl font-bold text-sber-black">${ssrInterpolate(unref(calendarStore).displayLabel)}</h1><div class="flex items-center gap-2"><button class="text-xs font-semibold text-sber-green px-3 py-1.5 bg-sber-green-light rounded-xl"> \u0421\u0435\u0433\u043E\u0434\u043D\u044F </button><button class="w-8 h-8 flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-5 h-5 text-sber-gray" }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(viewMenuOpen)) {
        _push(`<div class="absolute top-full left-4 right-4 bg-white rounded-2xl shadow-modal z-50 p-2"><!--[-->`);
        ssrRenderList(viewTypes, (v) => {
          _push(`<button class="${ssrRenderClass([unref(calendarStore).viewType === v.value ? "bg-sber-green-light text-sber-green" : "text-sber-black", "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(v.icon), { class: "w-4 h-4" }, null), _parent);
          _push(` ${ssrInterpolate(v.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center justify-between"><button class="w-9 h-9 bg-sber-gray-light rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-5 h-5 text-sber-black" }, null, _parent));
      _push(`</button>`);
      if (unref(calendarStore).viewType === "day") {
        _push(`<div class="flex gap-1"><!--[-->`);
        ssrRenderList(unref(weekDays), (day) => {
          _push(`<button class="${ssrRenderClass([day.date === unref(calendarStore).currentDate ? "bg-sber-green text-white" : day.isToday ? "bg-sber-green-light text-sber-green" : "text-sber-gray", "w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all"])}"><span class="text-[10px] font-medium">${ssrInterpolate(day.dayName)}</span><span class="text-sm font-bold">${ssrInterpolate(day.dayNum)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-sm font-semibold text-sber-black">${ssrInterpolate(unref(calendarStore).displayLabel)}</div>`);
      }
      _push(`<button class="w-9 h-9 bg-sber-gray-light rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-sber-black" }, null, _parent));
      _push(`</button></div></div><div class="flex-1 min-h-0 overflow-y-auto">`);
      if (unref(calendarStore).viewType === "day") {
        _push(`<div class="relative"><div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"><div class="w-14 text-xs text-sber-gray text-right pr-3">00\u201306</div><div class="flex-1 h-px bg-sber-gray-mid"></div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(calendarStore).collapsedEarlyHours ? unref(ChevronDown) : unref(ChevronUp)), { class: "w-4 h-4 text-sber-gray ml-2" }, null), _parent);
        _push(`</div>`);
        if (!unref(calendarStore).collapsedEarlyHours) {
          _push(`<div><!--[-->`);
          ssrRenderList(earlyHours, (h) => {
            _push(`<div class="flex min-h-[50px]"><div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div><div class="flex-1 cursor-pointer border-t border-sber-gray-light relative"><!--[-->`);
            ssrRenderList(getHourTasks(h), (task) => {
              _push(`<div class="absolute left-1 right-1 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "30", color: getPriorityColor(task.priority), top: "2px" })}">${ssrInterpolate(task.title)}</div>`);
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="relative">`);
        if (unref(calendarStore).currentDate === unref(todayStr) && unref(isCurrentTimeInMainRange)) {
          _push(`<div class="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center" style="${ssrRenderStyle({ transform: `translateY(${unref(currentMainTimePx)}px)` })}"><div class="w-14 flex-shrink-0"></div><div class="relative flex-1"><div class="absolute left-0 right-0 flex items-center"><div class="w-2 h-2 rounded-full bg-red-500 -ml-1"></div><div class="flex-1 h-0.5 bg-red-500"></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(mainHours, (h) => {
          _push(`<div class="flex min-h-[60px]"><div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div><div class="flex-1 cursor-pointer border-t border-sber-gray-light"></div></div>`);
        });
        _push(`<!--]--><div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14"><!--[-->`);
        ssrRenderList(unref(dayTimelineTasks), (task) => {
          var _a;
          _push(`<div class="pointer-events-auto absolute cursor-grab touch-none select-none overflow-hidden rounded-xl px-3 py-2 transition-opacity active:opacity-70" style="${ssrRenderStyle({
            ...dayTimelineTaskHorizontalStyle(task.layoutCols, task.layoutCol),
            top: `${task.topPx}px`,
            height: `${task.heightPx}px`,
            zIndex: ((_a = unref(dragPreview)) == null ? void 0 : _a.taskId) === task.id ? 35 : 1,
            backgroundColor: getPriorityColor(task.priority) + "20",
            borderLeft: `3px solid ${getPriorityColor(task.priority)}`
          })}"><button type="button" class="absolute left-1/2 top-0 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-start justify-center pt-1" aria-label="\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430\u0447\u0430\u043B\u043E"><span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50"></span></button><p class="pointer-events-none relative z-10 text-xs font-semibold" style="${ssrRenderStyle({ color: getPriorityColor(task.priority) })}">${ssrInterpolate(task.labelTime)}</p><p class="pointer-events-none relative z-10 truncate text-xs font-medium text-sber-black">${ssrInterpolate(task.title)}</p><button type="button" class="absolute bottom-0 left-1/2 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-end justify-center pb-1" aria-label="\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0435\u0446"><span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50"></span></button></div>`);
        });
        _push(`<!--]--></div></div><div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"><div class="w-14 text-xs text-sber-gray text-right pr-3">21\u201300</div><div class="flex-1 h-px bg-sber-gray-mid"></div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(calendarStore).collapsedLateHours ? unref(ChevronDown) : unref(ChevronUp)), { class: "w-4 h-4 text-sber-gray ml-2" }, null), _parent);
        _push(`</div>`);
        if (!unref(calendarStore).collapsedLateHours) {
          _push(`<div><!--[-->`);
          ssrRenderList(lateHours, (h) => {
            _push(`<div class="flex min-h-[50px]"><div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div><div class="flex-1 cursor-pointer border-t border-sber-gray-light relative px-1"><!--[-->`);
            ssrRenderList(getHourTasks(h), (task) => {
              _push(`<div class="rounded-xl px-3 py-2 mb-1 cursor-pointer transition-opacity active:opacity-70" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "20", borderLeft: `3px solid ${getPriorityColor(task.priority)}` })}"><p class="text-xs font-semibold" style="${ssrRenderStyle({ color: getPriorityColor(task.priority) })}">${ssrInterpolate(task.dueTime)} ${ssrInterpolate(task.duration ? `\u2013 ${task.duration.end}` : "")}</p><p class="text-xs text-sber-black font-medium truncate">${ssrInterpolate(task.title)}</p></div>`);
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(calendarStore).viewType === "week") {
        _push(`<div class="p-4"><div class="mb-3 flex gap-1"><div class="w-8"></div><!--[-->`);
        ssrRenderList(unref(weekViewDays), (day) => {
          _push(`<div class="flex-1 text-center"><p class="text-[10px] text-sber-gray">${ssrInterpolate(day.dayName)}</p><div class="${ssrRenderClass([day.isToday ? "bg-sber-green text-white" : "text-sber-black", "w-8 h-8 rounded-full mx-auto flex items-center justify-center"])}"><span class="text-sm font-bold">${ssrInterpolate(day.dayNum)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="overflow-hidden rounded-2xl border border-[#c8cfdb] bg-white/45"><!--[-->`);
        ssrRenderList([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], (h) => {
          _push(`<div class="flex min-h-[48px] border-t border-[#c8cfdb] first:border-t-0"><div class="w-8 flex-shrink-0 pr-1 pt-1 text-right text-[10px] text-sber-gray">${ssrInterpolate(String(h).padStart(2, "0"))}</div><!--[-->`);
          ssrRenderList(unref(weekViewDays), (day) => {
            _push(`<div class="relative flex-1 overflow-hidden border-l border-[#c8cfdb] px-0.5 py-0.5"><!--[-->`);
            ssrRenderList(getDateHourTasks(day.date, h), (task) => {
              _push(`<div class="mb-0.5 w-full max-h-[44px] cursor-move overflow-hidden rounded border border-[#c8cfdb] px-1 py-0.5" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "22" })}" draggable="true"><p class="truncate text-[9px] font-semibold text-sber-black">${ssrInterpolate(task.dueTime)}</p><p class="truncate text-[9px] font-medium text-sber-black">${ssrInterpolate(task.title)}</p></div>`);
            });
            _push(`<!--]--></div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(calendarStore).viewType === "month") {
        _push(`<div class="p-4"><div class="mb-1 grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"], (d) => {
          _push(`<div class="py-1 text-center text-[10px] font-semibold text-sber-gray">${ssrInterpolate(d)}</div>`);
        });
        _push(`<!--]--></div><div class="grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(unref(monthCells), (cell) => {
          _push(`<div class="${ssrRenderClass([[
            !cell.isCurrentMonth ? "opacity-35" : "",
            cell.date === unref(calendarStore).currentDate ? "bg-sber-green-light/70" : cell.isToday ? "bg-sber-green-light/40" : "bg-white/40 hover:bg-sber-gray-light"
          ], "relative aspect-square overflow-hidden rounded-xl border border-[#c8cfdb] p-1 transition-colors"])}"><div class="flex items-center justify-between"><span class="${ssrRenderClass([cell.isToday ? "bg-sber-green text-white" : "text-sber-black", "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold"])}">${ssrInterpolate(cell.day)}</span></div><div class="mt-1 space-y-0.5"><!--[-->`);
          ssrRenderList(getMonthCellTasks(cell.date), (task) => {
            _push(`<div class="truncate rounded border border-[#c8cfdb] px-1 py-0.5 text-[9px] font-medium text-sber-black" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "20" })}" draggable="true">${ssrInterpolate(task.title)}</div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(calendarStore).viewType === "year") {
        _push(`<div class="p-4"><div class="grid grid-cols-3 gap-3"><!--[-->`);
        ssrRenderList(unref(yearMonths), (month) => {
          _push(`<div class="bg-white rounded-2xl p-3 cursor-pointer active:bg-sber-gray-light"><p class="text-xs font-bold text-sber-black mb-2">${ssrInterpolate(month.name)}</p><div class="grid grid-cols-7 gap-px"><!--[-->`);
          ssrRenderList(month.cells.slice(0, 35), (cell) => {
            _push(`<div class="aspect-square flex items-center justify-center">`);
            if (cell.day) {
              _push(`<span class="${ssrRenderClass([cell.isToday ? "w-4 h-4 rounded-full bg-sber-green text-white flex items-center justify-center" : "text-sber-gray", "text-[9px]"])}">${ssrInterpolate(cell.day)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/calendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=calendar-Ck4V4lIK.mjs.map
