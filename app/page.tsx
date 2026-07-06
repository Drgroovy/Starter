"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Phrase = {
  id: string;
  category: string;
  english: string;
  japanese: string;
  romaji: string;
  easyPronunciation: string;
  note: string;
  politeness: string;
  tags: string[];
};

type Place = {
  id: string;
  label: string;
  destination: string;
  category: string;
  defaultTravelMode: string;
  notes: string;
};

type Food = {
  id: string;
  name: string;
  description: string;
  why: string;
  search: string;
};

type Expense = {
  id: string;
  category: string;
  yen: number;
  usd: number;
  notes: string;
  date: string;
};

type JournalEntry = {
  id: string;
  date: string;
  mood: string;
  bestFood: string;
  weirdestThing: string;
  notes: string;
};

const APP_CONFIG = {
  tripName: "A Groovy and Stupid Trip to Osaka",
  travelers: ["Groovy", "Stupid"],
  hotelName: "Hotel Code Shinsaibashi",
  hotelAddressEnglish: "Hotel Code Shinsaibashi, Osaka, Japan",
  hotelAddressJapanese: "ホテルコード心斎橋 大阪 日本",
  hotelPhone: "Add hotel phone",
  savedGoogleMapUrl:
    "https://www.google.com/maps/d/edit?mid=1tXATlMWovoMcwuU6AhvkeRwZNcTQxw0&ll=34.64877085835829%2C135.53980695000004&z=11",
  defaultMapTravelMode: "walking",
  defaultCity: "Osaka, Japan",
};

const navTiles = [
  ["weather", "Weather Radar", "Live-ish umbrella logic and radar launch.", "☂"],
  ["map", "Groovy Map", "Saved map, directions, bathrooms, food roulette.", "⌖"],
  ["phrases", "Stupid Words to Say", "Phrasebook with big-screen rescue mode.", "あ"],
  ["identify", "What the Fuck Is This Thing?", "Camera placeholder for confusing objects.", "?"],
  ["food", "Food Quest", "Track the sacred snack checklist.", "◉"],
  ["sumo", "Sumo Days", "Arena plan, etiquette, phrases, and checklist.", "力"],
  ["budget", "Budget Tracker", "Yen totals without spreadsheet suffering.", "¥"],
  ["packing", "Packing List", "Do not forget the important machines.", "✓"],
  ["journal", "Daily Journal", "Remember the excellent nonsense.", "✎"],
  ["emergency", "Emergency Information", "Hotel, numbers, and stress buttons.", "!"],
];

