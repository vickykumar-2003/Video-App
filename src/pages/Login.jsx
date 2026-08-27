import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Video } from "lucide-react";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail } from "../utils/helpers.js";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email is required";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Video className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-800">MeetFlow</span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-slate-500">Enter your details to access your meetings.</p>

          {formError && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              rightElement={
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Remember me
              </label>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-800 lg:flex">
        <div className="max-w-md px-10 text-center text-white">
          <h2 className="text-3xl font-bold">Your meetings, always in sync.</h2>
          <p className="mt-4 text-primary-100">
            Pick up right where you left off across every device.
          </p>
        </div>
      </div>
    </div>
  );
}
