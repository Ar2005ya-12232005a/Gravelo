import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, ArrowLeft, Play } from 'lucide-react';
import MovingStopGame from './MovingStopGame';
import MemoryMatchGame from './MemoryMatchGame';
import CircuitPuzzleGame from './CircuitPuzzleGame';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getLocalDateKey(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDayEditions() {
  const editions = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    editions.push({
      offset: i,
      key: getLocalDateKey(i),
      label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
    });
  }
  return editions;
}

const GAMES = [
  {
    id: 'moving-stop',
    title: 'Moving Stop',
    description: 'Stop the sliding marker inside the target zone across each round.',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Flip and pair matching tiles across the board.',
  },
  {
    id: 'circuit-puzzle',
    title: 'Circuit Path',
    description: 'Rotate junction tiles to connect IN to OUT.',
  },
];

function GamePreviewThumbnail({ gameId, darkmode }) {
  const boxBg = darkmode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200';

  if (gameId === 'moving-stop') {
    return (
      <div className={`w-44 h-20 rounded-xl border p-3 flex flex-col justify-center shrink-0 ${boxBg}`}>
        <div className="relative w-full h-5 rounded-md bg-gray-900/20 overflow-hidden flex items-center">
          <div className="w-10 h-full ml-12 bg-emerald-500/30 border-x border-emerald-500" />
          <div className="absolute left-7 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
        </div>
        <span className="text-[11px] font-semibold opacity-70 mt-1.5">Precision Track</span>
      </div>
    );
  }

  if (gameId === 'memory-match') {
    return (
      <div className={`w-44 h-20 rounded-xl border p-2.5 grid grid-cols-4 gap-1.5 shrink-0 ${boxBg}`}>
        <div className="rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs">
          🚧
        </div>
        <div className="rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
          🚦
        </div>
        <div className="rounded border border-current/15 flex items-center justify-center text-[10px] font-bold opacity-60">
          •
        </div>
        <div className="rounded border border-current/15 flex items-center justify-center text-[10px] font-bold opacity-60">
          •
        </div>
        <div className="rounded border border-current/15 flex items-center justify-center text-[10px] font-bold opacity-60">
          •
        </div>
        <div className="rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs">
          🚧
        </div>
        <div className="rounded border border-current/15 flex items-center justify-center text-[10px] font-bold opacity-60">
          •
        </div>
        <div className="rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
          🚦
        </div>
      </div>
    );
  }

  return (
    <div className={`w-44 h-20 rounded-xl border p-2.5 flex items-center justify-center gap-1.5 shrink-0 ${boxBg}`}>
      <span className="text-[10px] font-extrabold text-amber-500">IN</span>
      <div className="grid grid-cols-3 gap-1">
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/60" />
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/60" />
        <div className="w-4 h-4 rounded border border-current/20" />
        <div className="w-4 h-4 rounded border border-current/20" />
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/60" />
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/60" />
      </div>
      <span className="text-[10px] font-extrabold text-emerald-500">OUT</span>
    </div>
  );
}

