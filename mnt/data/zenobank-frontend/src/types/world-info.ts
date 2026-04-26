export type CityTime = {
  city: string;
  country: string;
  timezone: string;
  flag: string;
  time: string;
  date: string;
  offset: string;
};

export type ExchangeRate = {
  code: string;
  name: string;
  flagEmoji: string;
  rateToAZN: number;     // 1 AZN = neçə bu valyuta
  aznToThis: number;     // 1 bu valyuta = neçə AZN
};

export type WeatherData = {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  icon: string;
};