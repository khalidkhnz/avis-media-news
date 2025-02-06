"use client";

import { Fragment } from "react";
import WeatherHeader from "./WeatherHeader";
import SubHeader from "./SubHeader";
import { useSidebar } from "./Sidebar";
import Logo from "./Logo";

export default function Header() {
  const { SidebarBurger } = useSidebar();

  return (
    <Fragment>
      <WeatherHeader />
      <div className="relative bg-gradient-to-tr text-white from-[#011E29] to-[#001F29] w-[99%] flex items-center justify-center mx-auto rounded-t-lg p-2 border-[2px] h-[120px] ">
        <SidebarBurger className="absolute left-4 top-4" />
        <Logo />
      </div>
      <SubHeader />
      <div className="border-b-2 my-2" />
    </Fragment>
  );
}
