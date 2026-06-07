import { useState } from "react";
import api from "../../api/axios";
import swal from "sweetalert";
import { STATUS_COLOR, PRIORITY_COLOR } from "./pmConstants";

const MembersTab = ({ projects, setProjects, members }) => {
  const [selectedProjectForMembers, setSelectedProjectForMembers] =
    useState("");
  const [memberTasksUserId, setMemberTasksUserId] = useState("");
  const [memberTasks, setMemberTasks] = useState([]);

  // Pagination for members
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const currentMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedProject = projects.find(
    (p) => p._id === selectedProjectForMembers,
  );

  const handleAddMember = async (userId) => {
    if (!selectedProjectForMembers)
      return swal("Warning", "Please select a project first.", "warning");
    try {
      const res = await api.post(
        `/project-members/${selectedProjectForMembers}`,
        { userId },
      );
      setProjects(
        projects.map((p) =>
          p._id === selectedProjectForMembers ? res.data : p,
        ),
      );
      swal("Added!", "Member added to project.", "success");
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Failed to add member.",
        "error",
      );
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await api.delete(
        `/project-members/${selectedProjectForMembers}/${userId}`,
      );
      setProjects(
        projects.map((p) =>
          p._id === selectedProjectForMembers ? res.data : p,
        ),
      );
      swal("Removed!", "Member removed from project.", "success");
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Failed to remove member.",
        "error",
      );
    }
  };

  const handleViewMemberTasks = async (userId) => {
    setMemberTasksUserId(userId);
    try {
      const res = await api.get("/get-tasks", {
        params: { assignedTo: userId, limit: 100 },
      });
      setMemberTasks(res.data.tasks || res.data);
    } catch {
      setMemberTasks([]);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left — Project member management */}
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">
          🏗️ Manage Project Members
        </h2>
        <select
          value={selectedProjectForMembers}
          onChange={(e) => setSelectedProjectForMembers(e.target.value)}
          className="border dark:border-slate-700 rounded-lg p-3 w-full mb-4 bg-white dark:bg-slate-900 dark:text-white"
        >
          <option value="">Select a Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedProject && (
          <>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
              Current Members:
            </h3>
            {selectedProject.members?.length === 0 ? (
              <p className="text-gray-400 text-sm mb-4">No members yet.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {selectedProject.members?.map((m) => (
                  <li
                    key={m._id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-slate-200">
                      {m.name}{" "}
                      <span className="text-xs text-gray-400">({m.email})</span>
                    </span>
                    <button
                      onClick={() => handleRemoveMember(m._id)}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
              Add Member:
            </h3>
            <div className="space-y-2">
              {members
                .filter(
                  (m) =>
                    !selectedProject.members?.some((pm) => pm._id === m._id),
                )
                .map((m) => (
                  <div
                    key={m._id}
                    className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-slate-200">
                      {m.name}{" "}
                      <span className="text-xs text-gray-400">— {m.role}</span>
                    </span>
                    <button
                      onClick={() => handleAddMember(m._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              {members.filter(
                (m) => !selectedProject.members?.some((pm) => pm._id === m._id),
              ).length === 0 && (
                <p className="text-gray-400 text-sm">
                  All members already added.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right — Member-wise task list */}
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">
          🗂️ Member Task List
        </h2>
        <select
          value={memberTasksUserId}
          onChange={(e) => handleViewMemberTasks(e.target.value)}
          className="border dark:border-slate-700 rounded-lg p-3 w-full mb-4 bg-white dark:bg-slate-900 dark:text-white"
        >
          <option value="">Select a Team Member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>

        {memberTasksUserId &&
          (memberTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No tasks assigned to this member.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {memberTasks.map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-400">{t.project?.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLOR[t.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {t.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLOR[t.priority] || "bg-gray-100 text-gray-600"}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* All Team Members List */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">
          👥 All Team Members ({members.length})
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentMembers.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {m.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                  {m.name}
                </p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
            </div>
          ))}
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
            
            <div className=" items-center gap-1 hidden sm:flex">
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
    </div>
  );
};

export default MembersTab;
