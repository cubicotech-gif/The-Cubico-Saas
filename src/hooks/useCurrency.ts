'use client';

import { useState, useEffect } from 'react';

export interface PriceInput {
  pkr: number;
  usd: number;
}

function formatPrice(input: PriceInput | number, isPakistan: boolean): string {
  // Back-compat: a bare number is treated as a PKR amount that we roughly
  // convert if the visitor is international. Prefer passing { pkr, usd }.
  if (typeof input === 'number') {
    if (isPakistan) return `PKR ${input.toLocaleString('en-PK')}`;
    const converted = Math.round(input * 0.0036);
    return `$${converted.toLocaleString('en-US')}`;
  }
  return isPakistan
    ? `PKR ${input.pkr.toLocaleString('en-PK')}`
    : `$${input.usd.toLocaleString('en-US')}`;
}

export function useCurrency() {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string>('PK');

  useEffect(() => {
    const cached = sessionStorage.getItem('cubico_country');
    if (cached) {
      setCountry(cached);
      setLoading(false);
      return;
    }

    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      .then((res) => res.json())
      .then((data) => {
        const code = data?.country_code || 'PK';
        setCountry(code);
        sessionStorage.setItem('cubico_country', code);
      })
      .catch(() => setCountry('PK'))
      .finally(() => setLoading(false));
  }, []);

  const isPakistan = country === 'PK';

  return {
    country,
    loading,
    isPakistan,
    currencyCode: isPakistan ? 'PKR' : 'USD',
    format: (input: PriceInput | number) => formatPrice(input, isPakistan),
  };
}
