import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import ProjectsTab from "../../components/projectManagerComponents/ProjectsTab";
import TasksTab from "../../components/projectManagerComponents/TasksTab";
import MembersTab from "../../components/projectManagerComponents/MembersTab";
import WorkloadTab from "../../components/projectManagerComponents/WorkloadTab";


// MAIN COMPONENT

const ProjectManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isManager = user?.role?.toLowerCase() === "project manager";
  const isAdminOrManager = isAdmin || isManager;

  // shared data
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]); // all users
  const [fetchingProjects, setFetchingProjects] = useState(true);

  // Fetch on mount
  useEffect(() => {
    if (isAdminOrManager) {
      fetchProjects();
      fetchMembers();
    }
  }, [isAdminOrManager]);

  // API calls 
  const fetchProjects = async () => {
    try {
      setFetchingProjects(true);
      const res = await api.get("/getAllProjects?limit=200");
      setProjects(res.data.projects || res.data);
    } catch {
      swal("Error", "Failed to load projects.", "error");
    } finally {
      setFetchingProjects(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get("/getAllUserData?limit=200");
      setMembers(res.data.users || res.data);
    } catch {
      /* silent */
    }
  };

  // TABS
  const tabs = [
    { id: "projects", label: "📁 Projects" },
    { id: "tasks", label: "✅ Tasks" },
    { id: "members", label: "👥 Members" },
    { id: "workload", label: "📊 Workload" },
  ];

  if (!isAdminOrManager) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-800/50 p-4">
        <div className="text-center max-w-sm bg-white dark:bg-slate-900 p-8 rounded-2xl border dark:border-slate-700 border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">
            You do not have permission to view this page.
          </p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Project Manager Dashboard</h1>
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border dark:border-slate-700 border-blue-200">
            Role: {user?.role}
          </span>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm p-1 w-fit overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      {/* TAB CONTENT */}
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            fetchProjects={fetchProjects}
            fetchingProjects={fetchingProjects}
          />
        )}

        {activeTab === "tasks" && (
          <TasksTab projects={projects} members={members} user={user} />
        )}

        {activeTab === "members" && (
          <MembersTab projects={projects} setProjects={setProjects} members={members} />
        )}

        {activeTab === "workload" && <WorkloadTab />}
      </div>
    </div>
  );
};

export default ProjectManager;
