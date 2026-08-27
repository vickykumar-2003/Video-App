import { Link, useNavigate } from "react-router-dom";
import { Video } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Video className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-800">MeetFlow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600">
            Home
          </Link>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600">
            Features
          </a>
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">
            Login
          </Link>
        </div>

        <button onClick={() => navigate("/register")} className="btn-primary">
          Get Started
        </button>
      </nav>
    </header>
  );
}
