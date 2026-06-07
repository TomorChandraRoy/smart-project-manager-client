const FeatureCard = ({ title, description, icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition shadow-sm dark:shadow-none group">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-3xl ${color} bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
