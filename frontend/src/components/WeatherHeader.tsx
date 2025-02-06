import React from "react";
import Weather from "./Weather";

const WeatherHeader = () => {
  return (
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
  );
};

export default WeatherHeader;