const foods: Food[] = [
  ["takoyaki", "Takoyaki", "Octopus balls with sauce and bonito flakes.", "The Osaka classic. Hot enough to humble you.", "takoyaki near me"],
  ["okonomiyaki", "Okonomiyaki", "Savory pancake with cabbage, sauce, mayo, and joy.", "A mandatory Osaka dinner.", "okonomiyaki near me"],
  ["kushikatsu", "Kushikatsu", "Fried skewers of many little treasures.", "Crunchy, cheap, and built for indecision.", "kushikatsu near me"],
  ["ramen", "Ramen", "Noodles in rich broth.", "Comfort bowl after too many steps.", "ramen near me"],
  ["udon", "Udon", "Thick noodles, simple broth, maximum calm.", "For when your soul needs soup.", "udon near me"],
  ["soba", "Soba", "Buckwheat noodles hot or cold.", "Clean, quick, reliable.", "soba near me"],
  ["sushi", "Sushi", "The obvious one, still worth doing.", "Because Japan.", "sushi near me"],
  ["conveyor-sushi", "Conveyor belt sushi", "Sushi arrives by tiny train or belt.", "Low pressure and high entertainment.", "conveyor belt sushi near me"],
  ["curry", "Japanese curry", "Thick curry over rice.", "Cozy and hard to mess up.", "Japanese curry near me"],
  ["katsu-curry", "Katsu curry", "Curry with fried pork cutlet.", "A boss-level plate.", "katsu curry near me"],
  ["yakitori", "Yakitori", "Grilled chicken skewers.", "Tiny smoky victories.", "yakitori near me"],
  ["yakiniku", "Yakiniku", "Grill-your-own meat.", "Dinner plus activity.", "yakiniku near me"],
  ["onigiri", "Onigiri", "Rice ball from a convenience store.", "Breakfast, snack, emergency brick.", "onigiri near me"],
  ["egg-sando", "Egg sandwich", "Convenience store egg sandwich.", "Soft, cheap, legendary.", "egg sandwich convenience store near me"],
  ["famichiki", "FamilyMart chicken", "Fried chicken from FamilyMart.", "A travel rite.", "FamilyMart chicken near me"],
  ["lawson-chicken", "Lawson chicken", "Fried chicken from Lawson.", "For rigorous scientific comparison.", "Lawson chicken near me"],
  ["melon-pan", "Melon pan", "Sweet crunchy bread.", "Looks melon-ish, tastes bakery-ish.", "melon pan near me"],
  ["taiyaki", "Taiyaki", "Fish-shaped pastry with filling.", "Cute snack technology.", "taiyaki near me"],
  ["gyoza", "Gyoza", "Pan-fried dumplings.", "Always a correct side quest.", "gyoza near me"],
  ["mystery-drink", "Mystery vending machine drink", "Unknown beverage from a glowing machine.", "Because curiosity must pay rent.", "vending machine drinks near me"],
].map(([id, name, description, why, search]) => ({
  id,
  name,
  description,
  why,
  search,
}));

const packingGroups = {
  Documents: ["Passport", "Flight info", "Hotel info", "Travel insurance", "Medication list"],
  Money: ["Cash yen", "Credit card", "Debit card", "Coin pouch", "ATM backup plan"],
  Medication: ["Daily medications", "CPAP", "CPAP power supply", "CPAP mask", "CPAP letter if needed"],
  Tech: ["Phone", "Charger", "Power bank", "Charging cable", "Plug adapter", "eSIM info", "Headphones"],
  "Daily Carry": ["Wallet", "Passport copy", "Battery pack", "Sunglasses", "Small trash bag", "Foldable shopping bag", "Hand sanitizer"],
  "Weather Gear": ["Compact umbrella", "Light jacket", "Comfortable shoes", "Blister patches"],
};

const sumoChecklist = [
  "Tickets",
  "Cash",
  "Phone battery",
  "Camera",
  "Snacks",
  "Train route checked",
  "Merchandise budget",
];

const categories = [
  "Food",
  "Drinks",
  "Train",
  "Sumo",
  "Souvenirs",
  "Convenience store",
  "Emergency",
  "Other",
];

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

