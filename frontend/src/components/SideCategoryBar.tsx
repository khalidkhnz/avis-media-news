import { cn } from "@/lib/utils";
import Headings from "./Headings";

export default function SideCategoryBar({
  position,
}: {
  position: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "shadow-2xl hidden hide_scrollbar sticky overflow-y-auto md:flex flex-col gap-8 top-[50px] h-[calc(100vh-65px)] bg-white w-[260px] p-2",
        {
          "rounded-l-md": position === "left",
          "rounded-r-md": position === "right",
        }
      )}
    >
      <Headings>TOP NEWS</Headings>
      {Array.from({ length: 20 })
        .fill(0)
        .map((_, idx) => {
          return <SideBarCard key={`Right-SideBarCard-key-${idx}`} />;
        })}
    </div>
  );
}

function SideBarCard() {
  return (
    <div className="flex cursor-pointer flex-col gap-2 leading-4">
      <h4 className="font-bold hover:underline text-[#2ea4d3]">WORLD NEWS</h4>
      <p className="hover:underline text-[12px] font-[600] line-clamp-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
        sapiente?
      </p>
      <span className="text-neutral-500 text-[13px]">Updated 1 hour ago</span>
    </div>
  );
}
