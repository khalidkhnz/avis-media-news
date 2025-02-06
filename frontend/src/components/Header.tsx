import { Fragment } from "react";
import WeatherHeader from "./WeatherHeader";
import Logo from "./Logo";
import SubHeader from "./SubHeader";

export default function Header() {
  return (
    <Fragment>
      <WeatherHeader />
      <div className="bg-gradient-to-tr text-white from-[#011E29] to-[#001F29] w-[99%] flex items-center justify-center mx-auto rounded-t-lg p-2 border-[2px] h-[120px] ">
        <Logo />
      </div>
      <SubHeader />
      <div className="border-b-2 my-2" />
    </Fragment>
  );
}
