import Sidebar from "./Sidebar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
