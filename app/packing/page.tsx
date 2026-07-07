"use client";

import { useEffect, useState } from "react";

const packingGroups = {
  Documents: ["Passport", "Flight info", "Hotel info", "Travel insurance", "Medication list"],
  Money: ["Cash yen", "Credit card", "Debit card", "Coin pouch", "ATM backup plan"],
  Medication: ["Daily medications", "CPAP", "CPAP power supply", "CPAP mask", "CPAP letter if needed"],
  Tech: ["Phone", "Charger", "Power bank", "Charging cable", "Plug adapter", "eSIM info", "Headphones"],
  "Daily Carry": ["Wallet", "Passport copy", "Battery pack", "Sunglasses", "Small trash bag", "Foldable shopping bag", "Hand sanitizer"],
  "Weather Gear": ["Compact umbrella", "Light jacket", "Comfortable shoes", "Blister patches"],
};

function useLocalState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export default function PackingPage() {
  const [packingDone, setPackingDone] = useLocalState<Record<string, boolean>>("osaka-packing-done", {});
  const totalItems = Object.values(packingGroups).flat().length;
  const packedItems = Object.values(packingDone).filter(Boolean).length;

  return (
    <main className="app-shell packing-page">
      <header className="app-header">
        <a className="brand" href="/">
          <span className="brand-mark">JP</span>
          <span>A Groovy and Stupid Trip to Osaka</span>
        </a>
        <a className="header-button" href="/">
          Home
        </a>
      </header>

      <section className="hero">
        <p className="eyebrow">Pre-flight checklist</p>
        <h1>Packing List</h1>
        <p className="tagline">A separate checklist page for the things that should absolutely make it into the bag.</p>
        <div className="total-card">
          <p>Packed</p>
          <span>
            {packedItems} / {totalItems}
          </span>
          <small className="status-note">Saved on this device.</small>
        </div>
      </section>

      <section className="tool-section" id="packing">
        <div className="section-heading">
          <p>Packing</p>
          <h2>Do not forget the important machines.</h2>
        </div>
        {Object.entries(packingGroups).map(([group, items]) => (
          <details className="details-card" key={group} open>
            <summary>{group}</summary>
            <div className="checklist">
              {items.map((item) => (
                <label key={item}>
                  <input
                    checked={Boolean(packingDone[item])}
                    onChange={(event) => setPackingDone({ ...packingDone, [item]: event.target.checked })}
                    type="checkbox"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </details>
        ))}
      </section>

      <footer className="footer">
        <span>Offline-friendly checklist.</span>
        <a href="/">Back to dashboard</a>
      </footer>
    </main>
  );
}
