import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RotateCcw, Zap, CheckCircle2, Info } from 'lucide-react';

// Directions: 0 = Top, 1 = Right, 2 = Bottom, 3 = Left
const BASE_OPENINGS = {
  straight: [1, 3],   // Left - Right
  corner: [0, 1],     // Top - Right
  tee: [0, 1, 2],     // Top - Right - Bottom
};

function getRotatedOpenings(type, rotationSteps) {
  const steps = ((rotationSteps % 4) + 4) % 4;
  return BASE_OPENINGS[type].map((dir) => (dir + steps) % 4);
}

const SIZE = 4;
const DELTAS = [
  [-1, 0, 2], // Top -> neighbor's Bottom
  [0, 1, 3],  // Right -> neighbor's Left
  [1, 0, 0],  // Bottom -> neighbor's Top
  [0, -1, 1], // Left -> neighbor's Right
];

const DAILY_CIRCUITS = [
  {
    startRow: 1,
    endRow: 2,
    tiles: [
      { type: 'corner', rot: 1 }, { type: 'straight', rot: 1 }, { type: 'tee', rot: 2 },     { type: 'corner', rot: 3 },
      { type: 'straight', rot: 1 }, { type: 'corner', rot: 0 },   { type: 'corner', rot: 2 },  { type: 'tee', rot: 1 },
      { type: 'corner', rot: 3 }, { type: 'corner', rot: 1 },   { type: 'straight', rot: 1 },{ type: 'straight', rot: 1 },
      { type: 'tee', rot: 0 },    { type: 'straight', rot: 0 }, { type: 'corner', rot: 2 },  { type: 'corner', rot: 0 },
    ],
  },
  {
    startRow: 0,
    endRow: 1,
    tiles: [
      { type: 'corner', rot: 0 }, { type: 'straight', rot: 0 }, { type: 'corner', rot: 1 },  { type: 'tee', rot: 0 },
      { type: 'corner', rot: 2 }, { type: 'straight', rot: 1 }, { type: 'corner', rot: 1 },  { type: 'tee', rot: 1 },
      { type: 'straight', rot: 1 },{ type: 'corner', rot: 3 },  { type: 'corner', rot: 2 },  { type: 'corner', rot: 1 },
      { type: 'corner', rot: 0 }, { type: 'tee', rot: 2 },      { type: 'straight', rot: 1 },{ type: 'corner', rot: 3 },
    ],
  },
  {
    startRow: 2,
    endRow: 0,
    tiles: [
      { type: 'straight', rot: 0 }, { type: 'tee', rot: 1 },      { type: 'corner', rot: 2 },  { type: 'corner', rot: 0 },
      { type: 'corner', rot: 0 }, { type: 'straight', rot: 1 }, { type: 'corner', rot: 1 },  { type: 'corner', rot: 1 },
      { type: 'corner', rot: 2 }, { type: 'tee', rot: 3 },      { type: 'corner', rot: 2 },  { type: 'corner', rot: 2 },
      { type: 'straight', rot: 1 },{ type: 'corner', rot: 0 },  { type: 'straight', rot: 0 },{ type: 'tee', rot: 2 },
    ],
  },
];

