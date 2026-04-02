'use client';

import { useState, useEffect } from 'react';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // Conversion rate from PKR base
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  PK: { code: 'PKR', symbol: 'PKR', rate: 1 },
  DEFAULT: { code: 'USD', symbol: '$', rate: 0.0036 }, // ~1 USD = 278 PKR
};

function formatPrice(pkrAmount: number, currency: CurrencyInfo): string {
  if (currency.code === 'PKR') {
    return `PKR ${pkrAmount.toLocaleString('en-PK')}`;
  }
  const converted = Math.round(pkrAmount * currency.rate);
  return `$${converted.toLocaleString('en-US')}`;
}

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES.PK);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string>('PK');

  useEffect(() => {
    const cached = sessionStorage.getItem('cubico_country');
    if (cached) {
      const c = cached === 'PK' ? CURRENCIES.PK : CURRENCIES.DEFAULT;
      setCurrency(c);
      setCountry(cached);
      setLoading(false);
      return;
    }

    // Use a free geolocation API
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      .then((res) => res.json())
      .then((data) => {
        const code = data?.country_code || 'PK';
        const c = code === 'PK' ? CURRENCIES.PK : CURRENCIES.DEFAULT;
        setCurrency(c);
        setCountry(code);
        sessionStorage.setItem('cubico_country', code);
      })
      .catch(() => {
        // Default to PKR on failure
        setCurrency(CURRENCIES.PK);
        setCountry('PK');
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    currency,
    country,
    loading,
    isPakistan: country === 'PK',
    format: (pkrAmount: number) => formatPrice(pkrAmount, currency),
  };
}
