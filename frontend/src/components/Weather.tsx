"use client";

import { fetchTemperature } from "@/api/actions/weather.action";
import useGeoLocation from "@/hooks/useGeoLocation";
import React from "react";
import useSWR from "swr";

const Weather = () => {
  const { lat, long } = useGeoLocation();

  const { data: weather, isLoading } = useSWR(`${lat}-${long}`, async () => {
    return await fetchTemperature({
      lat,
      long,
    });
  });

  const temperature = weather?.weather.temp.cur;

  if (isLoading || isNaN(temperature) || typeof temperature !== "number") {
    return <></>;
  }

  return (
    <span>
      {temperature
        ? (((temperature - 32) * 5) / 9).toFixed(1) + "°C"
        : "Loading..."}
    </span>
  );
};

export default Weather;
