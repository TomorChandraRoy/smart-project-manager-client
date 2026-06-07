import { useState, useRef, useCallback } from "react";
import api from "../../api/axios";

//  File size formatter 
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

//  File type icon 
const fileIcon = (type) => {
  if (type?.startsWith("image/")) return "🖼️";
  if (type === "application/pdf") return "📄";
  if (type?.includes("word")) return "📝";
  if (type?.includes("excel") || type?.includes("spreadsheet")) return "📊";
  if (type?.includes("zip")) return "🗜️";
  return "📎";
};


 //FileUpload Component
const FileUpload = ({
  onUploadSuccess,
  onDeleteFile,
  existingFiles = [],
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    // 10MB limit check on frontend too
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const res = await api.post("/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(pct);
        },
      });

      if (res.data.success) {
        onUploadSuccess?.(res.data.file);
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onUploadSuccess]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const getFileUrl = (url) => {
    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:7000";
    return url.startsWith("http") ? url : `${base}${url}`;
  };

  return (
    <div className="space-y-3">
      {/* Existing attachments */}
      {existingFiles.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Attachments ({existingFiles.length})
          </p>
          <div className="space-y-1.5">
            {existingFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group"
              >
                <span className="text-lg shrink-0">{fileIcon(file.mimetype)}</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={getFileUrl(file.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {file.name}
                  </a>
                  {file.size && (
                    <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
                  )}
                </div>
                <a
                  href={getFileUrl(file.url)}
                  target="_blank"
                  rel="noreferrer"
                  download={file.name}
                  title="Download"
                  className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
                {onDeleteFile && (
                  <button
                    type="button"
                    onClick={() => onDeleteFile(file.filename, idx)}
                    title="Remove attachment"
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10"
        } ${compact ? "p-3" : "p-5"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
          onChange={handleFileInput}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uploading... {progress}%
            </p>
          </div>
        ) : (
          <div className={`flex items-center gap-3 ${compact ? "" : "flex-col"}`}>
            <div className={`${compact ? "p-1.5" : "p-3"} rounded-xl bg-blue-100 dark:bg-blue-900/40`}>
              <svg className={`${compact ? "size-4" : "size-5"} text-blue-600 dark:text-blue-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className={compact ? "" : "text-center"}>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isDragging ? "Drop file here" : "Click or drag & drop"}
              </p>
              {!compact && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Images, PDF, Word, Excel, TXT, ZIP (max 10MB)
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
          <span className="text-red-500 text-sm shrink-0">⚠️</span>
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 cursor-pointer"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
