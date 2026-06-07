import { useState, useEffect } from "react";
import api from "../../api/axios";
import swal from "sweetalert";

const WorkloadTab = () => {
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate current workload
  const totalPages = Math.ceil(workload.length / itemsPerPage);
  const currentWorkload = workload.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        setLoading(true);
        const res = await api.get("/workload");
        setWorkload(res.data);
      } catch (err) {
        swal("Error", "Failed to load workload.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkload();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading workload data...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-transparent dark:border-slate-700 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:bg-none">
        <h2 className="text-lg font-semibold text-white dark:text-slate-200 tracking-wide dark:tracking-normal">
          📊 Workload Summary — Task Distribution per Member
        </h2>
      </div>
      {workload.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          No task data available. Assign tasks to see workload.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-700 border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 dark:text-slate-300">
                    Member Name
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-slate-300">
                    Email
                  </th>
                  <th className="p-4 font-semibold text-blue-600">
                    Total Tasks
                  </th>
                  <th className="p-4 font-semibold text-green-600">
                    ✅ Completed
                  </th>
                  <th className="p-4 font-semibold text-amber-600">
                    ⏳ Pending
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-slate-300">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {currentWorkload.map((w) => {
                  const pct =
                    w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0;
                  return (
                    <tr
                      key={w._id}
                      className="hover:bg-gray-50 dark:bg-slate-800/50"
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-slate-100">
                        {w.name || "Unknown"}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-slate-400 text-xs">
                        {w.email || "—"}
                      </td>
                      <td className="p-4 font-bold text-blue-700 dark:text-blue-400">
                        {w.total}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        {w.completed}
                      </td>
                      <td className="p-4 font-semibold text-amber-600">
                        {w.pending}
                      </td>
                      <td className="p-4 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400 w-8">
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center my-6 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center gap-1 hidden sm:flex">
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
    </div>
  );
};

export default WorkloadTab;
