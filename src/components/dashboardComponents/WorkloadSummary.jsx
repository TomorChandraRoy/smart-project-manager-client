import { Users } from "lucide-react";

const WorkloadSummary = ({ workload }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
      <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <Users size={20} className="text-purple-500" /> Team Workload Summary
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="whitespace-nowrap border-b dark:border-slate-700 border-gray-100 text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="pb-3 pl-4 font-medium">Team Member</th>
              <th className="pb-3 text-center font-medium">Total Tasks</th>
              <th className="pb-3 text-center font-medium">Completed</th>
              <th className="pb-3 text-center font-medium">Pending</th>
              <th className="pb-3 pr-4 text-right font-medium">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800 text-sm text-gray-700 dark:text-slate-200">
            {workload?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-slate-400">No team members or workloads recorded.</td>
              </tr>
            ) : (
              workload?.map((member, idx) => {
                const pct = member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0;
                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 pl-4 font-semibold text-gray-800 dark:text-slate-100">{member.name}</td>
                    <td className="py-3.5 text-center text-gray-600 dark:text-slate-300">{member.total}</td>
                    <td className="py-3.5 text-center text-green-600 font-medium">{member.completed}</td>
                    <td className="py-3.5 text-center text-amber-600 font-medium">{member.pending}</td>
                    <td className="py-3.5 pr-4 text-right font-semibold">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        pct === 100 ? "bg-green-50 text-green-700" :
                        pct > 50 ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                        member.total > 0 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500 dark:text-slate-400"
                      }`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkloadSummary;
