import { useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, Video as VideoIcon, Users2, Mic, Video, PhoneOff } from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";

const FEATURES = [
  { icon: Zap, title: "Instant Meetings", desc: "Create and join meetings in seconds." },
  { icon: ShieldCheck, title: "Secure Connection", desc: "Connect with confidence through secure communication." },
  { icon: VideoIcon, title: "HD Video Calls", desc: "Experience clear and smooth video conversations." },
  { icon: Users2, title: "Easy Collaboration", desc: "Bring your team together from anywhere." },
];

const STEPS = [
  { n: "01", title: "Create an Account" },
  { n: "02", title: "Create or Join a Meeting" },
  { n: "03", title: "Start Connecting" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700">
            Simple. Secure. Connected.
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl">
            Meet Better.
            <br />
            Connect Faster.
          </h1>
          <p className="mt-5 max-w-md text-base text-slate-500">
            Create secure video meetings and connect with your team from anywhere with a simple
            and seamless experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigate("/register")} className="btn-primary px-6 py-3 text-base">
              Start a Meeting
            </button>
            <button onClick={() => navigate("/join")} className="btn-secondary px-6 py-3 text-base">
              Join a Meeting
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="card p-4">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-indigo-700">
                <span className="text-2xl font-bold text-white/90">VK</span>
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-700">
                <span className="text-lg font-bold text-white/90">RS</span>
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                <span className="text-lg font-bold text-white/90">PS</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-slate-800 py-2.5">
              <Mic className="h-4 w-4 text-white" />
              <Video className="h-4 w-4 text-white" />
              <PhoneOff className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          Everything you need to meet
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 transition-shadow hover:shadow-soft">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">How It Works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="text-4xl font-extrabold text-primary-100">{s.n}</span>
                <p className="mt-2 text-sm font-semibold text-slate-700">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <VideoIcon className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-700">MeetFlow</span>
          </div>
          <p className="text-xs text-slate-400">&copy; 2026 MeetFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
