import { Link } from "react-router-dom";
import { TrendingUp, Folder, Calendar, ArrowRight } from "lucide-react";

const ProjectSummary = ({ projectsSummary, isAdminOrManager }) => {

  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" /> Project Summary & Progress
        </h2>
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {projectsSummary?.length} Active Projects
        </span>
      </div>
      {projectsSummary?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl space-y-3">
          <Folder size={40} className="mx-auto text-gray-300" />
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">No projects found in database</p>
          {isAdminOrManager && (
            <Link to="/create-project" className="text-sm text-blue-600 font-semibold hover:underline">
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsSummary?.map((project) => {
            const isOverdue = project.daysRemaining < 0;
            const isToday = project.daysRemaining === 0;
            let deadlineColor = "bg-green-50 text-green-700 border-green-200/50";
            let deadlineMsg = `Deadline in ${project.daysRemaining} days`;
            if (isOverdue) {
              deadlineColor = "bg-red-50 text-red-700 border-red-200/50";
              deadlineMsg = `Deadline passed (${Math.abs(project.daysRemaining)} days ago)`;
            } else if (isToday) {
              deadlineColor = "bg-amber-50 text-amber-700 border-amber-200/50";
              deadlineMsg = "Deadline today";
            } else if (project.daysRemaining === 1) {
              deadlineColor = "bg-amber-50 text-amber-700 border-amber-200/50";
              deadlineMsg = "Deadline in 1 day";
            }
            return (
              <div key={project._id} className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 hover:border-gray-200 dark:hover:border-slate-600 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-base line-clamp-1">{project.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      project.status === "Completed" ? "bg-green-50 text-green-700 border dark:border-slate-700 border-green-100" :
                      project.status === "On Hold" ? "bg-amber-50 text-amber-700 border dark:border-slate-700 border-amber-100" :
                      "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-slate-700 border-blue-100"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center">
                    <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {project.pendingTasks} tasks pending
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span className="text-gray-800 dark:text-slate-100">{project.completionPercentage}% completed</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${project.completionPercentage === 100 ? "bg-green-500" : "bg-blue-600"}`}
                      style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-3 border-t dark:border-slate-700 border-gray-50 flex items-center justify-between text-xs gap-2">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold border dark:border-slate-700 ${deadlineColor}`}>
                    <Calendar size={13} />
                    {deadlineMsg}
                  </span>
                  {isAdminOrManager && (
                    <Link to="/create-project" className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition-colors">
                      <span>Manage</span>
                      <ArrowRight size={13} className="translate-y-[0.5px]" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectSummary;
