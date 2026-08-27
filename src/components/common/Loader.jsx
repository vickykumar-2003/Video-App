import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-7 w-7 animate-spin text-primary-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">{content}</div>;
  }
  return <div className="flex items-center justify-center py-12">{content}</div>;
}
