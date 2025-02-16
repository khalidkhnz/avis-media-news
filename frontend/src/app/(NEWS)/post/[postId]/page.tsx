import { PostDoc } from "@/api/post.service";
import Preview from "@/components/Preview";
import { CONFIG } from "@/lib/config";
import React from "react";

interface Props {
  params: Promise<{
    postId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const postId = (await params).postId;

  const postData: { data?: PostDoc; success?: boolean } = await fetch(
    `${CONFIG.API_BASE_URL}/posts-v2/${postId}`,
    {
      cache: "no-cache",
      next: { tags: [`post-${postId}`] },
    }
  )
    .then((r) => r.json())
    .catch((err) => console.log(err));

  if (!postData || !postData?.success) return "Error fetching post";

  return (
    <div className="bg-white p-2 pt-6">
      <h1 className="text-2xl font-bold text-neutral-600 pb-2">
        {postData?.data?.title || ""}
      </h1>
      <p className="line-clamp-2 font-normal text-xs text-neutral-800 mb-8">
        {postData?.data?.description || ""}
      </p>
      <Preview delta={JSON.parse(postData?.data?.delta || "")} />
    </div>
  );
};

export default Page;
