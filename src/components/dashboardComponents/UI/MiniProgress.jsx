

const MiniProgress = ({ percent }) => {
  const color =
    percent === 100 ? "bg-green-500" : percent > 50 ? "bg-blue-500" : "bg-amber-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400">{percent}%</span>
    </div>
  );
};

export default MiniProgress;
