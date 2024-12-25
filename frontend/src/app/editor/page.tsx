"use client";

import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/QuillEditor"));

export default function Home() {
  return (
    <div className="h-screen">
      <QuillEditor />
    </div>
  );
}
