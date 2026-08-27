import { useState } from "react";
import { Pencil, Mail, User as UserIcon, Shield } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Modal from "../components/common/Modal.jsx";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { getInitials } from "../utils/helpers.js";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateProfile(form);
    setLoading(false);
    setIsEditing(false);
    showToast("Profile updated successfully");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-800">Profile</h1>

      <div className="mt-6 card flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
          {getInitials(user?.name)}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <Button variant="secondary" icon={Pencil} onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <UserIcon className="h-4.5 w-4.5 text-primary-600" /> Personal Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Full Name</span>
              <span className="font-medium text-slate-700">{user?.name}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-700">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Shield className="h-4.5 w-4.5 text-primary-600" /> Account Settings
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Two-Factor Auth</span>
              <span className="font-medium text-slate-400">Off</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-500">Email Notifications</span>
              <span className="font-medium text-slate-400">On</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Full Name"
            icon={UserIcon}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email Address"
            icon={Mail}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Button onClick={handleSave} loading={loading} className="w-full">
            Save Changes
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
