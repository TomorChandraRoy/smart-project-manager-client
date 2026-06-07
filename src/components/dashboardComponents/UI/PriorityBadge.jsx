

const PriorityBadge = ({ priority }) => {
  const map = {
    High: "bg-red-50 text-red-700 border dark:border-slate-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border dark:border-slate-700 border-amber-200",
    Low: "bg-green-50 text-green-700 border dark:border-slate-700 border-green-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${map[priority] || "bg-gray-100 text-gray-500 dark:text-slate-400 dark:text-slate-400"}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
