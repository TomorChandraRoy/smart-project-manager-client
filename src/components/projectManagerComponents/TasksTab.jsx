import { useState, useEffect } from "react";
import api from "../../api/axios";
import swal from "sweetalert";
import { MessageSquare } from "lucide-react";
import TaskModal from "./TaskModal";
import CommentModal from "../taskComponents/CommentModal";
import { STATUS_COLOR, PRIORITY_COLOR } from "./pmConstants";

const emptyTask = {
  project: "",
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
  status: "Todo",
};

const TasksTab = ({ projects, members, user }) => {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskFilter, setTaskFilter] = useState({ project: "", status: "", priority: ""});
  const [taskLoading, setTaskLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(false);
  const [selectedTaskForComment, setSelectedTaskForComment] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate current tasks
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const currentTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchTasks();
  }, [taskFilter]);

  const fetchTasks = async () => {
    try {
      setFetchingTasks(true);
      const params = { limit: 100 };
      if (taskFilter.project) params.project = taskFilter.project;
      if (taskFilter.status) params.status = taskFilter.status;
      if (taskFilter.priority) params.priority = taskFilter.priority;
      const res = await api.get("/get-tasks", { params });
      setTasks(res.data.tasks || res.data);
      setCurrentPage(1);
    } catch {
      swal("Error", "Failed to load tasks.", "error");
    } finally {
      setFetchingTasks(false);
    }
  };

  const openCreateTask = () => {
    setTaskForm(emptyTask);
    setEditingTaskId(null);
    setShowTaskModal(true);
  };

  const openEditTask = (t) => {
    setEditingTaskId(t._id);
    setTaskForm({
      project: t.project?._id || t.project,
      title: t.title,
      description: t.description || "",
      assignedTo: t.assignedTo?._id || t.assignedTo || "",
      dueDate: t.dueDate?.split("T")[0] || "",
      priority: t.priority,
      status: t.status,
    });
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      const payload = { ...taskForm };
      if (!payload.assignedTo) payload.assignedTo = null;

      if (editingTaskId) {
        const res = await api.put(
          `/get-single-task/${editingTaskId}`,
          payload,
        );
        setTasks(tasks.map((t) => (t._id === editingTaskId ? res.data : t)));
        swal("Updated!", "Task updated.", "success");
      } else {
        const res = await api.post("/create-task", payload);
        setTasks([res.data, ...tasks]);
        swal("Created!", "Task saved.", "success");
      }
      setShowTaskModal(false);
      setTaskForm(emptyTask);
      setEditingTaskId(null);
    } catch (err) {
      swal(
        "Validation Error",
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setTaskLoading(false);
    }
  };

  const handleTaskDelete = async (id) => {
    const ok = await swal({
      title: "Delete task?",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/delete-task/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      swal("Deleted!", "Task removed.", "success");
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Failed to delete.",
        "error",
      );
    }
  };

  const handleCommentUpdate = (taskId, newComments) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, comments: newComments } : t)),
    );
    if (selectedTaskForComment?._id === taskId) {
      setSelectedTaskForComment((prev) => ({ ...prev, comments: newComments }));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm p-4">
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={taskFilter.project}
            onChange={(e) =>
              setTaskFilter({ ...taskFilter, project: e.target.value })
            }
            className="border dark:border-slate-700 rounded-lg p-2 text-sm flex-1"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={taskFilter.status}
            onChange={(e) =>
              setTaskFilter({ ...taskFilter, status: e.target.value })
            }
            className="border dark:border-slate-700 rounded-lg p-2 text-sm flex-1"
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={taskFilter.priority}
            onChange={(e) =>
              setTaskFilter({ ...taskFilter, priority: e.target.value })
            }
            className="border dark:border-slate-700 rounded-lg p-2 text-sm flex-1"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button
          onClick={openCreateTask}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shrink-0 cursor-pointer w-full md:w-auto"
        >
          + New Task
        </button>
      </div>

      {fetchingTasks ? (
        //skeleton loaders
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-100 dark:bg-slate-800 h-14 w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-slate-800"
            >
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-8 text-center text-gray-400 border border-gray-100 dark:border-slate-800">
          No tasks found. Use filters or create a new task.
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white shadow-sm border-b dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-semibold tracking-wide">Title</th>
                    <th className="p-4 font-semibold tracking-wide">Project</th>
                    <th className="p-4 font-semibold tracking-wide">
                      Assigned To
                    </th>
                    <th className="p-4 font-semibold tracking-wide">
                      Due Date
                    </th>
                    <th className="p-4 font-semibold tracking-wide">
                      Priority
                    </th>
                    <th className="p-4 font-semibold tracking-wide">Status</th>
                    <th className="p-4 font-semibold tracking-wide text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {currentTasks.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-blue-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-slate-100">
                        {t.title}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-slate-400">
                        {t.project?.name || "—"}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-slate-400">
                        {t.assignedTo?.name || "Unassigned"}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-slate-400">
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleDateString("en-BD")
                          : "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium min-w-22.5 ${PRIORITY_COLOR[t.priority] || "bg-gray-100 text-gray-600"}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium min-w-22.5 ${STATUS_COLOR[t.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openEditTask(t)}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs hover:bg-indigo-200 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleTaskDelete(t._id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setSelectedTaskForComment(t)}
                            className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded text-xs hover:bg-blue-100 transition cursor-pointer"
                          >
                            <MessageSquare size={11} />
                            {t.comments?.length > 0
                              ? `${t.comments.length}`
                              : ""}{" "}
                            Comments
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedTaskForComment && (
        <CommentModal
          task={selectedTaskForComment}
          user={user}
          onClose={() => setSelectedTaskForComment(null)}
          onUpdate={handleCommentUpdate}
        />
      )}

      {showTaskModal && (
        <TaskModal
          taskForm={taskForm}
          setTaskForm={setTaskForm}
          editingTaskId={editingTaskId}
          setShowTaskModal={setShowTaskModal}
          handleTaskSubmit={handleTaskSubmit}
          taskLoading={taskLoading}
          projects={projects}
          members={members}
        />
      )}
    </div>
  );
};

export default TasksTab;
