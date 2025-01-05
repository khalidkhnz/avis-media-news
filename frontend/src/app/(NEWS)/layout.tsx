import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="">
      <div className="p-4 max-w-[1200px] h-[200px] mx-auto">Header</div>
      <div className="border-b-2 my-2" />
      <div className="flex gap-1 max-w-[1200px] mx-auto">
        <div>{children}</div>
        <div className="min-w-[260px] border-2 p-2">right Sidebar</div>
      </div>
    </main>
  );
};

export default layout;
