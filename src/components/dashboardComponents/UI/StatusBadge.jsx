

const StatusBadge = ({ status }) => {
  const map = {
    Completed: "bg-green-50 text-green-700 border dark:border-slate-700 border-green-200",
    "In Progress": "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-slate-700 border-blue-200",
    Todo: "bg-gray-100 text-gray-600 dark:text-slate-300 border dark:border-slate-700 border-gray-200",
    Active: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-slate-700 border-blue-200",
    "On Hold": "bg-amber-50 text-amber-700 border dark:border-slate-700 border-amber-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${map[status] || "bg-gray-100 text-gray-500 dark:text-slate-400"}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
