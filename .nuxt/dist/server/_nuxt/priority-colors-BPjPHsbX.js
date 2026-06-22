const PRIORITY_COLORS = {
  high: "#FF3B30",
  medium: "#FF9500",
  low: "#34C759",
  none: "#8E8E93"
};
function priorityColor(priority) {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.none;
}
export {
  priorityColor as p
};
//# sourceMappingURL=priority-colors-BPjPHsbX.js.map
