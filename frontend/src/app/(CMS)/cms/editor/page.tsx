"use client";

import Preview from "@/components/Preview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Delta } from "quill";
import { useState } from "react";
import { useFormik } from "formik";
import { PostService } from "@/api/post.service";

const QuillEditor = dynamic(() => import("@/components/QuillEditor"));

type EditorType = "CREATE" | "UPDATE";

export default function Home() {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId");
  const type: EditorType = searchParams?.get("type") as EditorType;

  const [delta, setDelta] = useState<Delta | undefined>();

  const fk = useFormik({
    initialValues: {
      title: "",
      description: "",
      thumbnail: "",
      delta: "",
    },
    async onSubmit(values) {
      console.log({ values });
      const response = await PostService.createPost(values);
      console.log({ response });
    },
  });

  async function uploadImageAndReplaceWithURL(delta: Delta) {
    const updatedOps = await Promise.all(
      delta.ops.map(async (op: any, idx) => {
        if (op.insert?.image) {
          console.log("INDEX: ", idx);
          console.log(op.insert?.image);
          // Simulate an image upload and URL replacement
          const newImageUrl =
            "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
          return {
            ...op,
            insert: {
              ...op.insert,
              image: newImageUrl,
            },
          };
        }
        return op;
      })
    );

    const newDelta = new Delta(updatedOps);
    setDelta(newDelta);
    return newDelta;
  }

  async function handleSave(deltaVal: Delta) {
    const newDelta = await uploadImageAndReplaceWithURL(deltaVal);
    fk.setFieldValue("delta", JSON.stringify(newDelta));
    fk.handleSubmit();
  }

  return (
    <div className="min-h-screen">
      <div className="p-2">
        <h1 className="text-2xl font-semibold">
          {type === "CREATE" ? `Create Post` : `Update Post - ${postId}`}
        </h1>
      </div>
      <div className="p-2 w-full gap-2 flex-col flex flex-wrap">
        <Input
          value={fk.values.title}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="title"
          placeholder="Post Heading"
        />
        <Input
          value={fk.values.thumbnail}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="thumbnail"
          placeholder="Thumbnail URL"
        />
        <Textarea
          value={fk.values.description}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="description"
          placeholder="Description"
        />
      </div>
      <QuillEditor
        initialDelta={delta}
        onPreview={(deltaVal) => setDelta(deltaVal)}
        onSave={handleSave}
      />
      {delta && (
        <div className="w-full">
          <h1 className="p-4 text-xl w-full text-center">PREVIEW</h1>
          <Preview delta={delta} />
        </div>
      )}
    </div>
  );
}
