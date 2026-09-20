import React, { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'stayfinder_currency';
const CurrencyContext = createContext(null);

function getInitialCurrency() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || 'NGN';
  } catch {
    return 'NGN';
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(getInitialCurrency);

  const setCurrency = (nextCurrency) => {
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(STORAGE_KEY, nextCurrency);
  };

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used inside a CurrencyProvider.');
  }

  return context;
}
