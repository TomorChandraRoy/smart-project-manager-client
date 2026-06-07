import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import swal from "sweetalert";
import {Search,Filter,ArrowUpDown,X,ClipboardList,Folder, Users, Calendar} from "lucide-react";

import PriorityBadge from "./UI/PriorityBadge";
import StatusBadge from "./UI/StatusBadge";
import MiniProgress from "./UI/MiniProgress";
import Pagination from "./UI/Pagination";

// Debounce Hook 
function useDebounce(value, delay = 400) { 
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const SearchFilterHub = ({ allUsers, allProjects }) => {
  const [activeTab, setActiveTab] = useState("tasks");

  // Tasks State 
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilters, setTaskFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    deadlineStatus: "",
    projectId: "",
  });
  const [taskSort, setTaskSort] = useState("latest");
  const [taskPage, setTaskPage] = useState(1);
  const [taskData, setTaskData] = useState({ tasks: [], total: 0, pages: 1 });
  const [taskLoading, setTaskLoading] = useState(false);
  const debouncedTaskSearch = useDebounce(taskSearch);

  //Projects State 
  const [projSearch, setProjSearch] = useState("");
  const [projStatus, setProjStatus] = useState("");
  const [projSort, setProjSort] = useState("latest");
  const [projPage, setProjPage] = useState(1);
  const [projData, setProjData] = useState({
    projects: [],
    total: 0,
    pages: 1,
  });
  const [projLoading, setProjLoading] = useState(false);
  const debouncedProjSearch = useDebounce(projSearch);

  //Members State
  const [memberSearch, setMemberSearch] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberPage, setMemberPage] = useState(1);
  const [memberData, setMemberData] = useState({
    users: [],
    total: 0,
    pages: 1,
  });
  const [memberLoading, setMemberLoading] = useState(false);
  const debouncedMemberSearch = useDebounce(memberSearch);

  const LIMIT = 8;

  //Fetch Tasks 
  const fetchTasks = useCallback(async () => {
    setTaskLoading(true);
    try {
      const params = new URLSearchParams({
        page: taskPage,
        limit: LIMIT,
        sortBy: taskSort,
      });
      if (debouncedTaskSearch) params.set("search", debouncedTaskSearch);
      if (taskFilters.status) params.set("status", taskFilters.status);
      if (taskFilters.priority) params.set("priority", taskFilters.priority);
      if (taskFilters.assignedTo)
        params.set("assignedTo", taskFilters.assignedTo);
      if (taskFilters.deadlineStatus)
        params.set("deadlineStatus", taskFilters.deadlineStatus);
      if (taskFilters.projectId) params.set("project", taskFilters.projectId);
      const res = await api.get(`/get-tasks?${params}`);
      setTaskData(res.data);
    } catch {
      setTaskData({ tasks: [], total: 0, pages: 1 });
    } finally {
      setTaskLoading(false);
    }
  }, [taskPage, taskSort, debouncedTaskSearch, taskFilters]);

  //Fetch Projects
  const fetchProjects = useCallback(async () => {
    setProjLoading(true);
    try {
      const params = new URLSearchParams({
        page: projPage,
        limit: LIMIT,
        sortBy: projSort,
      });
      if (debouncedProjSearch) params.set("search", debouncedProjSearch);
      if (projStatus) params.set("status", projStatus);
      const res = await api.get(`/getAllProjects?${params}`);
      setProjData(res.data);
    } catch {
      setProjData({ projects: [], total: 0, pages: 1 });
    } finally {
      setProjLoading(false);
    }
  }, [projPage, projSort, debouncedProjSearch, projStatus]);

  //Fetch Members 
  const fetchMembers = useCallback(async () => {
    setMemberLoading(true);
    try {
      const params = new URLSearchParams({ page: memberPage, limit: LIMIT });
      if (debouncedMemberSearch) params.set("search", debouncedMemberSearch);
      if (memberRole) params.set("role", memberRole);
      const res = await api.get(`/getAllUserData?${params}`);
      setMemberData(res.data);
    } catch {
      setMemberData({ users: [], total: 0, pages: 1 });
    } finally {
      setMemberLoading(false);
    }
  }, [memberPage, debouncedMemberSearch, memberRole]);

  useEffect(() => {
    if (activeTab === "tasks") fetchTasks();
  }, [activeTab, fetchTasks]);

  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
  }, [activeTab, fetchProjects]);

  useEffect(() => {
    if (activeTab === "members") fetchMembers();
  }, [activeTab, fetchMembers]);

  // Reset page on filter/search changes
  useEffect(() => {
    setTaskPage(1);
  }, [debouncedTaskSearch, taskFilters, taskSort]);
  useEffect(() => {
    setProjPage(1);
  }, [debouncedProjSearch, projStatus, projSort]);
  useEffect(() => {
    setMemberPage(1);
  }, [debouncedMemberSearch, memberRole]);

  //Quick Task Status Update 
  const handleQuickStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/get-single-task/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch {
      swal("Error", "Failed to update task status", "error");
    }
  };

  const hasTaskFilters =
    taskFilters.status ||
    taskFilters.priority ||
    taskFilters.assignedTo ||
    taskFilters.deadlineStatus ||
    taskFilters.projectId ||
    taskSearch;

  const clearTaskFilters = () => {
    setTaskFilters({
      status: "",
      priority: "",
      assignedTo: "",
      deadlineStatus: "",
      projectId: "",
    });
    setTaskSearch("");
    setTaskSort("latest");
    setTaskPage(1);
  };

  const tabs = [
    { id: "tasks", label: "Tasks", icon: ClipboardList, count: taskData.total },
    { id: "projects", label: "Projects", icon: Folder, count: projData.total },
    { id: "members", label: "Members", icon: Users, count: memberData.total },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 rounded-2xl shadow-xs overflow-hidden">
      {/* Hub Header */}
      <div className="px-6 pt-6 pb-0 border-b dark:border-slate-700 border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <Search size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-slate-100">
              Search & Filter Hub
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Search, filter and manage all data from one place
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {activeTab === tab.id && tab.count > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ══════════════════ TASKS TAB ══════════════════ */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {/* Search + Sort Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border dark:border-slate-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100"
                />
                {taskSearch && (
                  <button
                    onClick={() => setTaskSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown
                  size={14}
                  className="text-gray-400 dark:text-slate-400 shrink-0"
                />
                <select
                  value={taskSort}
                  onChange={(e) => setTaskSort(e.target.value)}
                  className="text-sm border dark:border-slate-700 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 transition"
                >
                  <option value="latest">Latest Created</option>
                  <option value="deadline">Nearest Deadline</option>
                  <option value="priority">Highest Priority</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1 text-xs font-semibold  dark:text-white uppercase tracking-wider">
                <Filter size={11} /> Filters:
              </div>
              <select
                value={taskFilters.status}
                onChange={(e) =>
                  setTaskFilters((f) => ({ ...f, status: e.target.value }))
                }
                className="text-xs border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Status</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={taskFilters.priority}
                onChange={(e) =>
                  setTaskFilters((f) => ({ ...f, priority: e.target.value }))
                }
                className="text-xs border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={taskFilters.assignedTo}
                onChange={(e) =>
                  setTaskFilters((f) => ({ ...f, assignedTo: e.target.value }))
                }
                className="text-xs border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Members</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <select
                value={taskFilters.projectId}
                onChange={(e) =>
                  setTaskFilters((f) => ({ ...f, projectId: e.target.value }))
                }
                className="text-xs border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Projects</option>
                {allProjects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={taskFilters.deadlineStatus}
                onChange={(e) =>
                  setTaskFilters((f) => ({
                    ...f,
                    deadlineStatus: e.target.value,
                  }))
                }
                className="text-xs border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Deadlines</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </select>
              {hasTaskFilters && (
                <button
                  onClick={clearTaskFilters}
                  className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-700 border dark:border-slate-700 border-red-100 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <X size={11} /> Clear All
                </button>
              )}
            </div>

            {/* Tasks Table */}
            {taskLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : taskData.tasks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl">
                <ClipboardList
                  size={36}
                  className="mx-auto text-gray-300 mb-2"
                />
                <p className="text-gray-400 text-sm font-medium">
                  No tasks found matching your criteria
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="whitespace-nowrap border-b dark:border-slate-700 border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-4 pr-4">Task</th>
                      <th className="pb-3 pr-4">Project</th>
                      <th className="pb-3 pr-4">Assigned To</th>
                      <th className="pb-3 pr-4">Priority</th>
                      <th className="pb-3 pr-4">Deadline</th>
                      <th className="pb-3 pr-4">Progress</th>
                      <th className="pb-3 pr-4 text-right">Quick Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {taskData.tasks.map((task) => {
                      const dueDate = new Date(task.dueDate);
                      const now = new Date();
                      const isOverdue =
                        dueDate < now && task.status !== "Completed";
                      const days = Math.ceil(
                        (dueDate - now) / (1000 * 3600 * 24),
                      );
                      const progressPct =
                        task.status === "Completed"
                          ? 100
                          : task.status === "In Progress"
                            ? 50
                            : 0;
                      return (
                        <tr
                          key={task._id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition group"
                        >
                          <td className="py-3 pl-4 pr-4">
                            <p className="font-semibold  dark:text-blue-500 line-clamp-1 text-[16px]">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[12px] text-black dark:text-white line-clamp-1 mt-0.5">
                                {task.description}
                              </p>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                              {task.project?.name || "—"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">
                              {task.assignedTo?.name || "Unassigned"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <PriorityBadge priority={task.priority} />
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`text-[11px] font-semibold ${isOverdue ? "text-red-600" : "text-gray-500 dark:text-slate-400"}`}
                            >
                              {task.status === "Completed"
                                ? "✓ Done"
                                : isOverdue
                                  ? `${Math.abs(days)}d overdue`
                                  : days === 0
                                    ? "Today"
                                    : `${days}d left`}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <MiniProgress percent={progressPct} />
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleQuickStatusUpdate(
                                  task._id,
                                  e.target.value,
                                )
                              }
                              className={`text-[11px] font-semibold border dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer transition ${
                                task.status === "Completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : task.status === "In Progress"
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200"
                                    : "bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-300 border-gray-200"
                              }`}
                            >
                              <option value="Todo">Todo</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Pagination
                  page={taskPage}
                  pages={taskData.pages}
                  total={taskData.total}
                  limit={LIMIT}
                  onPageChange={setTaskPage}
                />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ PROJECTS TAB ══════════════════ */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search projects by name..."
                  value={projSearch}
                  onChange={(e) => setProjSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border dark:border-slate-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100"
                />
                {projSearch && (
                  <button
                    onClick={() => setProjSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <select
                value={projStatus}
                onChange={(e) => setProjStatus(e.target.value)}
                className="text-sm border dark:border-slate-700 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex items-center gap-2">
                <ArrowUpDown
                  size={14}
                  className="text-gray-400 dark:text-slate-400 shrink-0"
                />
                <select
                  value={projSort}
                  onChange={(e) => setProjSort(e.target.value)}
                  className="text-sm border dark:border-slate-700 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                >
                  <option value="latest">Latest Created</option>
                  <option value="deadline">Nearest Deadline</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
            </div>

            {projLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : projData.projects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl">
                <Folder size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">
                  No projects found
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projData.projects.map((project) => {
                    const now = new Date();
                    const deadline = new Date(project.deadline);
                    const days = Math.ceil(
                      (deadline - now) / (1000 * 3600 * 24),
                    );
                    const isOverdue = days < 0;
                    const memberCount = project.members?.length || 0;
                    return (
                      <div
                        key={project._id}
                        className="border dark:border-slate-700 border-gray-100 hover:border-gray-200 dark:hover:border-slate-600 rounded-xl p-4 hover:shadow-sm transition-all duration-200 flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-bold text-gray-800 dark:text-blue-500 text-sm line-clamp-1">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-[11px] text-black dark:text-white mt-0.5 line-clamp-1">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                          <span
                            className={`flex items-center gap-1 font-medium ${isOverdue ? "text-red-500" : "text-gray-500"}`}
                          >
                            <Calendar size={11} />
                            {isOverdue
                              ? `${Math.abs(days)}d overdue`
                              : days === 0
                                ? "Due today"
                                : `${days}d left`}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Users size={11} /> {memberCount} member
                            {memberCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Pagination
                  page={projPage}
                  pages={projData.pages}
                  total={projData.total}
                  limit={LIMIT}
                  onPageChange={setProjPage}
                />
              </>
            )}
          </div>
        )}

        {/* ══════════════════ MEMBERS TAB ══════════════════ */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search team members by name..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border dark:border-slate-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100"
                />
                {memberSearch && (
                  <button
                    onClick={() => setMemberSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                className="text-sm border dark:border-slate-700 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Team Member">Team Member</option>
              </select>
            </div>

            {memberLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : memberData.users.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl">
                <Users size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">
                  No members found
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="whitespace-nowrap border-b dark:border-slate-700 border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                        <th className="pb-3 pl-4 pr-4">Member</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Role</th>
                        <th className="pb-3 pr-4 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {memberData.users.map((member) => {
                        const roleColor =
                          member.role === "Admin"
                            ? "bg-red-50 text-red-700 border dark:border-slate-700 border-red-200"
                            : member.role === "Project Manager"
                              ? "bg-green-50 text-green-700 border dark:border-slate-700 border-green-200"
                              : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-slate-700 border-blue-200";
                        const initials = member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                        return (
                          <tr
                            key={member._id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                          >
                            <td className="py-3 pl-4 pr-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {initials}
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-slate-100">
                                  {member.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-xs text-gray-500 dark:text-slate-400">
                              {member.email}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleColor}`}
                              >
                                {member.role}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-right text-xs text-gray-400">
                              {member.createdAt
                                ? new Date(member.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={memberPage}
                  pages={memberData.pages}
                  total={memberData.total}
                  limit={LIMIT}
                  onPageChange={setMemberPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterHub;
