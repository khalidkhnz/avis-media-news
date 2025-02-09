"use client";

import { PostService } from "@/api/post.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Assets from "@/lib/Assets";
import { NotebookPen, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

const Page = () => {
  const router = useRouter();

  const nav = [
    {
      label: "Add Post",
      onClick: () => router.push("/cms/editor?type=CREATE"),
    },
  ];

  const { data, isLoading } = useSWR("posts", () => PostService.getAllPosts());

  return (
    <div className="bg-neutral-700 w-full h-screen flex flex-col">
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>{" "}
      <div className="bg-neutral-900 px-10 text-white p-2 h-[60px] flex items-center">
        <h1 className="text-3xl">Manage Posts</h1>
      </div>
      <div className="flex justify-end items-center bg-neutral-800 px-4 text-white p-2 h-[70px]">
        {nav.map((navItem) => (
          <Button
            className="w-[200px] h-[40px] text-md"
            key={navItem.label}
            onClick={navItem.onClick}
          >
            {navItem.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 p-5 overflow-y-auto hide_scrollbar max-w-[1280px] mx-auto">
        {Array.from({ length: 20 })
          .fill(dummy)
          .map((post: any, idx) => {
            return (
              <Card
                key={idx}
                className="relative transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer w-[400px] h-[400px] flex flex-col border-none bg-neutral-800 rounded-none"
              >
                <div className="relative w-full h-[300px] bg-black">
                  <Image
                    src={post.thumbnail}
                    fill
                    alt="thumbnail"
                    className="object-contain"
                  />
                </div>
                <div className="p-2 text-white">
                  <h1 className="line-clamp-1 text-md">
                    Title: {post.heading}
                  </h1>
                  <p className="line-clamp-3 text-xs">
                    Meta: {post.description}
                  </p>
                </div>
                <div className="z-50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 w-full h-full bg-[#000000a1] absolute left-0 top-0">
                  <NotebookPen className="w-10 h-10 text-white hover:scale-125" />
                  <Trash className="w-10 h-10 text-white hover:scale-125 hover:text-red-500" />
                </div>
                <Checkbox className="z-50 absolute top-2 left-2 bg-neutral-600 data-[state=checked]:bg-purple-700" />
              </Card>
            );
          })}
      </div>
    </div>
  );
};

const dummy = {
  heading: "Lorem ipsum dolor sit, amet consectetur",
  description:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis doloremque earum nulla esse eum aut, voluptate cupiditate, recusandae sint, exercitationem laboriosam illum fugiat aperiam inventore quisquam corrupti eius facilis dicta.",
  thumbnail: Assets.DUMMY,
};

export default Page;
