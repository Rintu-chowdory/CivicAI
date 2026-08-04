import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  HelpCircle,
  PenLine,
  Clock,
  Settings,
  Calculator,
  Building2,
  Euro,
  Home,
  Lock,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Arbeitsbereich",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
      { label: "Brief analysieren", icon: FileText, href: "/#brief-analysieren" },
      { label: "Rechte-Coach", icon: HelpCircle, href: "/#rechte-coach" },
      { label: "Antwort erstellen", icon: PenLine, href: "/#antwort-erstellen" },
      { label: "Meine Vorgänge", icon: Clock, href: "/#meine-vorgaenge" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Fristen-Rechner", icon: Calculator, href: "/fristen-rechner" },
      { label: "Behörden-Finder", icon: Building2, href: "/behorden-finder" },
      { label: "Kostenrechner", icon: Euro, href: "/kostenrechner" },
      { label: "Mietrechts-Checker", icon: Home, href: "/mietrechts-checker" },
    ],
  },
  {
    title: "Rechtliches",
    items: [
      { label: "Datenschutz", icon: Lock, href: "/datenschutz" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-sidebar px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-seal">
          <ShieldCheck className="text-white" size={18} />
        </span>
        <span className="font-body text-base font-semibold text-white">
          CivicAI
        </span>
      </div>

      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            {section.title}
          </p>
          <nav className="flex flex-col gap-0.5">
            {section.items.map(({ label, icon: Icon, href, active }) => (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-hover text-white"
                    : "text-white/60 hover:bg-sidebar-hover hover:text-white/90"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      ))}

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
