"use client";

import Preview from "@/components/Preview";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Delta } from "quill";
import { useState } from "react";

const QuillEditor = dynamic(() => import("@/components/QuillEditor"));

export default function Home() {
  const postId = useSearchParams()?.get("postId");
  const [delta, setDelta] = useState<Delta | undefined>();

  return (
    <div className="h-screen">
      <QuillEditor
        initialDelta={delta}
        onPreview={(deltaVal) => setDelta(deltaVal)}
        onSave={(deltaVal) => setDelta(deltaVal)}
      />
      <Preview delta={delta} />
    </div>
  );
}
