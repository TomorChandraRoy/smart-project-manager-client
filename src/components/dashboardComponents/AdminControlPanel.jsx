import { useState } from "react";
import api from "../../api/axios";
import swal from "sweetalert";

const AdminControlPanel = ({ users, user, setUsers, setStats }) => {
  const [showUserManagement, setShowUserManagement] = useState(false);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put("/update-role", { userId, role: newRole });
      swal("Success", `User role updated to ${newRole}`, "success");
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      const statsRes = await api.get("/dashboardStats");
      setStats(statsRes.data);
    } catch (err) {
      swal("Error", err.response?.data?.message || "Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    const ok = await swal({
      title: "Delete user?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!ok) return;

    try {
      await api.delete(`/delete-user/${userId}`);
      swal("Deleted!", "User removed from system.", "success");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      const statsRes = await api.get("/dashboardStats");
      setStats(statsRes.data);
    } catch (err) {
      swal("Error", err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  return (
    <div className="bg-red-50/50 p-6 rounded-2xl border dark:border-slate-700 border-red-100 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-red-800 font-bold text-lg">
            Admin Control Panel — User Role Management
          </h3>
          <p className="text-sm text-red-700/80">
            You can change the role of any member in the system. Only you can
            view and manage this panel.
          </p>
        </div>
        <button
          onClick={() => setShowUserManagement(!showUserManagement)}
          className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-xs hover:shadow"
        >
          {showUserManagement ? "Hide Member Roles" : "Manage Member Roles"}
        </button>
      </div>
      {showUserManagement && (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 border-gray-100 rounded-xl overflow-hidden shadow-xs animate-fadeIn max-h-75 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-700 border-gray-100 text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase sticky top-0 z-10">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Current Role</th>
                <th className="p-4 w-40">Role Changes</th>
                <th className="p-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="p-4 font-semibold text-gray-800 dark:text-slate-100">
                      {u.name}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-slate-400 text-xs">
                      {u.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "Admin"
                            ? "bg-red-50 text-red-700 border dark:border-slate-700 border-red-100"
                            : u.role === "Project Manager"
                              ? "bg-green-50 text-green-700 border dark:border-slate-700 border-green-100"
                              : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-slate-700 border-blue-100"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        disabled={u._id === user.id}
                        className="border dark:border-slate-700 border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-blue-500 bg-white dark:bg-slate-900 font-medium disabled:opacity-50 text-gray-800 dark:text-slate-200"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Team Member">Team Member</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u._id === user.id}
                        className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-xs hover:bg-red-200 transition disabled:opacity-50 cursor-pointer"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminControlPanel;
