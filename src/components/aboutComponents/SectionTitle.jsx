const SectionTitle =({ subtitle, title, highlight }) => {
  return (
    <div className="text-center mb-16">
      {subtitle && (
        <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
          {subtitle}
        </span>
      )}

      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
        {title}{" "}
        {highlight && (
          <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
    </div>
  );
}
export default SectionTitle;