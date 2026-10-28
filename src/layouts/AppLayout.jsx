import { useState } from "react";
import { Outlet } from "react-router";

import AppSidebar from "../components/layout/AppSidebar";
import Topbar from "../components/layout/Topbar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <AppSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="min-h-screen lg:pl-[272px]">
        <Topbar onMenuClick={openSidebar} />

        <main className="mx-auto min-h-[calc(100vh-76px)] max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
