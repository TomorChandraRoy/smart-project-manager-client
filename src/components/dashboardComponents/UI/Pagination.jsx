
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, total, limit, onPageChange }) => {
  if (pages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-xs text-gray-500 dark:text-slate-400">
        Showing <span className="font-semibold text-gray-900 dark:text-slate-200">{from}–{to}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-slate-200">{total}</span> results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border dark:border-slate-700 border-gray-200 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          let pageNum;
          if (pages <= 5) pageNum = i + 1;
          else if (page <= 3) pageNum = i + 1;
          else if (page >= pages - 2) pageNum = pages - 4 + i;
          else pageNum = page - 2 + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                page === pageNum
                  ? "bg-blue-600 text-white"
                  : "border dark:border-slate-700 border-gray-200 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded-lg border dark:border-slate-700 border-gray-200 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
