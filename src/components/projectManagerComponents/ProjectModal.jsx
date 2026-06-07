const ProjectModal = ({projectForm,setProjectForm,editingProjectId,setEditingProjectId,handleProjectSubmit,projectLoading}) => {
  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">
        {editingProjectId ? "✏️ Edit Project" : "➕ Create New Project"}
      </h2>
      <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Project Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={projectForm.name}
            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
            required
            className="border dark:border-slate-700 rounded-lg p-3 w-full focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={projectForm.deadline}
            onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
            required
            className="border dark:border-slate-700 rounded-lg p-3 w-full dark:scheme-dark focus:outline-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Description *</label>
          <textarea
            name="description"
            placeholder="Project Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            required
            rows={3}
            className="border dark:border-slate-700 rounded-lg p-3 w-full focus:outline-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Status</label>
          <select
            value={projectForm.status}
            onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
            className="border dark:border-slate-700 rounded-lg p-3 w-full focus:outline-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <button
            type="submit"
            disabled={projectLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
          >
            {projectLoading ? "Saving..." : editingProjectId ? "Update Project" : "Create Project"}
          </button>
          {editingProjectId && (
            <button
              type="button"
              onClick={() => {
                setEditingProjectId(null);
                setProjectForm({ name: "", description: "", deadline: "", status: "Active" });
              }}
              className="flex-1 bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200 rounded-lg p-3 hover:bg-gray-300 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectModal;
