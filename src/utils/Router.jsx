import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../layout/MainLayOut";
import Home from "../pages/Home";
import Errors from './../erros/Errors';
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProjectManager from "../pages/ProjectManager/ProjectManager";
import TeamMemberTasks from "../pages/TeamMember/TeamMemberTasks";
import About from "../pages/About/About";
import Features from "../pages/Features/Features";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut />,
    errorElement: <Errors />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/features",
        element: <Features />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/signup",
        element: <SignUp />
      },
      {
        path: "/signin",
        element: <SignIn />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      // Admin Dashboard
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      // Project Console — Admin + Project Manager
      {
        path: "/create-project",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Project Manager"]}>
            <ProjectManager />
          </ProtectedRoute>
        )
      },
      // My Tasks — sob Logged-in Role (Admin, Project Manager, Team Member)
      {
        path: "/my-tasks",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Project Manager", "Team Member"]}>
            <TeamMemberTasks />
          </ProtectedRoute>
        )
      }
    ]
  },
]);
