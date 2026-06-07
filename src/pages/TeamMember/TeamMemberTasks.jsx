import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {ClipboardList,X,Loader2,CheckCircle2,AlertCircle} from "lucide-react";
import CommentModal from "../../components/taskComponents/CommentModal";
import FileModal from "../../components/taskComponents/FileModal";
import TaskCard from "../../components/taskComponents/TaskCard";


// Main TeamMemberTasks Page
const TeamMemberTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileTask, setFileTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;



  const fetchMyTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      // Everyone sees only their assigned tasks on this page
      if (user?.id) params.set("assignedTo", user.id);
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      const res = await api.get(`/get-tasks?${params}`);
      setTasks(res.data.tasks || []);
      setCurrentPage(1);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, user]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const handleCommentUpdate = (taskId, newComments) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, comments: newComments } : t)),
    );
    if (selectedTask?._id === taskId) {
      setSelectedTask((prev) => ({ ...prev, comments: newComments }));
    }
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  const handleAttachmentUpdate = (taskId, newAttachments) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, attachments: newAttachments } : t,
      ),
    );
    if (fileTask?._id === taskId) {
      setFileTask((prev) => ({ ...prev, attachments: newAttachments }));
    }
  };

  // Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter(
    (t) => t.status !== "Completed" && new Date(t.dueDate) < new Date(),
  ).length;

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <ClipboardList className="text-blue-600" size={24} />
                My Tasks
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Welcome,{" "}
                <span className="font-semibold text-gray-800 dark:text-slate-200">
                  {user?.name}
                </span>{" "}
                —{" "}
                <span className="text-blue-600 font-medium capitalize">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: total,
              icon: <ClipboardList size={16} />,
              color:
                "text-blue-600 bg-blue-50 dark:bg-blue-500/20 dark:text-blue-300",
            },
            {
              label: "In Progress",
              value: inProgress,
              icon: <Loader2 size={16} className="animate-spin" />,
              color:
                "text-purple-600 bg-purple-50 dark:bg-purple-500/20 dark:text-purple-300",
            },
            {
              label: "Completed",
              value: completed,
              icon: <CheckCircle2 size={16} />,
              color:
                "text-green-600 bg-green-50 dark:bg-green-500/20 dark:text-green-300",
            },
            {
              label: "Overdue",
              value: overdue,
              icon: <AlertCircle size={16} />,
              color:
                "text-red-600 bg-red-50 dark:bg-red-500/20 dark:text-red-300",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3"
            >
              <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-200 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-xl font-extrabold text-gray-800 dark:text-white">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 dark:border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border border-gray-200 dark:border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {(filterStatus || filterPriority) && (
            <button
              onClick={() => {
                setFilterStatus("");
                setFilterPriority("");
              }}
              className="text-xs text-red-500 font-semibold hover:text-red-700 border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <X size={14} className="mt-px" /> Clear
            </button>
          )}
          <span className="ml-auto text-[11px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800/50">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Task Cards */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center py-16">
            <ClipboardList
              size={48}
              className="mx-auto text-gray-200 dark:text-slate-700 mb-3"
            />
            <p className="text-gray-400 dark:text-slate-300 font-medium">
              No tasks found
            </p>
            <p className="text-gray-300 dark:text-slate-500 text-sm mt-1">
              {filterStatus || filterPriority
                ? "Try clearing filters"
                : "No tasks assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusUpdate={handleStatusUpdate}
                onOpenComments={setSelectedTask}
                onOpenFiles={setFileTask}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Previous
            </button>
            
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {selectedTask && (
        <CommentModal
          task={selectedTask}
          user={user}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleCommentUpdate}
        />
      )}

      {/* File Attachment Modal */}
      {fileTask && (
        <FileModal
          task={fileTask}
          onClose={() => setFileTask(null)}
          onUpdate={handleAttachmentUpdate}
        />
      )}
    </div>
  );
};

export default TeamMemberTasks;