function mapDirections(destination: string, mode = "walking") {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}&travelmode=${mode}`;
}

function mapSearch(query: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

export default function Home() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [phraseQuery, setPhraseQuery] = useState("");
  const [bigPhrase, setBigPhrase] = useState<Phrase | null>(null);
  const [favorites, setFavorites] = useLocalState<string[]>("osaka-favorite-phrases", []);
  const [foodDone, setFoodDone] = useLocalState<Record<string, boolean>>("osaka-food-done", {});
  const [packingDone, setPackingDone] = useLocalState<Record<string, boolean>>("osaka-packing-done", {});
  const [sumoDone, setSumoDone] = useLocalState<Record<string, boolean>>("osaka-sumo-done", {});
  const [expenses, setExpenses] = useLocalState<Expense[]>("osaka-expenses", []);
  const [journalEntries, setJournalEntries] = useLocalState<JournalEntry[]>("osaka-journal", []);
  const [rate, setRate] = useLocalState("osaka-rate", "155");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState("walking");
  const [foodPick, setFoodPick] = useState("Surprise Me");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/data/phrases.json").then((response) => response.json()).then(setPhrases);
    fetch("/data/places.json").then((response) => response.json()).then(setPlaces);
  }, []);

  const favoritePhrases = phrases.filter((phrase) => favorites.includes(phrase.id));
  const filteredPhrases = useMemo(() => {
    const source = phraseQuery.trim().toLowerCase();
    if (!source) return phrases;
    return phrases.filter((phrase) =>
      [
        phrase.english,
        phrase.japanese,
        phrase.romaji,
        phrase.easyPronunciation,
        phrase.category,
        phrase.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(source),
    );
  }, [phraseQuery, phrases]);

  const groupedPhrases = useMemo(() => {
    return filteredPhrases.reduce<Record<string, Phrase[]>>((groups, phrase) => {
      groups[phrase.category] = [...(groups[phrase.category] ?? []), phrase];
      return groups;
    }, {});
  }, [filteredPhrases]);

  const expenseTotal = expenses.reduce((total, expense) => total + Number(expense.yen || 0), 0);

  function submitDirections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (destination.trim()) window.open(mapDirections(destination, travelMode), "_blank");
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const yen = Number(form.get("yen") || 0);
    if (!yen) return;
    setExpenses([
      {
        id: crypto.randomUUID(),
        category: String(form.get("category")),
        yen,
        usd: Number((yen / Number(rate || 155)).toFixed(2)),
        notes: String(form.get("notes") || ""),
        date: new Date().toISOString().slice(0, 10),
      },
      ...expenses,
    ]);
    event.currentTarget.reset();
  }

  function addJournal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setJournalEntries([
      {
        id: crypto.randomUUID(),
        date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
        mood: String(form.get("mood") || "Still alive"),
        bestFood: String(form.get("bestFood") || ""),
        weirdestThing: String(form.get("weirdestThing") || ""),
        notes: String(form.get("notes") || ""),
      },
      ...journalEntries,
    ]);
    event.currentTarget.reset();
  }

  function copyText(label: string, text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  function openBathroomSearch(query = "public toilet near Namba Osaka") {
    if (!navigator.geolocation) {
      window.open(mapSearch(query), "_blank");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => window.open(`https://www.google.com/maps/search/public+toilet/@${coords.latitude},${coords.longitude},17z`, "_blank"),
      () => window.open(mapSearch(query), "_blank"),
      { enableHighAccuracy: false, timeout: 3500 },
    );
  }

  function pickFood() {
    const options = ["ramen", "sushi", "curry", "kushikatsu", "okonomiyaki", "izakaya", "cheap eats", "spicy food"];
    const selected = foodPick === "Surprise Me" ? options[Math.floor(Math.random() * options.length)] : foodPick;
    window.open(mapSearch(`${selected} near me Osaka`), "_blank");
  }

  return (
    <main className="app-shell">
      <header className="app-header" id="home">
        <a className="brand" href="#home" aria-label="Return home">
          <span className="brand-mark">GS</span>
          <span>{APP_CONFIG.tripName}</span>
        </a>
        <a className="header-button" href="#emergency">SOS</a>
      </header>

      <section className="hero">
        <div className="hero-art" aria-label="CSS illustration of Osaka at night">
          <div className="moon" />
          <div className="sign sign-one">たこ</div>
          <div className="sign sign-two">OSAKA</div>
          <div className="sign sign-three">ラーメン</div>
          <div className="river" />
          <div className="skyline" />
        </div>
        <p className="eyebrow">Private travel command center</p>
        <h1>{APP_CONFIG.tripName}</h1>
        <p className="tagline">Two idiots. One city. Many bowls of ramen.</p>
        <div className="quick-actions">
          <a href="#map">Open Map</a>
          <a href="#phrases">Phrases</a>
          <a href="#emergency">Emergency</a>
        </div>
      </section>

      <section className="nav-grid" aria-label="Travel tools">
        {navTiles.map(([href, title, description, icon]) => (
          <a className="tool-tile" href={`#${href}`} key={href}>
            <span className="tile-icon">{icon}</span>
            <strong>{title}</strong>
            <small>{description}</small>
          </a>
        ))}
      </section>

      <ToolSection id="weather" title="Weather Radar" description="Umbrella decision station for Osaka weather weirdness.">
        <div className="weather-card">
          <div>
            <span className="status-dot" />
            <strong>Umbrella logic</strong>
            <p>40%+ rain soon: bring it. 20-39%: compact umbrella. Under 20%: probably safe. Storms: do not be brave.</p>
          </div>
          <a className="button" href="https://www.windy.com/?34.6937,135.5023,10" target="_blank" rel="noreferrer">Open Full Radar</a>
          <a className="button secondary" href="https://www.google.com/search?q=Osaka+hourly+weather" target="_blank" rel="noreferrer">Open Osaka Weather</a>
        </div>
      </ToolSection>

      <ToolSection id="map" title="Groovy Map" description="Saved map, directions, bathrooms, and food when brains are offline.">
        <a className="button full" href={APP_CONFIG.savedGoogleMapUrl} target="_blank" rel="noreferrer">Open Groovy and Stupid Osaka Map</a>
        <form className="stack-form" onSubmit={submitDirections}>
          <label htmlFor="destination">Where are we going?</label>
          <input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Restaurant, station, arena, hotel..." />
          <div className="segmented" aria-label="Travel mode">
            {["walking", "transit", "driving"].map((mode) => (
              <button className={travelMode === mode ? "active" : ""} key={mode} onClick={() => setTravelMode(mode)} type="button">{mode}</button>
            ))}
          </div>
          <button className="button" type="submit">Launch Directions</button>
        </form>
        <div className="place-grid">
          {places.map((place) => (
            <a className="mini-card" href={mapDirections(place.destination, place.defaultTravelMode)} key={place.id} target="_blank" rel="noreferrer">
              <strong>{place.label}</strong>
              <small>{place.notes}</small>
            </a>
          ))}
        </div>
        <div className="button-row">
          <button className="button danger" onClick={() => openBathroomSearch()} type="button">Bathroom Finder</button>
          <a className="button secondary" href={mapSearch("convenience stores near me")} target="_blank" rel="noreferrer">Convenience Stores</a>
          <a className="button secondary" href={mapSearch("department stores near me Osaka")} target="_blank" rel="noreferrer">Department Stores</a>
        </div>
        <div className="food-picker">
          <label htmlFor="foodPick">Where Should We Eat?</label>
          <select id="foodPick" value={foodPick} onChange={(event) => setFoodPick(event.target.value)}>
            {["Surprise Me", "ramen", "sushi", "curry", "kushikatsu", "okonomiyaki", "izakaya", "cheap eats", "spicy food"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button className="button" onClick={pickFood} type="button">Pick Food Nearby</button>
        </div>
      </ToolSection>

      <ToolSection id="phrases" title="Stupid Words to Say" description="Search by intent, favorite the lifesavers, and show huge text when pronunciation betrays you.">
        <input className="search" value={phraseQuery} onChange={(event) => setPhraseQuery(event.target.value)} placeholder="Search bathroom, beer, ticket, spicy, help..." />
        {copied && <p className="toast">{copied} copied.</p>}
        {favoritePhrases.length > 0 && (
          <PhraseGroup title="Favorites" phrases={favoritePhrases} favorites={favorites} setFavorites={setFavorites} setBigPhrase={setBigPhrase} copyText={copyText} />
        )}
        {Object.entries(groupedPhrases).map(([category, items]) => (
          <PhraseGroup title={category} phrases={items} favorites={favorites} key={category} setFavorites={setFavorites} setBigPhrase={setBigPhrase} copyText={copyText} />
        ))}
      </ToolSection>

      <ToolSection id="identify" title="What the Fuck Is This Thing?" description="A future photo-identification station for confusing objects, signs, snacks, shrines, and alleged foods.">
        <div className="upload-placeholder">
          <span>?</span>
          <p>Camera and upload interface placeholder. Later this can connect to a vision API and answer: should I touch it, eat it, bow to it, or flee politely?</p>
          <a className="button" href="#home">Open App Placeholder</a>
        </div>
      </ToolSection>

      <ToolSection id="food" title="Food Quest" description="Track the Osaka food list. Local saves stay on this phone.">
        <div className="food-list">
          {foods.map((food) => (
            <article className="check-card" key={food.id}>
              <label>
                <input checked={Boolean(foodDone[food.id])} onChange={(event) => setFoodDone({ ...foodDone, [food.id]: event.target.checked })} type="checkbox" />
                <span>{food.name}</span>
              </label>
              <p>{food.description}</p>
              <small>{food.why}</small>
              <a className="button secondary" href={mapSearch(food.search)} target="_blank" rel="noreferrer">Find This Near Me</a>
            </article>
          ))}
        </div>
      </ToolSection>

      <ToolSection id="sumo" title="Sumo Days" description="Edion Arena plan, etiquette, and the things that keep sumo day from dissolving.">
        <a className="button full" href={mapDirections("Edion Arena Osaka, Osaka, Japan", "walking")} target="_blank" rel="noreferrer">Take Me to Edion Arena</a>
        <div className="note-grid">
          <InfoCard title="What to expect" body="Long day, ritual, crowd rhythm, sudden bursts of force. Arrive early enough to wander without panic." />
          <InfoCard title="Etiquette" body="Stay seated during bouts, keep flash off, follow staff directions, cheer like a delighted human." />
          <InfoCard title="Exit plan" body="Assume crowds. Pick a meetup spot before leaving the seats and check the train route before the final match." />
        </div>
        <Checklist items={sumoChecklist} done={sumoDone} setDone={setSumoDone} />
      </ToolSection>

      <ToolSection id="budget" title="Budget Tracker" description="Manual yen tracking with a flexible exchange-rate field.">
        <label className="inline-label">Yen per USD <input value={rate} onChange={(event) => setRate(event.target.value)} inputMode="decimal" /></label>
        <form className="stack-form" onSubmit={addExpense}>
          <select name="category">{categories.map((category) => <option key={category}>{category}</option>)}</select>
          <input name="yen" inputMode="numeric" placeholder="Amount in yen" />
          <input name="notes" placeholder="Notes" />
          <button className="button" type="submit">Add Expense</button>
        </form>
        <div className="total-card">
          <strong>Trip total</strong>
          <span>¥{expenseTotal.toLocaleString()} / ${Number(expenseTotal / Number(rate || 155)).toFixed(2)}</span>
        </div>
        {expenses.map((expense) => (
          <div className="expense-row" key={expense.id}>
            <span>{expense.category}</span>
            <strong>¥{expense.yen.toLocaleString()}</strong>
            <small>{expense.notes}</small>
          </div>
        ))}
      </ToolSection>

      <ToolSection id="packing" title="Packing List" description="The pre-flight ritual, saved on this device.">
        {Object.entries(packingGroups).map(([group, items]) => (
          <details className="details-card" key={group} open>
            <summary>{group}</summary>
            <Checklist items={items} done={packingDone} prefix={group} setDone={setPackingDone} />
          </details>
        ))}
      </ToolSection>

      <ToolSection id="journal" title="Daily Journal" description="Tiny memory trap for food, weather, weirdness, and victory notes.">
        <form className="stack-form" onSubmit={addJournal}>
          <input name="date" type="date" />
          <input name="mood" placeholder="Mood" />
          <input name="bestFood" placeholder="Best food" />
          <input name="weirdestThing" placeholder="Weirdest thing seen" />
          <textarea name="notes" placeholder="Notes" rows={4} />
          <button className="button" type="submit">Save Journal Entry</button>
        </form>
        <button className="button secondary" onClick={() => copyText("Journal export", JSON.stringify(journalEntries, null, 2))} type="button">Export JSON</button>
        {journalEntries.map((entry) => (
          <article className="mini-card" key={entry.id}>
            <strong>{entry.date} · {entry.mood}</strong>
            <small>{entry.bestFood && `Best food: ${entry.bestFood}`}</small>
            <p>{entry.notes}</p>
          </article>
        ))}
      </ToolSection>

      <ToolSection id="emergency" title="Emergency Information" description="Large, boring, useful information for stressful moments.">
        <div className="emergency-grid">
          <InfoCard title="Police" body="110" />
          <InfoCard title="Ambulance / Fire" body="119" />
          <InfoCard title="Hotel" body={`${APP_CONFIG.hotelName}. ${APP_CONFIG.hotelAddressEnglish}. ${APP_CONFIG.hotelAddressJapanese}. Phone: ${APP_CONFIG.hotelPhone}.`} />
          <InfoCard title="US Consulate" body="Add final consulate address and phone before travel." />
          <InfoCard title="Medication / Allergies" body="Add medications, CPAP details, allergies, and emergency contact." />
          <InfoCard title="Lost Passport" body="File a police report, contact the US consulate, bring ID copies and photos if available." />
        </div>
        <button className="button danger" onClick={() => copyText("Hotel address", `${APP_CONFIG.hotelName}\n${APP_CONFIG.hotelAddressEnglish}\n${APP_CONFIG.hotelAddressJapanese}`)} type="button">Copy Hotel Address</button>
        <a className="button full" href={mapDirections(APP_CONFIG.hotelAddressEnglish, "walking")} target="_blank" rel="noreferrer">Open Hotel in Google Maps</a>
      </ToolSection>

      <footer className="footer">
        <a href="#home">Return Home</a>
        <span>Built light: no heavy photos, no tracking, local saves.</span>
      </footer>

      {bigPhrase && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button className="close-button" onClick={() => setBigPhrase(null)} type="button">Close</button>
            <strong>{bigPhrase.japanese}</strong>
            <p>{bigPhrase.english}</p>
            <span>{bigPhrase.romaji}</span>
            <em>{bigPhrase.easyPronunciation}</em>
          </div>
        </div>
      )}
    </main>
  );
}

