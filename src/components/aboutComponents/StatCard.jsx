const StatCard = ({ value, label, gradient }) => {
  return (
    <div className="text-center">
      <h3
        className={`text-4xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {value}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mt-2">{label}</p>
    </div>
  );
};

export default StatCard;
