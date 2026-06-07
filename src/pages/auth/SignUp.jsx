import { useState } from "react";
import { useForm } from "react-hook-form";
import { UsePhoto } from "../../api/imageHosting";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import swal from "sweetalert";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {register,handleSubmit,watch, formState: { errors }, reset} = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    },
  });

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form Submit Handler
  const onSubmit = async (data) => {
    try {
      let uploadedImgURL = "";

      if (data.avatar && data.avatar.length > 0) {
        const imgFile = data.avatar[0];
        uploadedImgURL = await UsePhoto(imgFile);
      }

      const payload = {
        name: data.fullName,
        email: data.email,
        role: data.role,
        password: data.password,
        avatar: uploadedImgURL,
      };
      await api.post("/userdata", payload);

      // Automatically login the user after successful signup
      const result = await login(data.email, data.password, false);
      const userRole = result?.user?.role?.toLowerCase();

      swal(
        "Success",
        "Registration Successful! Welcome to the Dashboard.",
        "success",
      );
      reset();

      // Redirect based on role
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
      const backendMessage =
      error.response?.data?.message || "Something went wrong during signup.";
      swal("Error", backendMessage, "error");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center lg:h-screen p-4 md:p-8">
      <div className="grid md:grid-cols-5 items-center gap-y-8 bg-white border border-slate-200 max-w-6xl w-full shadow-[0_2px_10px_-3px_rgba(116,119,125,0.3)] rounded-lg overflow-hidden">
        <div className="flex flex-col justify-center order-1 p-6  w-full h-full md:col-span-2 md:-order-1 md:p-8">
          <img
            src="https://readymadeui.com/signin-image.webp"
            className="lg:max-w-3/4 w-full h-full aspect-square object-contain block mx-auto"
            alt="login-image"
          />
          <div className="text-slate-900 text-sm text-center">
            Already have an account?
            <Link
              to="/signin"
              className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="p-6 w-full md:col-span-3 sm:p-8">
          <div className="mb-10">
            <h1 className="text-slate-900 text-2xl font-bold">
              Create an account
            </h1>
          </div>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  placeholder="John Doe"
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="john@example.com"
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="••••••••"
                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="••••••••"
                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((c) => !c)}
                    className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* System Role */}
              <div>
                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                  System Role
                </label>
                <select
                  {...register("role", { required: "Please select a role" })}
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                >
                  <option value="">Select a Role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Team Member">Team Member</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Profile Picture */}
              <div>
                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                  Profile Picture (File)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
