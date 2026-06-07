import SectionTitle from "../../components/aboutComponents/SectionTitle";
import FeatureCard from "../../components/featureComponents/FeatureCard";

const Features = () => {
  const coreFeatures = [
    {
      title: "Task Management",
      description: "Organize, assign, and track tasks with ease. Keep everyone on the same page and ensure deadlines are met.",
      icon: "📋",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Real-Time Collaboration",
      description: "Work together seamlessly. Share updates, files, and feedback instantly with your entire team.",
      icon: "🤝",
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Advanced Analytics",
      description: "Gain valuable insights into team performance and project health with customizable visual reports.",
      icon: "📊",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Role-Based Access",
      description: "Ensure security and clarity by assigning specific roles like Admin, Project Manager, or Team Member.",
      icon: "🔐",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Automated Workflows",
      description: "Save time by automating repetitive tasks and streamlining your team's day-to-day operations.",
      icon: "⚙️",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Secure Cloud Storage",
      description: "Keep all your project files and assets safely stored and accessible from anywhere at any time.",
      icon: "☁️",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
      {/* HERO */}
      <div className="text-center py-24 px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white">
          Powerful Features for{" "}
          <span className="bg-linear-to-r from-blue-500 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Modern Teams
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mt-6 text-lg md:text-2xl max-w-3xl mx-auto">
          Everything you need to plan, execute, and deliver projects successfully, all in one intuitive platform.
        </p>
      </div>

      {/* CORE FEATURES GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <SectionTitle 
          subtitle="Platform Capabilities" 
          title="Everything you need to" 
          highlight="work smarter" 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {coreFeatures.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 shadow-sm dark:shadow-none relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white relative z-10">
            Experience these features {" "}
            <span className="text-blue-600 dark:text-blue-400">in action</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8 relative z-10 max-w-2xl mx-auto">
            Stop juggling multiple tools. Bring your team, tasks, and goals together in Smart Project Manager today.
          </p>

          <button className="relative z-10 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition shadow-md hover:shadow-lg">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
