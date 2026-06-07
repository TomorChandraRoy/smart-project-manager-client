import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import swal from "sweetalert";

const SignIn = () => {
  // Auth Context and Navigation Hook
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const { register,handleSubmit,reset,getValues,setValue,trigger,formState: { errors }} = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form Submission
  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password, data.rememberMe);
      const userName =
        result?.user?.name || result?.user?.displayName || "User";
      const userRole = result?.user?.role?.toLowerCase();

      swal(`Welcome, ${userName}!`, "Successfully SignIn", "success");
      reset();

      if (userRole === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (userRole === "project manager") {
        navigate("/create-project", { replace: true });
      } else if (userRole === "team member") {
        navigate("/my-tasks", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const errorMessage =
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found"
          ? "Email And Password Not Correct!"
          : "Invalid email or password";
      swal("Error", errorMessage, "error");
    }
  };

  // Password show/hide state
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    //Getting value from email input field of form
    const email = getValues("email");

    // Triggering to check if email input is valid
    const isEmailValid = await trigger("email");

    if (!isEmailValid || !email) {
      swal("Oops!", "Please enter your email address first.", "warning");
      return;
    }

    try {
      await forgotPassword(email);
      swal(
        "Success",
        "Password reset link has been sent to your email!",
        "success",
      );
    } catch (err) {
      swal("Error", err.message || "Something is wrong.", "error");
    }
  };

  // HandleDemoLogin — Just fill in the email/password field, click Sign in to log in.
  const handleDemoLogin = (role) => {
    if (role?.toLowerCase() === "admin") {
      setValue("email", "admin@project.com");
      setValue("password", "admin123");
    } else if (role?.toLowerCase() === "project manager") {
      setValue("email", "manager@gmail.com");
      setValue("password", "manager571");
    } else if (role?.toLowerCase() === "team member") {
      setValue("email", "member@project.com");
      setValue("password", "member123");
    }
    trigger(["email", "password"]); // validation trigger
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-4 px-4 md:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md mx-auto shadow-sm md:p-8 lg:mx-0">
            <div className="mb-8">
              <h1 className="text-slate-900 text-3xl font-bold mb-4">
                Sign in
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Sign in to your account to access your dashboard and manage your
                projects.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                  id="email"
                  placeholder="john@readymadeui.com"
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    id="password"
                    placeholder="••••••••"
                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-start flex-wrap gap-2">
                <label className="flex items-center group has-[input:checked]:text-slate-900 cursor-pointer">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="sr-only"
                  />
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-slate-300 bg-white group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600"
                    aria-hidden="true"
                  >
                    <svg
                      className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 5l3 3 7-7" />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm text-slate-700">
                    Remember me
                  </span>
                </label>

                {/*handleForgotPassword'*/}
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="ml-auto text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded bg-transparent border-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Sign in
              </button>

              <div className="text-slate-900 text-sm text-center">
                Don't have an account?
                <Link
                  to="/signup"
                  className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Sign up
                </Link>
                <hr className="my-6 border-gray-300" />
                <div className="space-y-2 ">
                  <p className="text-xs text-center text-gray-500 font-semibold">
                    QUICK DEMO LOGIN
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin("admin")}
                      className="bg-red-100 text-red-700 text-xs p-2 rounded cursor-pointer hover:bg-red-200 transition"
                    >
                      ⚡ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin("project manager")}
                      className="bg-green-100 text-green-700 text-xs p-2 rounded cursor-pointer hover:bg-green-200 transition"
                    >
                      💼 Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin("team member")}
                      className="bg-purple-100 text-purple-700 text-xs p-2 rounded cursor-pointer hover:bg-purple-200 transition"
                    >
                      🧑‍💻 Member
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="aspect-71/50 max-lg:w-4/5 mx-auto">
            <img
              src="https://readymadeui.com/images/integration-illus.webp"
              className="w-full object-cover"
              alt="login img"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
