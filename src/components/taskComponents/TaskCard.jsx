import { Calendar, Paperclip, MessageSquare } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
import { PRIORITY_STYLE } from "./taskConstants";

const TaskCard = ({ task, onStatusUpdate, onOpenComments, onOpenFiles }) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const isOverdue = dueDate < now && task.status !== "Completed";
  const days = Math.ceil((dueDate - now) / (1000 * 3600 * 24));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Left: Task Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm">
              {task.title}
            </h3>
            {isOverdue && (
              <span className="text-[10px] font-bold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-gray-800 dark:text-white line-clamp-1">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLE[task.priority]}`}
            >
              {task.priority}
            </span>
            {task.project?.name && (
              <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-white border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                📁 {task.project.name}
              </span>
            )}
            <span
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                isOverdue
                  ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                  : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700"
              }`}
            >
              <Calendar size={10} />
              {task.status === "Completed"
                ? "✓ Done"
                : isOverdue
                  ? `${Math.abs(days)}d overdue`
                  : days === 0
                    ? "Due today"
                    : `${days}d left`}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Update */}
          <StatusDropdown task={task} onStatusUpdate={onStatusUpdate} />

          {/* File Attachment Button */}
          <button
            onClick={() => onOpenFiles(task)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-md text-xs font-semibold transition cursor-pointer"
          >
            <Paperclip size={13} />
            {task.attachments?.length > 0
              ? `${task.attachments.length} File${task.attachments.length > 1 ? "s" : ""}`
              : "Attach"}
          </button>

          {/* Comment Button */}
          <button
            onClick={() => onOpenComments(task)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md text-xs font-semibold transition cursor-pointer"
          >
            <MessageSquare size={13} />
            {task.comments?.length > 0
              ? `${task.comments.length} Comment${task.comments.length > 1 ? "s" : ""}`
              : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
