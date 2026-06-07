import { AlertCircle } from "lucide-react";

const HighPriorityTasks = ({ highPriorityTasks }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" /> High Priority Tasks
        </h3>
        <span className="text-xs font-semibold  dark:text-slate-300 uppercase">Attention Required</span>
      </div>
      <div className="space-y-3">
        {highPriorityTasks?.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No high priority tasks pending</p>
        ) : (
          highPriorityTasks?.map((task) => (
            <div key={task._id} className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 border dark:border-slate-700 border-gray-100 rounded-xl transition">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Project: {task.project?.name || "—"} | Assigned to: {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700">High</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HighPriorityTasks;
