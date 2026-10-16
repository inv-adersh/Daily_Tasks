import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen md:pl-64">
        <Header />

        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;