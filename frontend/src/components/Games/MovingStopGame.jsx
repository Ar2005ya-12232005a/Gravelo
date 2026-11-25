import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, CheckCircle2, Crosshair } from 'lucide-react';

const DAILY_ROUNDS = [
  // Day 0
  [
    { zoneStart: 36, zoneWidth: 24, speed: 1.35 },
    { zoneStart: 58, zoneWidth: 20, speed: 1.65 },
    { zoneStart: 18, zoneWidth: 16, speed: 1.95 },
  ],
  // Day 1
  [
    { zoneStart: 22, zoneWidth: 24, speed: 1.4 },
    { zoneStart: 52, zoneWidth: 20, speed: 1.7 },
    { zoneStart: 66, zoneWidth: 16, speed: 2.0 },
  ],
  // Day 2
  [
    { zoneStart: 45, zoneWidth: 24, speed: 1.45 },
    { zoneStart: 15, zoneWidth: 20, speed: 1.75 },
    { zoneStart: 42, zoneWidth: 16, speed: 2.05 },
  ],
];

export default function MovingStopGame({
  dayOffset = 0,
  dayNumber = '',
  darkmode = false,
  onComplete,
}) {
  const rounds = DAILY_ROUNDS[dayOffset % DAILY_ROUNDS.length];
  const [roundIdx, setRoundIdx] = useState(0);
  const [pos, setPos] = useState(0);
  const [roundState, setRoundState] = useState('running'); // 'running' | 'hit' | 'missed' | 'won'
  const completedRef = useRef(false);
  const dirRef = useRef(1);
  const posRef = useRef(0);

  const currentRound = rounds[roundIdx];
  const zoneEnd = currentRound.zoneStart + currentRound.zoneWidth;

  const resetRound = useCallback((nextIdx = 0) => {
    setRoundIdx(nextIdx);
    posRef.current = 0;
    dirRef.current = 1;
    setPos(0);
    setRoundState('running');
  }, []);

  const restartAll = () => {
    completedRef.current = false;
    resetRound(0);
  };

  useEffect(() => {
    if (roundState !== 'running') return;

    let frameId;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      let nextPos = posRef.current + dirRef.current * currentRound.speed * 65 * dt;
      if (nextPos >= 100) {
        nextPos = 100;
        dirRef.current = -1;
      } else if (nextPos <= 0) {
        nextPos = 0;
        dirRef.current = 1;
      }

      posRef.current = nextPos;
      setPos(nextPos);
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [roundState, currentRound.speed]);

  const handleStop = () => {
    if (roundState !== 'running') return;

    const hit = posRef.current >= currentRound.zoneStart && posRef.current <= zoneEnd;
    if (hit) {
      if (roundIdx + 1 < rounds.length) {
        setRoundState('hit');
        setTimeout(() => {
          resetRound(roundIdx + 1);
        }, 550);
      } else {
        setRoundState('won');
        if (!completedRef.current) {
          completedRef.current = true;
          if (onComplete) onComplete();
        }
      }
    } else {
      setRoundState('missed');
    }
  };

  const cardSurface = darkmode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';
  const muted = darkmode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`w-full p-6 md:p-8 rounded-2xl border space-y-6 ${cardSurface}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
            Moving Stop • Day {dayNumber}
          </span>
          <h3 className="text-xl md:text-2xl font-bold mt-1">
            Round {roundIdx + 1} of {rounds.length}
          </h3>
          <p className={`text-sm mt-1 ${muted}`}>
            Stop the marker inside the target zone for all {rounds.length} rounds.
          </p>
        </div>

        <button
          type="button"
          onClick={restartAll}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold hover:border-blue-500"
        >
          <RotateCcw className="w-4 h-4" />
          Restart
        </button>
      </div>

      {/* Precision Track */}
      <div
        onClick={handleStop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleStop()}
        className={`relative w-full h-24 rounded-2xl border-2 cursor-pointer select-none overflow-hidden ${
          darkmode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
        }`}
      >
        {/* Target Zone */}
        <div
          style={{
            left: `${currentRound.zoneStart}%`,
            width: `${currentRound.zoneWidth}%`,
          }}
          className="absolute top-0 bottom-0 bg-emerald-500/25 border-x-2 border-emerald-500 flex items-center justify-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Target
          </span>
        </div>

        {/* Moving Marker */}
        <div
          style={{ left: `${pos}%` }}
          className="absolute top-1 bottom-1 w-1.5 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
        />
      </div>

      {/* Action / Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleStop}
          disabled={roundState !== 'running'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <Crosshair className="w-4 h-4" />
          Stop Marker
        </button>

        {roundState === 'hit' && (
          <span className="text-sm font-bold text-emerald-500">
            On target! Moving to next round...
          </span>
        )}

        {roundState === 'missed' && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-red-500">Missed the target zone.</span>
            <button
              type="button"
              onClick={() => resetRound(roundIdx)}
              className="px-3.5 py-1.5 rounded-lg border text-xs font-bold hover:border-blue-500"
            >
              Retry Round
            </button>
          </div>
        )}
      </div>

      {roundState === 'won' && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center gap-2 text-emerald-500 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}