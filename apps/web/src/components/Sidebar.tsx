import { BarChart3, Bell, FileText, FolderOpen, Search, Users } from "lucide-react";

const nav = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Clients", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Reminders", icon: Bell },
  { label: "AI Search", icon: Search },
  { label: "Workflows", icon: FolderOpen }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-line bg-white px-4 py-6 lg:block">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">FlowOps AI</p>
        <h1 className="mt-2 text-xl font-semibold text-ink">Operations Hub</h1>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-mist"
              key={item.label}
              title={item.label}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