function ToolSection({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="tool-section" id={id}>
      <div className="section-heading">
        <a href="#home">Return Home</a>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function PhraseGroup({ title, phrases, favorites, setFavorites, setBigPhrase, copyText }: {
  title: string;
  phrases: Phrase[];
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  setBigPhrase: (phrase: Phrase) => void;
  copyText: (label: string, text: string) => void;
}) {
  return (
    <details className="details-card phrase-details" open={title === "Favorites" || title === "Survival Basics"}>
      <summary>{title} <span>{phrases.length}</span></summary>
      <div className="phrase-list">
        {phrases.map((phrase) => {
          const starred = favorites.includes(phrase.id);
          return (
            <article className={`phrase-card ${phrase.politeness === "urgent" ? "urgent" : ""}`} key={phrase.id}>
              <div>
                <h3>{phrase.english}</h3>
                <strong>{phrase.japanese}</strong>
                <p>{phrase.romaji}</p>
                <em>{phrase.easyPronunciation}</em>
                <small>{phrase.note}</small>
              </div>
              <div className="phrase-actions">
                <button onClick={() => copyText("Japanese", phrase.japanese)} type="button">Copy JP</button>
                <button onClick={() => copyText("Pronunciation", phrase.easyPronunciation)} type="button">Copy Say</button>
                <button onClick={() => setBigPhrase(phrase)} type="button">Show Big</button>
                <button aria-pressed={starred} onClick={() => setFavorites(starred ? favorites.filter((id) => id !== phrase.id) : [...favorites, phrase.id])} type="button">
                  {starred ? "Starred" : "Star"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </details>
  );
}

function Checklist({ items, done, setDone, prefix = "" }: { items: string[]; done: Record<string, boolean>; setDone: (done: Record<string, boolean>) => void; prefix?: string }) {
  return (
    <div className="checklist">
      {items.map((item) => {
        const key = `${prefix}-${item}`;
        return (
          <label key={key}>
            <input checked={Boolean(done[key])} onChange={(event) => setDone({ ...done, [key]: event.target.checked })} type="checkbox" />
            <span>{item}</span>
          </label>
        );
      })}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="info-card">
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}
