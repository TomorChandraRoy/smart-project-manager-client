import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { LayoutDashboard, AlertCircle, Zap, ArrowRight, Plus } from "lucide-react";

import AdminControlPanel from "../../components/dashboardComponents/AdminControlPanel";
import DashboardWidgets from "../../components/dashboardComponents/DashboardWidgets";
import SearchFilterHub from "../../components/dashboardComponents/SearchFilterHub";
import DashboardCharts from "../../components/dashboardComponents/DashboardCharts";
import UpcomingDeadlines from "../../components/dashboardComponents/UpcomingDeadlines";
import HighPriorityTasks from "../../components/dashboardComponents/HighPriorityTasks";
import ProjectSummary from "../../components/dashboardComponents/ProjectSummary";
import WorkloadSummary from "../../components/dashboardComponents/WorkloadSummary";
import SystemLogs from "../../components/dashboardComponents/SystemLogs";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isManager = user?.role?.toLowerCase() === "project manager";
  const isAdminOrManager = isAdmin || isManager;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboardStats");
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      setError("Failed to load dashboard insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/getAllUserData?limit=200");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await api.get("/getAllProjects?limit=200");
      setAllProjects(res.data.projects || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
      fetchAllProjects();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Access Guard 
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-800/50 p-4">
        <div className="text-center max-w-sm bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 shadow-sm p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">You do not have permission to view the Dashboard Insights.</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-lg mx-auto text-center space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">Error Loading Insights</h3>
        <p className="text-gray-600 dark:text-slate-300">{error}</p>
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {kpis,projectsSummary,workload,activities,priorityData,statusData,upcomingDeadlines,highPriorityTasks } = stats;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 dark:bg-slate-800/50 min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" /> Dashboard Insights
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-slate-100">{user?.name}</span>.{" "}
            Your Role: <span className="font-medium text-blue-600 capitalize">{user?.role}</span>
          </p>
        </div>
        {isAdminOrManager && (
          <Link
            to="/create-project"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-all hover:shadow font-medium text-sm"
          >
            <Plus size={16} /> Create New Project
          </Link>
        )}
      </div>

      {/* Admin User Role Management */}
      {isAdmin && (
        <AdminControlPanel users={users} user={user} setUsers={setUsers} setStats={setStats} />
      )}

      {/* KPI Cards Grid */}
      <DashboardWidgets kpis={kpis} />

      {/* Search & Filter Hub */}
      <SearchFilterHub allUsers={users} allProjects={allProjects} />

      {/* Charts / Analytics Section */}
      <DashboardCharts
        priorityData={priorityData}
        statusData={statusData}
        projectsSummary={projectsSummary}
        workload={workload}
      />

      {/* Deadlines and High Priority Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingDeadlines upcomingDeadlines={upcomingDeadlines} />
        <HighPriorityTasks highPriorityTasks={highPriorityTasks} />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProjectSummary projectsSummary={projectsSummary} isAdminOrManager={isAdminOrManager} />
          <WorkloadSummary workload={workload} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Navigation */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 p-6 rounded-2xl shadow-xs">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Quick Navigation
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/create-project"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-50/70 border dark:border-slate-700 border-transparent hover:border-blue-100 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                <span>📁 Project Manager Console</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <SystemLogs activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;