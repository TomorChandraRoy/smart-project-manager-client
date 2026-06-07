import { useState, useEffect } from "react";
import { MessageSquare, X, Send, Trash2, Loader2 } from "lucide-react";
import api from "../../api/axios";
import {PRIORITY_STYLE,STATUS_STYLE,getInitials,timeAgo} from "./taskConstants";

const CommentModal = ({ task, user, onClose, onUpdate }) => {
  const [comments, setComments] = useState(task.comments || []);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const maxLen = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/add-comment/${task._id}`, { text });
      setComments(res.data.comments);
      setText("");
      onUpdate(task._id, res.data.comments);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      const res = await api.delete(`/delete-comment/${task._id}/${commentId}`);
      setComments(res.data.comments);
      onUpdate(task._id, res.data.comments);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={16} className="text-blue-600 shrink-0" />
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-base truncate">
                {task.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLE[task.priority]}`}
              >
                {task.priority}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[task.status]}`}
              >
                {task.status}
              </span>
              {task.project?.name && (
                <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-white border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  📁 {task.project.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare size={36} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 dark:text-slate-300 text-sm">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((c) => {
              const isOwner = c.userId === user?.id || c.userId === user?._id;
              const canDelete = isAdmin || isOwner;
              const initials = getInitials(c.user || "?");
              const roleColor =
                c.userRole?.toLowerCase() === "admin"
                  ? "from-red-500 to-red-600"
                  : c.userRole?.toLowerCase() === "project manager"
                    ? "from-green-500 to-green-600"
                    : "from-blue-500 to-purple-600";

              const isTeamMember = c.userRole?.toLowerCase() === "team member";
              const deleteBtn = canDelete && (
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deletingId === c._id}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer shrink-0"
                >
                  {deletingId === c._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              );

              return (
                <div key={c._id} className={"flex gap-3 group " + (isTeamMember ? "flex-row-reverse" : "")}>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.user}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full bg-linear-to-br ${roleColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}
                    >
                      {initials}
                    </div>
                  )}
                  <div className={"flex-1 min-w-0 flex items-center gap-2 " + (isTeamMember ? "justify-end" : "justify-start")}>
                    {isTeamMember && deleteBtn}
                    <div className={"rounded-xl px-3.5 py-2.5 border w-full sm:max-w-[85%] " + (isTeamMember ? "rounded-tr-none bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50" : "rounded-tl-none bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700")}>
                      <div className={"flex items-center justify-between gap-2 mb-1 " + (isTeamMember ? "flex-row-reverse" : "")}>
                        <div className={"flex items-center gap-1.5 " + (isTeamMember ? "flex-row-reverse" : "")}>
                          {c.userRole && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/50">
                              {c.userRole}
                            </span>
                          )}
                        </div>
                        <div className={"flex items-center gap-1 shrink-0 " + (isTeamMember ? "flex-row-reverse" : "")}>
                          <span className="text-[10px] font-medium text-gray-500 dark:text-slate-300">
                            {timeAgo(c.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {c.text}
                      </p>
                    </div>
                    {!isTeamMember && deleteBtn}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                maxLength={maxLen}
                className="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-md px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition bg-white dark:bg-slate-800 dark:text-slate-100"
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-400">
                {text.length}/{maxLen}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
