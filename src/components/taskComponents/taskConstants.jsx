import { Clock, Loader2, CheckCircle2 } from "lucide-react";

export const PRIORITY_STYLE = {
  High: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  Medium: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
  Low: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50",
};

export const STATUS_STYLE = {
  Todo: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700",
  "In Progress": "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
  Completed: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50",
};

export const STATUS_ICON = {
  Todo: <Clock size={13} className="text-gray-600 dark:text-white" />,
  "In Progress": <Loader2 size={13} className="text-blue-500 dark:text-blue-400 animate-spin" />,
  Completed: <CheckCircle2 size={13} className="text-green-500 dark:text-green-400" />,
};

// Avatar initials helper
export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// Time ago helper
export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};
