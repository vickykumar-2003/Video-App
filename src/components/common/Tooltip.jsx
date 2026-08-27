export default function Tooltip({ label, children }) {
  return (
    <div className="group relative flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}
