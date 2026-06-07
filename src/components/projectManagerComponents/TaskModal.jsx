import { Edit, Sparkles } from "lucide-react";

const TaskModal = ({taskForm,setTaskForm,editingTaskId,setShowTaskModal,handleTaskSubmit,taskLoading,projects,members}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 rounded-t-2xl border-b dark:border-slate-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {editingTaskId ? (<><Edit size={20}/> Edit Task</>) : (<><Sparkles size={20}/> Create Task</>)}
          </h3>
          <button
            onClick={() => setShowTaskModal(false)}
            className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer transition-colors"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleTaskSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Project *</label>
            <select
              value={taskForm.project}
              onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
              required
              className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Title *</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
              placeholder="Task title"
              className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Description</label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              rows={3}
              placeholder="Task description"
              className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Assign To</label>
            <select
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Due Date *</label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
              className="border dark:border-slate-700 rounded-lg p-3 w-full dark:scheme-dark focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                className="border dark:border-slate-700 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={taskLoading}
            className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {taskLoading ? "Saving..." : editingTaskId ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
