import { useEffect, useState } from 'react';
import type { WeatherData } from '@/types/world-info';

// Open-Meteo — tamamilə pulsuz, API key yoxdur
const CITIES_WEATHER = [
  { city: 'Bakı',     lat: 40.4093, lon: 49.8671 },
  { city: 'London',   lat: 51.5074, lon: -0.1278  },
  { city: 'İstanbul', lat: 41.0082, lon: 28.9784  },
];

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Aydın',           icon: '☀️'  },
  1:  { label: 'Az buludlu',      icon: '🌤️'  },
  2:  { label: 'Yarı buludlu',    icon: '⛅'  },
  3:  { label: 'Buludlu',         icon: '☁️'  },
  45: { label: 'Duman',           icon: '🌫️'  },
  48: { label: 'Duman',           icon: '🌫️'  },
  51: { label: 'Çiskin',          icon: '🌦️'  },
  53: { label: 'Çiskin',          icon: '🌦️'  },
  61: { label: 'Yağış',           icon: '🌧️'  },
  63: { label: 'Yağış',           icon: '🌧️'  },
  71: { label: 'Qar',             icon: '❄️'  },
  80: { label: 'Leysan yağış',    icon: '⛈️'  },
  95: { label: 'Güclü tufan',     icon: '🌩️'  },
};

function getCondition(code: number) {
  return WMO_CODES[code] ?? { label: 'Məlum deyil', icon: '🌡️' };
}

export function useWeather() {
  const [weather, setWeather]   = useState<WeatherData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const promises = CITIES_WEATHER.map(async ({ city, lat, lon }) => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh`;
          const res  = await fetch(url);
          const json = await res.json();
          const cur  = json.current;
          const cond = getCondition(cur.weather_code);

          return {
            city,
            temp:          Math.round(cur.temperature_2m),
            feelsLike:     Math.round(cur.apparent_temperature),
            condition:     cond.label,
            conditionCode: cur.weather_code,
            humidity:      cur.relative_humidity_2m,
            windSpeed:     Math.round(cur.wind_speed_10m),
            icon:          cond.icon,
          } satisfies WeatherData;
        });

        const results = await Promise.all(promises);
        if (mounted) { setWeather(results); setError(null); }
      } catch {
        if (mounted) setError('Hava məlumatı alınamadı');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 15 * 60 * 1000); // hər 15 dəqiqədə
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return { weather, loading, error };
}