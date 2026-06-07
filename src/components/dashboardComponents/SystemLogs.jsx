import { Activity } from "lucide-react";

const SystemLogs = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
      <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Activity size={18} className="text-gray-500 dark:text-slate-400" /> Recent System Logs
      </h3>
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {activities?.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">No system logs recorded yet</div>
        ) : (
          activities?.map((act, index) => (
            <div key={index} className="border-b dark:border-slate-700 border-gray-50 pb-3 last:border-b-0 last:pb-0">
              <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 leading-normal">{act.action}</p>
              <div className="flex justify-between items-center mt-1 text-[10px]  dark:text-blue-400">
                <span className="capitalize font-medium">{act.userRole || "User"}</span>
                <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemLogs;
