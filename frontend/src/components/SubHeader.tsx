import React from "react";

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

const SubHeader = () => {
  return (
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
  );
};

export default SubHeader;
