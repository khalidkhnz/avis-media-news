import CmsSidebar from "@/components/CmsSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full">
      <CmsSidebar>{children}</CmsSidebar>
    </main>
  );
};
export default Layout;
