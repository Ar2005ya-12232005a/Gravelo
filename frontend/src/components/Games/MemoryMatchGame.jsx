import React, { useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

const DAILY_DECKS = [
  ['🚧', '🛣️', '⚠️', '🚦', '📏', '🔍', '🛞', '🏗️'],
  ['🚛', '🛤️', '🧭', '🔦', '🧱', '📐', '⛽', '🛑'],
  ['🌉', '🚜', '📡', '🧰', '🪨', '🚨', '🗺️', '⚙️'],
];

function buildBoard(dayOffset) {
  const symbols = DAILY_DECKS[dayOffset % DAILY_DECKS.length];
  return [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, idx) => ({ id: idx, symbol }));
}

export default function MemoryMatchGame({
  dayOffset = 0,
  dayNumber = '',
  darkmode = false,
  onComplete,
}) {
  const [cards, setCards] = useState(() => buildBoard(dayOffset));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const cardSurface = darkmode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].symbol === cards[b].symbol) {
        const updatedMatched = [...matched, a, b];
        setMatched(updatedMatched);
        setFlipped([]);
        if (updatedMatched.length === cards.length && onComplete) {
          onComplete();
        }
      } else {
        setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  const reset = () => {
    setCards(buildBoard(dayOffset));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const won = matched.length === cards.length;

  return (
    <div className={`w-full p-6 md:p-8 rounded-2xl border space-y-6 ${cardSurface}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
            Memory Match • Day {dayNumber}
          </span>
          <h3 className="text-xl md:text-2xl font-bold mt-1">Pair Match Grid</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold px-3.5 py-2 rounded-xl border border-current/15">
            Pairs: {matched.length / 2} / {cards.length / 2}
          </div>
          <div className="text-sm font-semibold px-3.5 py-2 rounded-xl border border-current/15">
            Moves: {moves}
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold hover:border-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
            Shuffle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 md:gap-4 max-w-3xl mx-auto">
        {cards.map((card, idx) => {
          const isMatched = matched.includes(idx);
          const isOpen = flipped.includes(idx) || isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(idx)}
              className={`h-24 md:h-28 rounded-2xl border-2 text-4xl flex items-center justify-center font-bold transition-all ${
                isMatched
                  ? 'border-emerald-500 bg-emerald-500/15 scale-[0.99]'
                  : isOpen
                  ? 'border-blue-500 bg-blue-500/15'
                  : darkmode
                  ? 'border-gray-700 bg-gray-800 hover:border-blue-500'
                  : 'border-gray-300 bg-gray-100 hover:border-blue-500'
              }`}
            >
              {isOpen ? card.symbol : '•'}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center gap-2 text-emerald-500 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Completed in {moves} moves</span>
        </div>
      )}
    </div>
  );
}