import { useLocation } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const pageDetails = {
  "/": {
    title: "Dashboard",
    description: "Your financial overview at a glance.",
  },
  "/transactions": {
    title: "Transactions",
    description: "Track and manage your income and expenses.",
  },
  "/budgets": {
    title: "Budgets",
    description: "Plan your spending and stay within your limits.",
  },
};

function Header() {
  const location = useLocation();

  const currentPage = pageDetails[location.pathname] ?? pageDetails["/"];

  const todayDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {currentPage.title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {currentPage.description}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 sm:self-auto">
        <CalendarDays size={17} className="text-indigo-600" />

        <span>{todayDate}</span>
      </div>
    </header>
  );
}

export default Header;