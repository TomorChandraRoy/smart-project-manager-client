const ValueCard = ({ title, description, color }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition shadow-sm dark:shadow-none">
      <h3 className={`text-xl font-semibold mb-3 ${color}`}>{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export default ValueCard;
