import { useState, useEffect } from "react";
import { Paperclip, X } from "lucide-react";
import FileUpload from "../../components/shareComponents/FileUpload";
import api from "../../api/axios";

const FileModal = ({ task, onClose, onUpdate }) => {
  const [attachments, setAttachments] = useState(task.attachments || []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleUploadSuccess = async (fileData) => {
    try {
      const newAttachment = {
        name: fileData.name,
        filename: fileData.filename,
        url: fileData.url,
        mimetype: fileData.mimetype,
        size: fileData.size,
      };
      const updated = [...attachments, newAttachment];

      // Save attachment reference to the task in DB using the correct endpoint
      await api.patch(`/update-task-attachments/${task._id}`, {
        attachments: updated,
      });

      setAttachments(updated);
      onUpdate(task._id, updated);
    } catch (err) {
      console.error("Failed to save attachment:", err);
      alert(err.response?.data?.message || "Failed to save attachment.");
    }
  };

  const handleDeleteFile = async (filename, idx) => {
    try {
      await api.delete(`/delete-file/${filename}`);
      const updated = attachments.filter((_, i) => i !== idx);
      // Update in DB too using the correct endpoint
      await api.patch(`/update-task-attachments/${task._id}`, {
        attachments: updated,
      });
      setAttachments(updated);
      onUpdate(task._id, updated);
    } catch (err) {
      console.error("Delete file error:", err);
      alert(err.response?.data?.message || "Failed to delete file.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip size={16} className="text-blue-600" />
            <h3 className="font-bold text-gray-800 dark:text-slate-100 text-base truncate">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          <FileUpload
            existingFiles={attachments}
            onUploadSuccess={handleUploadSuccess}
            onDeleteFile={handleDeleteFile}
          />
        </div>
      </div>
    </div>
  );
};

export default FileModal;
