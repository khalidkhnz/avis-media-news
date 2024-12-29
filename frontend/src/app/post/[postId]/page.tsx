import { PostDoc } from "@/api/post.service";
import Preview from "@/components/Preview";
import { CONFIG } from "@/lib/config";
import React from "react";

interface Props {
  params: any;
}

const Page = async ({ params }: Props) => {
  const postId = params.postId;

  const postData: { data: PostDoc; success: boolean } = await fetch(
    `${CONFIG.API_BASE_URL}/posts/${postId}`,
    {
      cache: "force-cache",
      next: { tags: [`post-${postId}`] },
    }
  ).then((r) => r.json());

  if (!postData || !postData?.success) return "Error fetching post";

  return (
    <div className="">
      <h1>{postData.data.title}</h1>
      <p>{postData.data.description}</p>
      <Preview delta={JSON.parse(postData.data.delta)} />
    </div>
  );
};

export default Page;