export default function CircuitPuzzleGame({
  dayOffset = 0,
  dayNumber = '',
  darkmode = false,
  onComplete,
}) {
  const layout = DAILY_CIRCUITS[dayOffset % DAILY_CIRCUITS.length];
  const [rotations, setRotations] = useState(() => layout.tiles.map((t) => t.rot));
  const completedFiredRef = useRef(false);

  const cardSurface = darkmode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';

  const { activePathSet, solved } = useMemo(() => {
    const startIdx = layout.startRow * SIZE + 0;
    const endIdx = layout.endRow * SIZE + (SIZE - 1);

    const startOpenings = getRotatedOpenings(layout.tiles[startIdx].type, rotations[startIdx]);
    if (!startOpenings.includes(3)) {
      return { activePathSet: new Set(), solved: false };
    }

    const visited = new Set([startIdx]);
    const parent = new Map();
    const queue = [startIdx];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === endIdx) break;

      const r = Math.floor(curr / SIZE);
      const c = curr % SIZE;
      const openings = getRotatedOpenings(layout.tiles[curr].type, rotations[curr]);

      for (const dir of openings) {
        const [dr, dc, oppositeDir] = DELTAS[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          const nIdx = nr * SIZE + nc;
          if (!visited.has(nIdx)) {
            const neighborOpenings = getRotatedOpenings(
              layout.tiles[nIdx].type,
              rotations[nIdx]
            );
            if (neighborOpenings.includes(oppositeDir)) {
              visited.add(nIdx);
              parent.set(nIdx, curr);
              queue.push(nIdx);
            }
          }
        }
      }
    }

    const endOpenings = getRotatedOpenings(layout.tiles[endIdx].type, rotations[endIdx]);
    const reachesOut = visited.has(endIdx) && endOpenings.includes(1);

    if (!reachesOut) {
      return { activePathSet: new Set(), solved: false };
    }

    const exactPath = new Set();
    let trace = endIdx;
    while (trace !== undefined) {
      exactPath.add(trace);
      trace = parent.get(trace);
    }

    return { activePathSet: exactPath, solved: true };
  }, [layout, rotations]);

  useEffect(() => {
    if (solved && !completedFiredRef.current) {
      completedFiredRef.current = true;
      if (onComplete) onComplete();
    }
  }, [solved, onComplete]);

  const handleRotate = (idx) => {
    setRotations((prev) => prev.map((r, i) => (i === idx ? r + 1 : r)));
  };

  const reset = () => {
    completedFiredRef.current = false;
    setRotations(layout.tiles.map((t) => t.rot));
  };

  // Base geometry before CSS rotation:
  // straight: Left(x=0,y=50) to Right(x=100,y=50)
  // corner: Top(x=50,y=0) -> center(50,50) -> Right(x=100,y=50)
  // tee: Top(50,0)->Bottom(50,100) and center(50,50)->Right(100,50)
  const renderPipeSvg = (type, isActive) => {
    const stroke = isActive ? '#10b981' : darkmode ? '#94a3b8' : '#475569';
    const portFill = isActive ? '#34d399' : '#60a5fa';

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        {type === 'straight' && (
          <>
            <line x1="0" y1="50" x2="100" y2="50" stroke={stroke} strokeWidth="12" />
            {/* Left & Right port markers */}
            <polygon points="4,43 13,50 4,57" fill={portFill} />
            <polygon points="96,43 87,50 96,57" fill={portFill} />
          </>
        )}
        {type === 'corner' && (
          <>
            <path
              d="M50,0 L50,50 L100,50"
              fill="none"
              stroke={stroke}
              strokeWidth="12"
              strokeLinejoin="miter"
            />
            {/* Top & Right port markers */}
            <polygon points="43,4 50,13 57,4" fill={portFill} />
            <polygon points="96,43 87,50 96,57" fill={portFill} />
          </>
        )}
        {type === 'tee' && (
          <>
            <line x1="50" y1="0" x2="50" y2="100" stroke={stroke} strokeWidth="12" />
            <line x1="50" y1="50" x2="100" y2="50" stroke={stroke} strokeWidth="12" />
            {/* Top, Right & Bottom port markers */}
            <polygon points="43,4 50,13 57,4" fill={portFill} />
            <polygon points="96,43 87,50 96,57" fill={portFill} />
            <polygon points="43,96 50,87 57,96" fill={portFill} />
          </>
        )}
        <circle cx="50" cy="50" r="8" fill={isActive ? '#34d399' : darkmode ? '#e2e8f0' : '#334155'} />
      </svg>
    );
  };

  return (
    <div className={`w-full p-6 md:p-8 rounded-2xl border space-y-6 ${cardSurface}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            Circuit Path • {dayNumber}
          </span>
          <h3 className="text-xl md:text-2xl font-bold mt-1">Connect IN to OUT</h3>
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold hover:border-blue-500"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Grid
        </button>
      </div>

      {/* Explicit Directions */}
      <div
        className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
          darkmode ? 'bg-gray-800/70 border-gray-700 text-gray-200' : 'bg-blue-50/70 border-blue-200 text-gray-800'
        }`}
      >
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">How to Play:</p>
          <p className="text-xs md:text-sm opacity-90 leading-relaxed">
            Click any tile to rotate it <strong>90° clockwise</strong>. The arrowheads/ports on each tile show where its openings point. Align a continuous path from the <strong>IN</strong> port on the left into the <strong>OUT</strong> port on the right so every touching edge lines up.
          </p>
        </div>
      </div>

      {/* Aligned Grid with IN on Left and OUT on Right */}
      <div className="flex items-center justify-center gap-2 md:gap-3 py-2">
        <div className="grid grid-rows-4 gap-2.5">
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="w-16 h-20 md:h-24 flex items-center justify-end pr-1">
              {r === layout.startRow && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/40 text-xs font-extrabold">
                  <Zap className="w-3 h-3" />
                  IN →
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {layout.tiles.map((tile, idx) => {
            const isActive = solved && activePathSet.has(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleRotate(idx)}
                title="Click to rotate 90° clockwise"
                className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 overflow-hidden flex items-center justify-center transition-colors ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : darkmode
                    ? 'border-gray-700 bg-gray-800/80 hover:border-blue-500'
                    : 'border-gray-300 bg-gray-100 hover:border-blue-500'
                }`}
              >
                <div
                  style={{ transform: `rotate(${rotations[idx] * 90}deg)` }}
                  className="w-full h-full transition-transform duration-200"
                >
                  {renderPipeSvg(tile.type, isActive)}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-rows-4 gap-2.5">
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="w-16 h-20 md:h-24 flex items-center justify-start pl-1">
              {r === layout.endRow && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-extrabold ${
                    solved
                      ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                  }`}
                >
                  → OUT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {solved && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center gap-2 text-emerald-500 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}