import { Folder, ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const DashboardWidgets = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">Total Projects</span>
          <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Folder size={18} /></span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{kpis.totalProjects}</h3>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">Total Tasks</span>
          <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><ClipboardList size={18} /></span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{kpis.totalTasks}</h3>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">Completed Tasks</span>
          <span className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={18} /></span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{kpis.completedTasks}</h3>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">Pending Tasks</span>
          <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock size={18} /></span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{kpis.pendingTasks}</h3>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 col-span-2 md:col-span-1">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">Overdue Tasks</span>
          <span className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={18} /></span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-extrabold text-red-600">{kpis.overdueTasks}</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
