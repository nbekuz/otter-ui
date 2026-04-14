import { d as defineStore, b as useLocalStorage, m as mockTasks } from "../server.mjs";
import dayjs from "dayjs";
import { computed } from "vue";
const useTasksStore = defineStore("tasks", () => {
  const tasks = useLocalStorage(
    "otter.tasks",
    mockTasks.map((task) => ({
      ...task,
      duration: task.duration ? { ...task.duration } : void 0
    }))
  );
  const today = computed(() => dayjs().format("YYYY-MM-DD"));
  const tomorrow = computed(() => dayjs().add(1, "day").format("YYYY-MM-DD"));
  const overdueTasks = computed(
    () => tasks.value.filter(
      (t) => !t.completed && t.dueDate && dayjs(t.dueDate).isBefore(today.value, "day")
    )
  );
  const todayTasks = computed(
    () => tasks.value.filter(
      (t) => !t.completed && t.dueDate === today.value
    )
  );
  const tomorrowTasks = computed(
    () => tasks.value.filter(
      (t) => !t.completed && t.dueDate === tomorrow.value
    )
  );
  const laterTasks = computed(
    () => tasks.value.filter(
      (t) => !t.completed && t.dueDate && dayjs(t.dueDate).isAfter(tomorrow.value, "day")
    )
  );
  const noDateTasks = computed(
    () => tasks.value.filter((t) => !t.completed && !t.dueDate)
  );
  const completedTasks = computed(
    () => tasks.value.filter((t) => t.completed)
  );
  function getTasksForDate(date) {
    return tasks.value.filter((t) => t.dueDate === date);
  }
  function getTasksForWeek(startDate, endDate) {
    return tasks.value.filter(
      (t) => t.dueDate && !dayjs(t.dueDate).isBefore(startDate, "day") && !dayjs(t.dueDate).isAfter(endDate, "day")
    );
  }
  function getTasksForMatrix(blockId) {
    return tasks.value.filter((t) => !t.completed && t.matrixBlock === blockId);
  }
  function addTask(taskData) {
    const newTask = {
      id: `t${Date.now()}`,
      title: taskData.title || "",
      description: taskData.description,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      duration: taskData.duration,
      priority: taskData.priority || "none",
      completed: false,
      repeat: taskData.repeat || "none",
      notification: taskData.notification,
      imageUrl: taskData.imageUrl,
      listId: taskData.listId,
      matrixBlock: taskData.matrixBlock || "not-urgent-not-important",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    tasks.value.unshift(newTask);
    return newTask;
  }
  function updateTask(id, updates) {
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updates };
    }
  }
  function deleteTask(id) {
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks.value.splice(idx, 1);
    }
  }
  function completeTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? dayjs().format("YYYY-MM-DD") : void 0;
    }
  }
  function moveToMatrix(taskId, blockId) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.matrixBlock = blockId;
    }
  }
  function searchTasks(query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tasks.value.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    );
  }
  return {
    tasks,
    overdueTasks,
    todayTasks,
    tomorrowTasks,
    laterTasks,
    noDateTasks,
    completedTasks,
    getTasksForDate,
    getTasksForWeek,
    getTasksForMatrix,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveToMatrix,
    searchTasks
  };
});
export {
  useTasksStore as u
};
//# sourceMappingURL=tasks-BcYdj5cJ.js.map
