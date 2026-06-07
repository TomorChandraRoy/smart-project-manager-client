import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "./NotificationBell";

// A reusable component for navigation links that automatically handles active/inactive styling
const NavItem = ({ 
  to, 
  children, 
  end = false, 
  baseClass = "", 
  activeClass = "text-blue-700 dark:text-blue-400 underline decoration-2 underline-offset-4", 
  inactiveClass = "hover:text-blue-700 dark:hover:text-blue-400" 
}) => {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`.trim()
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

// A simple button to switch between dark and light modes
const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    id="theme-toggle"
    type="button"
    onClick={toggleTheme}
    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    className="relative p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer"
  >
    {theme === "dark" ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )}
  </button>
);

// Shows the user's profile and logout button if they are logged in, otherwise shows login/signup links
const UserAuthMenu = ({ user, logout }) => {
  if (user) {
    return (
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="size-7 rounded-full object-cover border border-blue-500" />
          ) : (
            <div className="size-7 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
              {user.name?.charAt(0)}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[100px] truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 capitalize -mt-0.5">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          type="button"
          className="cursor-pointer text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-900/50 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <Link to="/signin" className="text-slate-900 dark:text-slate-100 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-400">
        Log in
      </Link>
      <Link to="/signup" className="py-2 px-3.5 text-sm rounded-md font-semibold text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all">
        Sign up
      </Link>
    </>
  );
};


// The main Navbar component that puts everything together
const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // All our navigation links and their access rules in one place
  const navLinks = [
    { to: "/", label: "Home", end: true, roles: [] },
    {
      to: "/dashboard",
      label: "Dashboard",
      roles: ["admin"],
      baseClass: "font-bold",
      inactiveClass: "hover:text-blue-700 dark:hover:text-blue-400",
    },
    {
      to: "/create-project",
      label: "Project Management",
      roles: ["admin", "project manager"],
      baseClass: "font-bold",
      inactiveClass: "hover:text-blue-700 dark:hover:text-blue-400 ",
    },
    {
      to: "/my-tasks",
      label: "My Tasks",
      roles: ["loggedIn"],
      baseClass: "font-bold",
      inactiveClass: "hover:text-blue-700 dark:hover:text-blue-400 ",
    },
    { to: "/features", label: "Features", roles: [] },
    { to: "/about", label: "About", roles: [] },
  ];

  // A helper function to check if the current user has permission to see a link
  const shouldShowLink = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (!user) return false;
    if (roles.includes("loggedIn")) return true;
    return roles.includes(user.role?.toLowerCase());
  };

  return (
    <nav className="shadow-sm border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 min-h-18 flex items-center tracking-wide transition-colors duration-300">
      <div className="max-w-330 mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
        {/* Brand logo and name */}
        <Link
          to="/"
          className="min-w-9 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <img src="/public/project-svgrepo-com.svg" alt="logo" className="h-9 w-auto" />
          <span className="font-bold text-slate-900 dark:text-white hidden sm:block">
            Smart Project Manager
          </span>
        </Link>

        {/* Navigation links (collapsible on mobile) */}
        <div
          id="collapseMenu"
          className={`${
            isOpen ? "block" : "hidden"
          } lg:block max-lg:bg-white dark:max-lg:bg-neutral-900 max-lg:border-l max-lg:border-slate-300 dark:max-lg:border-neutral-700 max-lg:w-1/2 max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto max-sm:w-full z-50 outline-none`}
        >
          {/* Header section for the mobile menu (only visible on small screens) */}
          <div className="py-2 px-4 flex justify-between items-center border-b border-slate-300 sticky top-0 bg-white dark:border-neutral-700 dark:bg-neutral-900 lg:hidden max-lg:min-h-17">
            <span className="font-bold text-slate-900 dark:text-white">Menu</span>
            <button type="button" onClick={() => setIsOpen(false)} className="cursor-pointer p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-slate-900 dark:fill-slate-50" viewBox="0 0 329.269 329">
                <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-8 font-semibold text-sm text-slate-900 dark:text-slate-50 lg:flex-row max-lg:p-6">
            {navLinks.filter(link => shouldShowLink(link.roles)).map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                end={link.end}
                baseClass={link.baseClass}
                inactiveClass={link.inactiveClass}
              >
                {link.label}
              </NavItem>
            ))}
          </ul>
        </div>

        {/* Right side action buttons (Theme, Notifications, User Profile) */}
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {user && <NotificationBell />}
          <UserAuthMenu user={user} logout={logout} />

          {/* Hamburger menu button for mobile screens */}
          <button type="button" onClick={() => setIsOpen(true)} className="cursor-pointer lg:hidden p-1">
            <svg className="size-7 fill-slate-900 dark:fill-slate-50" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;