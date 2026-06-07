import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { useAuth } from "../../../context/AuthContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth(); 


  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      swal("Oops!", "Two passwords do not match!!", "error");
      return;
    }

    if (password.length < 6) {
      swal("Oops!", "Password must be at least 6 characters long!", "warning");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, email, password);

      swal("Success", "Password changed successfully! Login now.", "success");
      navigate("/signin"); 
    } catch (err) {
      swal("Error", err.message || "Token is invalid or expired.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="border border-slate-300 rounded-lg p-6 max-w-md w-full bg-white shadow-sm md:p-8">
        <h1 className="text-slate-900 text-2xl font-bold mb-2">Create New Password</h1>
        <p className="text-slate-600 text-sm mb-6">Set your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 text-sm text-slate-900 rounded-md bg-white w-full outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-600"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-3 py-2 text-sm text-slate-900 rounded-md bg-white w-full outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-sm rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-400 cursor-pointer"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;