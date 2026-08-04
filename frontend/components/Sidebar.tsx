import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Calculator,
  Home,
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";

type SidebarProps = {
  activePage?: "dashboard" | "behorden-finder" | "kostenrechner" | "mietrechts-checker" | string;
};

const NAV = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "behorden-finder", label: "Behörden-Finder", href: "/behorden-finder", icon: Search },
  { id: "kostenrechner", label: "Kostenrechner", href: "/kostenrechner", icon: Calculator },
  { id: "mietrechts-checker", label: "Mietrechts-Checker", href: "/mietrechts-checker", icon: Home },
  { id: "brief-analysieren", label: "Brief analysieren", href: "/#brief-analysieren", icon: FileText },
  { id: "rechte-coach", label: "Rechte-Coach", href: "/#rechte-coach", icon: HelpCircle },
];

export default function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-sidebar px-4 py-6 lg:flex z-30">
      <div className="mb-8 flex items-center gap-2 px-2">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-seal">
            <ShieldCheck className="text-white" size={18} />
          </span>
          <span className="font-body text-base font-semibold text-white">
            CivicAI
          </span>
        </a>
      </div>

      <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        Arbeitsbereich
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ id, label, href, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <a
              key={id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-hover text-white font-medium"
                  : "text-white/60 hover:bg-sidebar-hover hover:text-white/90"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/50 hover:bg-sidebar-hover hover:text-white/90"
        >
          <Settings size={16} strokeWidth={2} />
          Einstellungen
        </a>
      </div>
    </aside>
  );
}
