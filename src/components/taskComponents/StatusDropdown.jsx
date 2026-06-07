import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { STATUS_STYLE, STATUS_ICON } from "./taskConstants";

const StatusDropdown = ({ task, onStatusUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = ["Todo", "In Progress", "Completed"];

  const handleChange = async (newStatus) => {
    if (newStatus === task.status) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      await api.patch(`/update-task-status/${task._id}`, { status: newStatus });
      onStatusUpdate(task._id, newStatus);
    } catch {
      alert("Failed to update status.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border transition hover:shadow-sm cursor-pointer ${STATUS_STYLE[task.status]}`}
      >
        {loading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          STATUS_ICON[task.status]
        )}
        {task.status}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-10 py-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleChange(s)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                s === task.status
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
              }`}
            >
              {STATUS_ICON[s]} {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
