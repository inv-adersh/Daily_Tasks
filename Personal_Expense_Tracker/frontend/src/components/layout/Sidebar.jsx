import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
} from "lucide-react";

const navigationItems = [
  {name: "Dashboard", path: "/",icon: LayoutDashboard},
  {name: "Transactions", path: "/transactions",icon: ArrowLeftRight},
  {name: "Budgets",path: "/budgets",icon: Wallet,},
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <ChartNoAxesCombined size={25} />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Finance Flow
          </h1>

          <p className="text-xs text-slate-400">
            Personal finance
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              // end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-white/10 p-5">
        <p className="text-xs text-slate-500">
          Personal Finance Tracker
        </p>

        
      </div>
    </aside>
  );
}

export default Sidebar;