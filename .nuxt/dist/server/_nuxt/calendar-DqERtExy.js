import { _ as _sfc_main$1 } from "./TaskDetailModal-CTrbCuaM.js";
import { ref, computed, defineComponent, watch, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { LayoutGrid, CalendarDays, CalendarRange, Calendar, Columns, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp } from "lucide-vue-next";
import dayjs from "dayjs";
import { f as defineStore, c as useTasksStore, o as onClickOutside, g as getTaskScheduleStart, p as parseTimeToMinutes, h as getTaskDurationMinutes, i as formatMinutesToTime } from "../server.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/hookable/dist/index.mjs";
import "./useTaskTimeSync-v9DF83sN.js";
import "dayjs/plugin/customParseFormat.js";
import "./priority-colors-BPjPHsbX.js";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/unctx/dist/index.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/defu/dist/defu.mjs";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/ufo/dist/index.mjs";
import "axios";
import "/Users/nodirbek/Desktop/otter/otter-app/node_modules/klona/dist/index.mjs";
import "dayjs/locale/ru.js";
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
          return `${start.format("D")}–${end.format("D MMMM YYYY")}`;
        }
        return `${start.format("D MMM")} – ${end.format("D MMM YYYY")}`;
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
const weekHourHeightPx = 48;
const earlyStartMinutes = 0;
const lateEndMinutes = 24 * 60;
const minuteHeightPx = 1;
const earlyLateMinuteHeightPx = 50 / 60;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "calendar",
  __ssrInlineRender: true,
  setup(__props) {
    const calendarStore = useCalendarStore();
    const tasksStore = useTasksStore();
    const todayStr = dayjs().format("YYYY-MM-DD");
    const viewMenuOpen = ref(false);
    const viewMenuRef = ref(null);
    const selectedTaskId = ref(null);
    onClickOutside(viewMenuRef, () => {
      viewMenuOpen.value = false;
    });
    const dayUntimedTasks = computed(() => getUntimedTasksForDate(calendarStore.currentDate));
    ref(null);
    const viewTypes = [
      { value: "day", label: "День", icon: CalendarDays },
      { value: "week", label: "Неделя", icon: CalendarRange },
      { value: "month", label: "Месяц", icon: Calendar },
      { value: "year", label: "Год", icon: Columns }
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
    const mainHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const lateHours = [22, 23];
    const weekHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const weekStartHour = weekHours[0];
    const earlyEndMinutes = earlyHours.length * 60;
    const lateStartMinutes = lateHours[0] * 60;
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
      const base = tasksStore.getTasksForDate(calendarStore.currentDate).filter((t) => !!getTaskScheduleStart(t)).map((task) => {
        const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null;
        const scheduleStart = getTaskScheduleStart(task) || "00:00";
        const startMinutes = preview ? preview.start : parseTimeToMinutes(scheduleStart);
        const durationMinutes = preview ? preview.end - preview.start : getTaskDurationMinutes(task);
        const fullEndMinutes = startMinutes + durationMinutes;
        if (fullEndMinutes <= mainStartMinutes || startMinutes >= mainEndMinutes) return null;
        const clippedEnd = Math.min(fullEndMinutes, mainEndMinutes);
        const clippedStart = Math.max(startMinutes, mainStartMinutes);
        const clippedDuration = Math.max(clippedEnd - clippedStart, 15);
        const isContinuation = startMinutes < mainStartMinutes;
        const labelTime = preview ? `${formatMinutesToTime(preview.start)} – ${formatMinutesToTime(preview.end)}` : task.duration?.start && task.duration?.end ? `${task.duration.start} – ${task.duration.end}` : getTaskScheduleStart(task) || "";
        return {
          ...task,
          rawStart: startMinutes,
          rawEnd: fullEndMinutes,
          labelTime,
          isContinuation,
          topPx: (clippedStart - mainStartMinutes) * minuteHeightPx,
          heightPx: clippedDuration * minuteHeightPx
        };
      }).filter((task) => !!task);
      const layout = assignDayTimelineOverlapLayout(
        base.map((t) => ({ id: t.id, rawStart: t.rawStart, rawEnd: t.rawEnd }))
      );
      return base.map((task) => {
        const slot = layout.get(task.id) ?? { col: 0, cols: 1 };
        return {
          ...task,
          layoutCol: slot.col,
          layoutCols: slot.cols
        };
      });
    });
    function buildSectionTimelineTasks(rangeStart, rangeEnd, pxPerMinute, hourFilter) {
      return tasksStore.getTasksForDate(calendarStore.currentDate).filter((t) => !!getTaskScheduleStart(t)).map((task) => {
        const preview = dragPreview.value?.taskId === task.id ? dragPreview.value : null;
        const scheduleStart = getTaskScheduleStart(task) || "00:00";
        const startMinutes = preview ? preview.start : parseTimeToMinutes(scheduleStart);
        const startHour = Math.floor(startMinutes / 60);
        if (!hourFilter(startHour)) return null;
        const durationMinutes = preview ? preview.end - preview.start : getTaskDurationMinutes(task);
        const endMinutes = startMinutes + durationMinutes;
        if (endMinutes <= rangeStart || startMinutes >= rangeEnd) return null;
        const clippedStart = Math.max(startMinutes, rangeStart);
        const clippedEnd = Math.min(endMinutes, rangeEnd);
        const clippedDuration = Math.max(clippedEnd - clippedStart, 15);
        const continuesAfter = endMinutes > rangeEnd;
        return {
          ...task,
          rawStart: startMinutes,
          rawEnd: endMinutes,
          continuesAfter,
          topPx: (clippedStart - rangeStart) * pxPerMinute,
          heightPx: clippedDuration * pxPerMinute
        };
      }).filter((task) => !!task);
    }
    const earlyTimelineTasks = computed(
      () => buildSectionTimelineTasks(earlyStartMinutes, earlyEndMinutes, earlyLateMinuteHeightPx, (h) => h < 6)
    );
    const lateTimelineTasks = computed(
      () => buildSectionTimelineTasks(lateStartMinutes, lateEndMinutes, earlyLateMinuteHeightPx, (h) => h >= 22)
    );
    function getWeekDayTimelineTasks(date) {
      return tasksStore.getTasksForDate(date).filter((t) => !!getTaskScheduleStart(t)).map((task) => {
        const scheduleStart = getTaskScheduleStart(task) || "00:00";
        const startMinutes = parseTimeToMinutes(scheduleStart);
        const startHour = Math.floor(startMinutes / 60);
        if (!weekHours.includes(startHour)) return null;
        const durationMinutes = getTaskDurationMinutes(task);
        const topPx = (startMinutes - weekStartHour * 60) / 60 * weekHourHeightPx;
        const heightPx = Math.max(durationMinutes / 60 * weekHourHeightPx, weekHourHeightPx * 0.5);
        return { ...task, topPx, heightPx };
      }).filter((task) => !!task);
    }
    function formatTaskScheduleLabel(task) {
      if (task.duration?.start && task.duration?.end) {
        return `${task.duration.start} – ${task.duration.end}`;
      }
      return getTaskScheduleStart(task) || "";
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
    function refreshCalendarTasks() {
      void tasksStore.fetchCalendar(calendarStore.viewType, calendarStore.currentDate);
    }
    function getUntimedTasksForDate(date) {
      return tasksStore.getTasksForDate(date).filter((t) => !getTaskScheduleStart(t));
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
      const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
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
    watch(
      () => tasksStore.calendarTasks,
      (tasks) => {
        if (calendarStore.viewType !== "day") return;
        const hasLate = tasks.some((task) => {
          const start = getTaskScheduleStart(task);
          if (!start) return false;
          const hour = parseInt(start.split(":")[0], 10);
          const endHour = task.duration?.end ? parseInt(task.duration.end.split(":")[0], 10) : hour;
          return hour >= 21 || endHour >= 21;
        });
        if (hasLate) {
          calendarStore.collapsedLateHours = false;
        }
        const hasEarly = tasks.some((task) => {
          const start = getTaskScheduleStart(task);
          if (!start) return false;
          return parseInt(start.split(":")[0], 10) < 6;
        });
        if (hasEarly) {
          calendarStore.collapsedEarlyHours = false;
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TasksTaskDetailModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex min-h-0 flex-col overflow-hidden bg-sber-gray-light max-lg:h-dvh max-lg:max-h-dvh lg:h-full lg:min-h-0 lg:pb-0" }, _attrs))}><div class="page-header-top relative z-40 shrink-0 bg-white shadow-sm px-4 pb-2"><div class="mb-2 flex items-center justify-end gap-2"><button class="rounded-xl bg-sber-green-light px-3 py-1.5 text-xs font-semibold text-sber-green"> Сегодня </button><div class="relative"><button class="flex h-8 w-8 items-center justify-center">`);
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "h-5 w-5 text-sber-gray" }, null, _parent));
      _push(`</button>`);
      if (unref(viewMenuOpen)) {
        _push(`<div class="absolute right-0 top-full z-50 mt-1 min-w-[10rem] rounded-2xl bg-white p-2 shadow-modal"><!--[-->`);
        ssrRenderList(viewTypes, (v) => {
          _push(`<button class="${ssrRenderClass([unref(calendarStore).viewType === v.value ? "bg-sber-green-light text-sber-green" : "text-sber-black", "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(v.icon), { class: "h-4 w-4" }, null), _parent);
          _push(` ${ssrInterpolate(v.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center justify-between"><button class="flex h-9 w-9 items-center justify-center rounded-xl bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button>`);
      if (unref(calendarStore).viewType === "day") {
        _push(`<div class="flex gap-1"><!--[-->`);
        ssrRenderList(unref(weekDays), (day) => {
          _push(`<button class="${ssrRenderClass([day.date === unref(calendarStore).currentDate ? "bg-sber-green text-white" : day.isToday ? "bg-sber-green-light text-sber-green" : "text-sber-gray", "flex h-12 w-10 flex-col items-center justify-center gap-0.5 rounded-xl transition-all"])}"><span class="text-[10px] font-medium">${ssrInterpolate(day.dayName)}</span><span class="text-sm font-bold">${ssrInterpolate(day.dayNum)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="px-2 text-center text-lg font-bold text-sber-black">${ssrInterpolate(unref(calendarStore).displayLabel)}</div>`);
      }
      _push(`<button class="flex h-9 w-9 items-center justify-center rounded-xl bg-sber-gray-light">`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-5 w-5 text-sber-black" }, null, _parent));
      _push(`</button></div></div><div class="flex-1 min-h-0 overflow-y-auto">`);
      if (unref(calendarStore).viewType === "day") {
        _push(`<div class="relative">`);
        if (unref(dayUntimedTasks).length) {
          _push(`<div class="border-b border-sber-gray-light bg-white px-3 py-2"><div class="flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(unref(dayUntimedTasks), (task) => {
            _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "flex max-w-full items-center gap-1.5 rounded-xl border px-2 py-1 text-xs"])}" style="${ssrRenderStyle({
              backgroundColor: getPriorityColor(task.priority) + "18",
              borderColor: getPriorityColor(task.priority) + "40"
            })}" draggable="true"><button type="button" class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-2 w-2 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><span class="truncate font-medium text-sber-black">${ssrInterpolate(task.title)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"><div class="w-14 text-xs text-sber-gray text-right pr-3">00–06</div><div class="flex-1 h-px bg-sber-gray-mid"></div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(calendarStore).collapsedEarlyHours ? unref(ChevronDown) : unref(ChevronUp)), { class: "w-4 h-4 text-sber-gray ml-2" }, null), _parent);
        _push(`</div>`);
        if (!unref(calendarStore).collapsedEarlyHours) {
          _push(`<div class="relative"><!--[-->`);
          ssrRenderList(earlyHours, (h) => {
            _push(`<div class="flex min-h-[50px]"><div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div><div class="flex-1 cursor-pointer border-t border-sber-gray-light"></div></div>`);
          });
          _push(`<!--]--><div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14"><!--[-->`);
          ssrRenderList(unref(earlyTimelineTasks), (task) => {
            _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "pointer-events-auto absolute left-1 right-1 cursor-grab touch-none select-none overflow-hidden rounded-xl px-2 py-1"])}" style="${ssrRenderStyle({
              top: `${task.topPx}px`,
              height: `${task.heightPx}px`,
              zIndex: unref(dragPreview)?.taskId === task.id ? 35 : 1,
              backgroundColor: getPriorityColor(task.priority) + "20",
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`
            })}"><div class="flex items-start gap-1"><button type="button" class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-2 w-2 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><div class="min-w-0 flex-1"><p class="truncate text-xs font-medium text-sber-black">${ssrInterpolate(task.title)}</p>`);
            if (task.continuesAfter) {
              _push(`<p class="text-[10px] text-sber-gray">продолжается ↓</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
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
          _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "pointer-events-auto absolute cursor-grab touch-none select-none overflow-hidden rounded-xl px-3 py-2 transition-opacity active:opacity-70"])}" style="${ssrRenderStyle({
            ...dayTimelineTaskHorizontalStyle(task.layoutCols, task.layoutCol),
            top: `${task.topPx}px`,
            height: `${task.heightPx}px`,
            zIndex: unref(dragPreview)?.taskId === task.id ? 35 : 1,
            backgroundColor: getPriorityColor(task.priority) + "20",
            borderLeft: `3px solid ${getPriorityColor(task.priority)}`
          })}">`);
          if (!task.isContinuation) {
            _push(`<button type="button" class="absolute left-1/2 top-0 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-start justify-center pt-1" aria-label="Изменить начало"><span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50"></span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (task.isContinuation) {
            _push(`<div class="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-xl opacity-60" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) })}"></div>`);
          } else {
            _push(`<!---->`);
          }
          if (!task.isContinuation) {
            _push(`<div class="pointer-events-none relative z-10 flex items-start gap-1"><button type="button" class="pointer-events-auto mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-2 w-2 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><div class="min-w-0 flex-1"><p class="text-xs font-semibold" style="${ssrRenderStyle({ color: getPriorityColor(task.priority) })}">${ssrInterpolate(task.labelTime)}</p><p class="truncate text-xs font-medium text-sber-black">${ssrInterpolate(task.title)}</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button type="button" class="absolute bottom-0 left-1/2 z-40 flex h-8 w-full max-w-[5.5rem] -translate-x-1/2 cursor-ns-resize items-end justify-center pb-1" aria-label="Изменить конец"><span class="pointer-events-none h-2 w-10 shrink-0 rounded-full bg-sber-gray/50"></span></button></div>`);
        });
        _push(`<!--]--></div></div><div class="flex items-center cursor-pointer px-3 py-2 bg-sber-gray-light"><div class="w-14 text-xs text-sber-gray text-right pr-3">22–00</div><div class="flex-1 h-px bg-sber-gray-mid"></div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(calendarStore).collapsedLateHours ? unref(ChevronDown) : unref(ChevronUp)), { class: "w-4 h-4 text-sber-gray ml-2" }, null), _parent);
        _push(`</div>`);
        if (!unref(calendarStore).collapsedLateHours) {
          _push(`<div class="relative"><!--[-->`);
          ssrRenderList(lateHours, (h) => {
            _push(`<div class="flex min-h-[50px]"><div class="w-14 flex-shrink-0 text-xs text-sber-gray text-right pr-3 pt-1">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div><div class="flex-1 cursor-pointer border-t border-sber-gray-light px-1"></div></div>`);
          });
          _push(`<!--]--><div class="border-t border-sber-gray-light"></div><div class="pointer-events-none absolute top-0 right-0 bottom-0 left-14"><!--[-->`);
          ssrRenderList(unref(lateTimelineTasks), (task) => {
            _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "pointer-events-auto absolute left-1 right-1 cursor-grab touch-none select-none overflow-hidden rounded-xl px-2 py-1"])}" style="${ssrRenderStyle({
              top: `${task.topPx}px`,
              height: `${task.heightPx}px`,
              zIndex: unref(dragPreview)?.taskId === task.id ? 35 : 1,
              backgroundColor: getPriorityColor(task.priority) + "20",
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`
            })}"><div class="flex items-start gap-1"><button type="button" class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-2 w-2 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><div class="min-w-0 flex-1"><p class="truncate text-xs font-semibold" style="${ssrRenderStyle({ color: getPriorityColor(task.priority) })}">${ssrInterpolate(formatTaskScheduleLabel(task))}</p><p class="truncate text-xs font-medium text-sber-black">${ssrInterpolate(task.title)}</p></div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(calendarStore).viewType === "week") {
        _push(`<div class="p-2"><div class="mb-1 flex gap-1"><div class="w-14 flex-shrink-0"></div><!--[-->`);
        ssrRenderList(unref(weekViewDays), (day) => {
          _push(`<div class="flex-1 cursor-pointer text-center"><p class="text-[10px] text-sber-gray">${ssrInterpolate(day.dayName)}</p><div class="${ssrRenderClass([day.isToday ? "bg-sber-green text-white" : "text-sber-black", "mx-auto flex h-8 w-8 items-center justify-center rounded-full"])}"><span class="text-sm font-bold">${ssrInterpolate(day.dayNum)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="mb-1 flex gap-1"><div class="w-14 flex-shrink-0"></div><!--[-->`);
        ssrRenderList(unref(weekViewDays), (day) => {
          _push(`<div class="flex min-h-[28px] flex-1 flex-wrap gap-0.5 border-b border-[#c8cfdb] px-0.5 py-0.5"><!--[-->`);
          ssrRenderList(getUntimedTasksForDate(day.date), (task) => {
            _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "flex max-w-full items-center gap-0.5 truncate rounded border px-1 py-0.5 text-[8px]"])}" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "22" })}" draggable="true"><button type="button" class="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-1.5 w-1.5 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><span class="truncate">${ssrInterpolate(task.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div><div class="overflow-hidden rounded-2xl border border-[#c8cfdb] bg-white/45"><div class="flex"><div class="w-14 flex-shrink-0"><!--[-->`);
        ssrRenderList(weekHours, (h) => {
          _push(`<div class="h-[48px] border-t border-[#c8cfdb] pr-2 pt-1 text-right text-xs text-sber-gray first:border-t-0">${ssrInterpolate(String(h).padStart(2, "0"))}:00 </div>`);
        });
        _push(`<!--]--></div><!--[-->`);
        ssrRenderList(unref(weekViewDays), (day) => {
          _push(`<div class="relative flex-1 border-l border-[#c8cfdb]"><!--[-->`);
          ssrRenderList(weekHours, (h) => {
            _push(`<div class="h-[48px] cursor-pointer border-t border-[#c8cfdb] first:border-t-0"></div>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(getWeekDayTimelineTasks(day.date), (task) => {
            _push(`<div class="${ssrRenderClass([task.completed ? "opacity-45" : "", "absolute left-0.5 right-0.5 cursor-move overflow-hidden rounded border border-[#c8cfdb] px-1 py-0.5"])}" style="${ssrRenderStyle({
              top: `${task.topPx}px`,
              height: `${task.heightPx}px`,
              backgroundColor: getPriorityColor(task.priority) + "22"
            })}" draggable="true"><div class="flex items-start gap-0.5"><button type="button" class="mt-px flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-1.5 w-1.5 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><div class="min-w-0 flex-1"><p class="truncate text-[9px] font-semibold text-sber-black">${ssrInterpolate(formatTaskScheduleLabel(task))}</p><p class="truncate text-[9px] font-medium text-sber-black">${ssrInterpolate(task.title)}</p></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else if (unref(calendarStore).viewType === "month") {
        _push(`<div class="p-2"><div class="mb-1 grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], (d) => {
          _push(`<div class="py-1 text-center text-[10px] font-semibold text-sber-gray">${ssrInterpolate(d)}</div>`);
        });
        _push(`<!--]--></div><div class="grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(unref(monthCells), (cell) => {
          _push(`<div class="${ssrRenderClass([[
            !cell.isCurrentMonth ? "opacity-35" : "",
            cell.date === unref(calendarStore).currentDate ? "bg-sber-green-light/70" : cell.isToday ? "bg-sber-green-light/40" : "bg-white/40 hover:bg-sber-gray-light"
          ], "relative aspect-square overflow-hidden rounded-xl border border-[#c8cfdb] p-1 transition-colors"])}"><div class="flex items-center justify-between"><span data-month-day class="${ssrRenderClass([cell.isToday ? "bg-sber-green text-white" : "text-sber-black", "inline-flex h-5 min-w-[1.25rem] cursor-pointer items-center justify-center rounded-full px-1 text-[10px] font-bold"])}">${ssrInterpolate(cell.day)}</span></div><div class="mt-1 space-y-0.5"><!--[-->`);
          ssrRenderList(getMonthCellTasks(cell.date), (task) => {
            _push(`<div data-month-task class="${ssrRenderClass([task.completed ? "opacity-45" : "", "flex items-center gap-0.5 truncate rounded border border-[#c8cfdb] px-1 py-0.5 text-[9px] font-medium text-sber-black"])}" style="${ssrRenderStyle({ backgroundColor: getPriorityColor(task.priority) + "20" })}" draggable="true"><button type="button" class="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded border" style="${ssrRenderStyle({ borderColor: getPriorityColor(task.priority), backgroundColor: task.completed ? getPriorityColor(task.priority) : "transparent" })}">`);
            if (task.completed) {
              _push(ssrRenderComponent(unref(Check), { class: "h-1.5 w-1.5 text-white" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</button><span class="truncate">${ssrInterpolate(task.title)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(calendarStore).viewType === "year") {
        _push(`<div class="p-2"><div class="grid grid-cols-3 gap-3"><!--[-->`);
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
          onSaved: refreshCalendarTasks
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
export {
  _sfc_main as default
};
//# sourceMappingURL=calendar-DqERtExy.js.map
