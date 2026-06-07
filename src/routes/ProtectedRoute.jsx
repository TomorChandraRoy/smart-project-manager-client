import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); 
  const location = useLocation();
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />; 
  }


  const userRole = user.role?.toLowerCase();
  if (allowedRoles && !allowedRoles.some(r => r.toLowerCase() === userRole)) {
    return <Navigate to="/unauthorized" replace />; 
  }


  return children;
};

export default ProtectedRoute;
