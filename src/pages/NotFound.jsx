import { useNavigate } from "react-router-dom";
import ButtonComponent from "../components/common/Button.jsx";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-7xl font-extrabold text-primary-100">404</p>
      <h1 className="mt-2 text-xl font-bold text-slate-800">Page Not Found</h1>
      <p className="mt-1.5 text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <ButtonComponent onClick={() => navigate("/dashboard")} className="mt-6">
        Back to Dashboard
      </ButtonComponent>
    </div>
  );
}
