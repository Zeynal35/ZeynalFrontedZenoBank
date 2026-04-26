import { useEffect, useState } from 'react';
import type { CityTime } from '@/types/world-info';

const CITIES = [
  { city: 'Bakı',      country: 'Azərbaycan', timezone: 'Asia/Baku',             flag: '🇦🇿' },
  { city: 'London',    country: 'Böyük Britaniya', timezone: 'Europe/London',    flag: '🇬🇧' },
  { city: 'İstanbul',  country: 'Türkiyə',    timezone: 'Europe/Istanbul',        flag: '🇹🇷' },
  { city: 'Moskva',    country: 'Rusiya',      timezone: 'Europe/Moscow',         flag: '🇷🇺' },
  { city: 'Dubai',     country: 'BƏƏ',         timezone: 'Asia/Dubai',            flag: '🇦🇪' },
  { city: 'Nyu-York',  country: 'ABŞ',         timezone: 'America/New_York',      flag: '🇺🇸' },
  { city: 'Tokyo',     country: 'Yaponiya',    timezone: 'Asia/Tokyo',            flag: '🇯🇵' },
  { city: 'Paris',     country: 'Fransa',      timezone: 'Europe/Paris',          flag: '🇫🇷' },
];

function formatCity(tz: string, flag: string, city: string, country: string): CityTime {
  const now = new Date();

  const time = new Intl.DateTimeFormat('az-AZ', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const date = new Intl.DateTimeFormat('az-AZ', {
    timeZone: tz,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(now);

  // UTC offset hesabla
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate  = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const diffMin = (tzDate.getTime() - utcDate.getTime()) / 60000;
  const sign    = diffMin >= 0 ? '+' : '-';
  const h       = Math.floor(Math.abs(diffMin) / 60).toString().padStart(2, '0');
  const m       = (Math.abs(diffMin) % 60).toString().padStart(2, '0');
  const offset  = `UTC${sign}${h}:${m}`;

  return { city, country, timezone: tz, flag, time, date, offset };
}

export function useWorldClock() {
  const [cities, setCities] = useState<CityTime[]>(
    CITIES.map((c) => formatCity(c.timezone, c.flag, c.city, c.country))
  );

  useEffect(() => {
    const tick = () =>
      setCities(CITIES.map((c) => formatCity(c.timezone, c.flag, c.city, c.country)));

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return cities;
}