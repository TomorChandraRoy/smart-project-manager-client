import {ResponsiveContainer, BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell,Legend} from "recharts";

const COLORS_PRIORITY = ["#EF4444", "#F59E0B", "#10B981"];
const COLORS_STATUS = ["#6B7280", "#8B5CF6", "#10B981"];

const DashboardCharts = ({ priorityData, statusData, projectsSummary, workload }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm mb-4">Tasks by Priority</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip cursor={{ fill: "#F3F4F6", opacity: 0.4 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {priorityData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_PRIORITY[index % COLORS_PRIORITY.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm mb-4">Task Status Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {statusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm mb-4">Project Progress Comparison (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectsSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: "#F3F4F6", opacity: 0.4 }} />
              <Bar dataKey="completionPercentage" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Progress (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm mb-4">Team Productivity (Tasks Done vs Pending)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip cursor={{ fill: "#F3F4F6", opacity: 0.4 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed Tasks" />
              <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending Tasks" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
