import DashboardNavbar from "@/components/modules/DashboardLayout/DashboardNavbar";
import DashboardSidebar from "@/components/modules/DashboardLayout/DashboardSidebar";
import React from "react";

const RootDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* dashboard sidebar */}
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* dashboard navbar */}
        <DashboardNavbar />
        {/* dashboard content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootDashboardLayout;
