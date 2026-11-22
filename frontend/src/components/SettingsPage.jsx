import React from 'react';
import { Sun, Moon, Sliders } from 'lucide-react';

const CIRCLE_COLOR_OPTIONS = [
  { id: 'red', label: 'Alert Red (Recommended)', hex: '#ef4444' },
  { id: 'amber', label: 'High-Contrast Amber', hex: '#f59e0b' },
  { id: 'cyan', label: 'Inspection Cyan', hex: '#06b6d4' },
];

function SettingsPage({ prefs, setters, onNotify }) {
  const { darkMode, circleHex, minConfidence, apiBaseUrl } = prefs;
  const { setDarkMode, setCircleHex, setMinConfidence, setApiBaseUrl } = setters;
  
  const cardSurface = darkMode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';

  const subtleText = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard &amp; Detection Settings</h2>
        <p className={`text-sm ${subtleText}`}>
          Customize appearance, defect circle highlight color, and FastAPI backend connection
        </p>
      </div>

      {/* Light / Dark Mode */}
      <div className={`p-5 rounded-xl border ${cardSurface}`}>
        <h3 className="font-bold text-base mb-1">Appearance Theme</h3>
        <p className={`text-xs mb-4 ${subtleText}`}>
          Switch between light mode and dark mode for the inspection workspace.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold ${
              !darkMode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-700 text-gray-300'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold ${
              darkMode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Defect Circle Color */}
      <div className={`p-5 rounded-xl border ${cardSurface}`}>
        <h3 className="font-bold text-base mb-1">Defect Circle Marker Color</h3>
        <p className={`text-xs mb-4 ${subtleText}`}>
          Choose the highlight color used to circle potholes, cracks, and waterlogging on road images.
        </p>
        <div className="flex flex-wrap gap-3">
          {CIRCLE_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setCircleHex(opt.hex);
                onNotify?.(`Marker color set to ${opt.label}`);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold transition ${
                circleHex === opt.hex
                  ? 'border-blue-600 ring-2 ring-blue-500/30'
                  : darkMode
                  ? 'border-gray-700'
                  : 'border-gray-300'
              }`}
            >
              <span
                style={{ backgroundColor: opt.hex }}
                className="h-3.5 w-3.5 rounded-full inline-block"
              />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence Threshold & FastAPI URL */}
      <div className={`p-5 rounded-xl border space-y-4 ${cardSurface}`}>
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-base">YOLO Inference &amp; FastAPI Endpoint</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Minimum Detection Confidence Threshold: {minConfidence}%
          </label>
          <input
            type="range"
            min="50"
            max="95"
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5">
            FastAPI Backend Base URL
          </label>
          <input
            type="text"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-xs ${
              darkMode
                ? 'bg-gray-950 border-gray-700 text-gray-100'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;