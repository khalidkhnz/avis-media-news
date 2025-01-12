"use server";

import { OpenWeatherAPI } from "openweather-api-node";

const cache: any = {};

const ONE_HOUR = 1000 * 60 * 60 * 1;

export const fetchTemperature = async ({
  lat,
  long,
}: {
  lat: string | number;
  long: string | number;
}) => {
  const cacheKey = `${lat},${long}`;
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].lastFetchTime < ONE_HOUR
  ) {
    console.log("WEATHER FROM CACHE");
    return cache[cacheKey].data;
  }

  let weather = new OpenWeatherAPI({
    key: "6488ef4ac3c95718debb66483ed1f79d",
    units: "imperial",
    lang: "en",
    coordinates: {
      lat: typeof lat === "string" ? parseInt(lat) : lat,
      lon: typeof long === "string" ? parseInt(long) : long,
    },
  });

  const data = await weather.getCurrent();
  cache[cacheKey] = { data, lastFetchTime: Date.now() };
  return data;
};
