import { useEffect, useState } from 'react';
import type { ExchangeRate } from '@/types/world-info';

const CURRENCIES = [
  { code: 'USD', name: 'ABŞ Dolları',    flagEmoji: '🇺🇸' },
  { code: 'EUR', name: 'Avro',            flagEmoji: '🇪🇺' },
  { code: 'TRY', name: 'Türk Lirəsi',    flagEmoji: '🇹🇷' },
  { code: 'GBP', name: 'Britaniya Funtu', flagEmoji: '🇬🇧' },
  { code: 'RUB', name: 'Rus Rublu',       flagEmoji: '🇷🇺' },
  { code: 'AED', name: 'BƏƏ Dirhəmi',    flagEmoji: '🇦🇪' },
];

// Open-source, API key tələb etmir
const API_URL = 'https://open.er-api.com/v6/latest/AZN';

export function useExchangeRates() {
  const [rates, setRates]       = useState<ExchangeRate[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const fetch_ = async () => {
      try {
        setLoading(true);
        const res  = await fetch(API_URL);
        const json = await res.json();

        if (!mounted) return;

        const result: ExchangeRate[] = CURRENCIES.map((cur) => {
          const rateToAZN = json.rates[cur.code] ?? 0; // 1 AZN = X foreign
          return {
            ...cur,
            rateToAZN,
            aznToThis: rateToAZN > 0 ? 1 / rateToAZN : 0,
          };
        });

        setRates(result);
        setUpdatedAt(new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }));
        setError(null);
      } catch {
        if (mounted) setError('Məzənnə məlumatı alınamadı');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch_();
    const id = setInterval(fetch_, 60 * 60 * 1000); // hər 1 saatda bir yenilə
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return { rates, loading, error, updatedAt };
}