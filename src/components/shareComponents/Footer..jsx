const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 pt-12 pb-6 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mx-auto max-w-330">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#" className="text-lg font-bold text-slate-900 dark:text-white">Smart Project Manager</a>
          <p className="text-sm/7 mt-6 text-slate-600 dark:text-slate-400">
            Smart Project Manager helps teams streamline workflows, improve
            collaboration, and achieve goals faster with AI-powered project
            management tools.
          </p>
        </div>
        <div className="flex flex-col lg:items-center lg:justify-start">
          <div className="flex flex-col text-sm space-y-3">
            <h2 className="font-semibold mb-3 text-slate-900 dark:text-white uppercase tracking-wider text-xs">Company</h2>
            <a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" href="#">
              About us
            </a>
            <a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" href="#">
              Contact us
            </a>
            <a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" href="#">
              Privacy policy
            </a>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white mb-5 uppercase tracking-wider text-xs">
            Subscribe to our newsletter
          </h2>
          <div className="text-sm space-y-6 max-w-sm">
            <p className="text-slate-600 dark:text-slate-400">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <input
                className="focus:ring-2 bg-transparent ring-indigo-600 dark:ring-indigo-500 outline-none w-full max-w-64 py-2 rounded px-2 text-slate-900 dark:text-white placeholder-slate-400"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white rounded transition shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="py-6 text-center border-t mt-12 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500">
        Copyright 2025 © <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Smart Project Manager</a> All Right
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;
