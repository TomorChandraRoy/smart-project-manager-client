import SectionTitle from "../../components/aboutComponents/SectionTitle";
import StatCard from "../../components/aboutComponents/StatCard";
import ValueCard from "../../components/aboutComponents/ValueCard";


const About = () => {
  const stats = [
    {
      value: "500+",
      label: "Projects Managed",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      value: "100+",
      label: "Active Teams",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      value: "99%",
      label: "Client Satisfaction",
      gradient: "from-green-400 to-cyan-400",
    },
    {
      value: "24/7",
      label: "Support",
      gradient: "from-orange-400 to-red-500",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description: "Building smarter solutions for modern teams.",
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Collaboration",
      description: "Encouraging teamwork and transparency.",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Reliability",
      description: "Delivering dependable and secure solutions.",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Customer Success",
      description: "Helping teams achieve outstanding results.",
      color: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* HERO */}
      <div className="text-center py-24 px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white">
          About{" "}
          <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Smart Project Manager
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mt-6 text-lg md:text-2xl max-w-3xl mx-auto">
          Building smarter teams and successful projects through innovation,
          collaboration, and intelligent project management.
        </p>
      </div>

      {/* WHO WE ARE */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-20">
        <div>
          <SectionTitle
            subtitle="Who We Are"
            title="Empowering Teams to"
            highlight="Deliver Success"
          />

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Smart Project Manager is a modern project management platform
            designed to simplify workflows and improve productivity.
          </p>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We help teams plan, collaborate, and deliver projects efficiently
            with real-time tracking and insights.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-none">
          {stats.map((item, i) => (
            <StatCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* MISSION & VISION */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 py-20">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <h3 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400">
            To streamline workflows and improve team productivity through smart
            tools.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-none">
          <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            Our Vision
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            To make project management simple, intelligent, and global.
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <SectionTitle title="Our Core" highlight="Values" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <ValueCard key={i} {...v} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 shadow-sm dark:shadow-none">
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Ready to Manage Projects{" "}
            <span className="text-cyan-600 dark:text-cyan-400">Smarter?</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Join teams using Smart Project Manager to boost productivity and
            collaboration.
          </p>

          <button className="px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition shadow-md">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};
export default About;
