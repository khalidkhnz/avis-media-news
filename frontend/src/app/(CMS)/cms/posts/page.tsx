"use client";

import dynamic from "next/dynamic";
import React from "react";

function Page() {
  const EditorComponent = dynamic(() => import("./Editor"), { ssr: false });
  return <EditorComponent />;
}

export default Page;