// Counts consecutive calendar days on which a puzzle was actually completed
function computeCompletionStreak(completedDates) {
  const todayKey = getLocalDateKey(0);
  const yesterdayKey = getLocalDateKey(1);

  let startOffset = null;
  if (completedDates[todayKey] === true) {
    startOffset = 0;
  } else if (completedDates[yesterdayKey] === true) {
    startOffset = 1;
  } else {
    return 0;
  }

  let streak = 0;
  for (let offset = startOffset; offset < 365; offset++) {
    if (completedDates[getLocalDateKey(offset)] === true) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export default function GamesPage({ darkmode = false }) {
  const editions = getDayEditions();
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [activeGame, setActiveGame] = useState(null);

  const [state, setState] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('gravelo_daily_games_v5') || 'null');
      if (parsed && typeof parsed === 'object') {
        return {
          completedPuzzles: parsed.completedPuzzles || {},
          completedDates: parsed.completedDates || {},
        };
      }
    } catch {}
    return { completedPuzzles: {}, completedDates: {} };
  });

  useEffect(() => {
    try {
      localStorage.setItem('gravelo_daily_games_v5', JSON.stringify(state));
    } catch {}
  }, [state]);

  const currentEdition = editions[selectedOffset];
  const previousEditions = editions.slice(1);
  const streak = computeCompletionStreak(state.completedDates);

  const handleGameCompleted = (gameId) => {
    const puzzleKey = `${currentEdition.key}_${gameId}`;
    const actualCompletionDay = getLocalDateKey(0);

    setState((prev) => ({
      completedPuzzles: {
        ...prev.completedPuzzles,
        [puzzleKey]: true,
      },
      completedDates: {
        ...prev.completedDates,
        [actualCompletionDay]: true,
      },
    }));
  };

  const cardSurface = darkmode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';
  const muted = darkmode ? 'text-gray-400' : 'text-gray-600';

  if (activeGame) {
    return (
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveGame(null)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition ${
              darkmode
                ? 'border-gray-700 hover:bg-gray-800 text-gray-200'
                : 'border-gray-300 hover:bg-gray-100 text-gray-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Daily Games
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedOffset(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                selectedOffset === 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : darkmode
                  ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {editions[0].label}
            </button>
            <span className={`text-xs font-semibold mx-1 ${muted}`}>Previous Problems:</span>
            {previousEditions.map((ed) => (
              <button
                key={ed.key}
                type="button"
                onClick={() => setSelectedOffset(ed.offset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  selectedOffset === ed.offset
                    ? 'bg-blue-600 text-white border-blue-600'
                    : darkmode
                    ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {ed.label}
              </button>
            ))}
          </div>
        </div>

        {activeGame === 'moving-stop' && (
          <MovingStopGame
            key={`${currentEdition.key}-stop`}
            dayOffset={selectedOffset}
            dayNumber={currentEdition.label}
            darkmode={darkmode}
            onComplete={() => handleGameCompleted('moving-stop')}
          />
        )}

        {activeGame === 'memory-match' && (
          <MemoryMatchGame
            key={`${currentEdition.key}-mem`}
            dayOffset={selectedOffset}
            dayNumber={currentEdition.label}
            darkmode={darkmode}
            onComplete={() => handleGameCompleted('memory-match')}
          />
        )}

        {activeGame === 'circuit-puzzle' && (
          <CircuitPuzzleGame
            key={`${currentEdition.key}-cir`}
            dayOffset={selectedOffset}
            dayNumber={currentEdition.label}
            darkmode={darkmode}
            onComplete={() => handleGameCompleted('circuit-puzzle')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header + Streak */}
      <div className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardSurface}`}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Games</h2>
          <p className={`text-sm mt-1 ${muted}`}>Welcome back.</p>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
            darkmode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
          }`}
        >
          <Flame className="w-6 h-6 text-orange-500" />
          <div>
            <div className="text-lg font-extrabold leading-none">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </div>
            <div className={`text-xs mt-0.5 ${muted}`}>Streak</div>
          </div>
        </div>
      </div>

      {/* Current Edition + Previous Problems */}
      <div className={`px-5 py-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${cardSurface}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold">Edition:</span>
          <button
            type="button"
            onClick={() => setSelectedOffset(0)}
            className={`px-3.5 py-1.5 rounded-xl border text-sm font-bold transition ${
              selectedOffset === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : darkmode
                ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {editions[0].label}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold mr-1 ${muted}`}>Previous Problems</span>
          {previousEditions.map((ed) => {
            const isSelected = selectedOffset === ed.offset;
            return (
              <button
                key={ed.key}
                type="button"
                onClick={() => setSelectedOffset(ed.offset)}
                className={`px-3.5 py-1.5 rounded-xl border text-sm font-bold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : darkmode
                    ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {ed.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Full-Width Game Cards with Visual Previews */}
      <div className="flex flex-col gap-4 w-full">
        {GAMES.map((game) => {
          const isCompleted = state.completedPuzzles[`${currentEdition.key}_${game.id}`] === true;

          return (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveGame(game.id)}
              className={`w-full cursor-pointer rounded-2xl border p-6 flex flex-wrap items-center justify-between gap-5 transition ${
                isCompleted
                  ? darkmode
                    ? 'bg-emerald-950/30 border-emerald-700/70'
                    : 'bg-emerald-50/80 border-emerald-300'
                  : `${cardSurface} hover:border-blue-500`
              }`}
            >
              <div className="flex items-center gap-5 flex-1 min-w-260px">
                <GamePreviewThumbnail gameId={game.id} darkmode={darkmode} />

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{game.title}</h3>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${muted}`}>{game.description}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shrink-0">
                <Play className="w-4 h-4 fill-current" />
                {isCompleted ? 'Play Again' : 'Start'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}