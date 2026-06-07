import { useState} from "react";
import api from "../../api/axios";
import swal from "sweetalert";
import ProjectModal from "./ProjectModal";
import { STATUS_COLOR } from "./pmConstants";
import { CalendarDays, Users } from "lucide-react";

const ProjectsTab = ({ projects, fetchProjects, fetchingProjects }) => {
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    deadline: "",
    status: "Active",
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate current projects
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectLoading(true);
    try {
      if (editingProjectId) {
        await api.put(`/updateProject/${editingProjectId}`, projectForm);
        swal("Updated!", "Project updated successfully.", "success");
      } else {
        await api.post("/createProject", projectForm);
        swal("Created!", "Project created successfully.", "success");
      }
      setProjectForm({
        name: "",
        description: "",
        deadline: "",
        status: "Active",
      });
      setEditingProjectId(null);
      fetchProjects();
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setProjectLoading(false);
    }
  };

  const handleProjectDelete = async (id) => {
    const ok = await swal({
      title: "Delete project?",
      text: "This will remove the project.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/deleteProject/${id}`);
      swal("Deleted!", "Project removed.", "success");
      fetchProjects();
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Failed to delete.",
        "error",
      );
    }
  };

  const handleProjectEdit = (p) => {
    setEditingProjectId(p._id);
    setProjectForm({
      name: p.name,
      description: p.description,
      deadline: p.deadline ? p.deadline.split("T")[0] : "",
      status: p.status,
    });
  };

  return (
    <div>
      <ProjectModal
        projectForm={projectForm}
        setProjectForm={setProjectForm}
        editingProjectId={editingProjectId}
        setEditingProjectId={setEditingProjectId}
        handleProjectSubmit={handleProjectSubmit}
        projectLoading={projectLoading}
      />

      <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-slate-200">
        All Projects ({projects.length})
      </h2>
      {fetchingProjects ? (
        <div className="text-center py-12 text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow p-8 text-center text-gray-400">
          No projects yet. Create one above!
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {currentProjects.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md p-5 flex flex-col border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-lg">
                    {p.name}
                  </h3>
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium min-w-22.5 ${STATUS_COLOR[p.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-3 grow">
                  {p.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-300 mb-4">
                  <CalendarDays size={14} className="text-blue-500 dark:text-blue-400" />
                  <span>
                    {p.deadline
                      ? new Date(p.deadline).toLocaleDateString("en-BD")
                      : "—"}
                  </span>
                </div>
                {p.members?.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-600 dark:text-slate-300">
                    <Users size={14} className="text-blue-500 dark:text-blue-400" />
                    <span>{p.members.map((m) => m.name).join(", ")}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleProjectEdit(p)} className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm hover:bg-indigo-600 cursor-pointer">Edit</button>
                  <button onClick={() => handleProjectDelete(p._id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Previous
              </button>
              
              <div className="items-center gap-1 hidden sm:flex">
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
        </>
      )}
    </div>
  );
};

export default ProjectsTab;
