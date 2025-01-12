import { cn } from "@/lib/utils";
import { Fragment } from "react";
import Weather from "@/components/Weather";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const subHeaders = [
    { label: "Home" },
    { label: "Delhi Election 2025" },
    { label: "Games" },
    { label: "HT Photo Contest" },
    { label: "HomLong Weekend Planner 2025" },
    { label: "Cricket" },
    { label: "HT Premium" },
    { label: "Horoscope 2025" },
    { label: "India" },
    { label: "World" },
    { label: "Astrology" },
    { label: "Lifestyle" },
    { label: "Education" },
    { label: "Trending" },
    { label: "Business" },
    { label: "Bhopal" },
    { label: "Latest News" },
    { label: "Latest News" },
  ];

  return (
    <Fragment>
      <main className="bg-neutral-200 pt-2">
        <div className="flex items-center justify-end px-4 mx-auto w-[99%] bg-[#011E29]/95 text-white rounded-b-lg h-10">
          <div className="text-sm flex gap-2 font-semibold">
            <span>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            <Weather />
          </div>
        </div>
        <div className="bg-gradient-to-tr text-white from-[#011E29] to-[#001F29] w-[99%] flex items-center justify-center mx-auto rounded-t-lg p-2 border-[2px] h-[120px] ">
          <div className="mx-auto text-[52px]">
            {false ? `ανιѕ мє∂ια` : `𝔄𝔳𝔦𝔰 𝔐𝔢𝔡𝔦𝔞`}
          </div>
        </div>
        <div className="shadow-sm hide_scrollbar z-50 bg-white px-4 overflow-auto gap-10 flex items-center justify-around w-[99%] mx-auto rounded-b-lg sticky top-0 h-[40px] border-[2px]">
          {subHeaders?.map((subHeader, idx) => {
            return (
              <div
                key={`${idx}-${subHeader.label}`}
                className="text-[#011E29] cursor-pointer hover:underline text-xs font-semibold text-nowrap"
              >
                {subHeader.label}
              </div>
            );
          })}
        </div>
        <div className="border-b-2 my-2" />
        <div className="flex gap-2 max-w-[1800px] justify-center mx-auto">
          <SideCategoryBar position="left" />
          <div className="md:min-w-[800px] w-full max-w-[900px] shadow-md">
            {children}
            <section className="bg-white border-t-[2px] p-2">
              <FeaturedPost />
            </section>
          </div>
          <SideCategoryBar position="right" />
        </div>
        <footer className="bg-white p-2 rounded-t-lg mt-4 border-[2px] w-full h-[200px]">
          footer
        </footer>
      </main>
    </Fragment>
  );
};

function FeaturedPost() {
  return <div>FeaturedPost</div>;
}

function SideCategoryBar({ position }: { position: "left" | "right" }) {
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
      <SideBarHeading />
      {Array.from({ length: 20 })
        .fill(0)
        .map((_, idx) => {
          return <SideBarCard key={`Right-SideBarCard-key-${idx}`} />;
        })}
    </div>
  );
}

function SideBarHeading() {
  return (
    <div className="flex items-center text-nowrap justify-center font-serif font-bold text-md mt-2">
      <span className="w-[100%]  flex flex-col gap-[2px]">
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
      </span>
      <span className="text-[#2ea4d3]">[</span>
      <span className="">TOP NEWS</span>
      <span className="text-[#2ea4d3]">]</span>
      <span className="w-[100%]  flex flex-col gap-[2px]">
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
      </span>
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

export default layout;
