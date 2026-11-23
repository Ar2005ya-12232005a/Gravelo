import React from 'react';
import { Sun, Moon, Palette, Bell, SlidersHorizontal } from 'lucide-react';

function SettingsPage({ prefs, setters, onNotify }) {
  const {
    darkmode,
    circleHex,
    highlightHex,
    showCircleLabels,
    severityFilter,
    toastAlerts,
    highSeverityAlerts,
  } = prefs;

  const {
    setDarkmode,
    setCircleHex,
    setHighlightHex,
    setShowCircleLabels,
    setSeverityFilter,
    setToastAlerts,
    setHighSeverityAlerts,
  } = setters;

  const cardSurface = darkmode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-200 text-gray-900';

  const subtitleText = darkmode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className={`text-sm ${subtitleText}`}>
          Customize theme, colors, scan view, and alerts
        </p>
      </div>

      {/* Theme */}
      <div className={`p-5 rounded-xl border ${cardSurface}`}>
        <div className="flex items-center gap-2 mb-1">
          <Sun className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-base">Theme</h3>
        </div>
        <p className={`text-xs mb-4 ${subtitleText}`}>
          Choose between Light mode and Dark mode.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDarkmode(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition ${
              !darkmode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkmode(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition ${
              darkmode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Display & Colors */}
      <div className={`p-5 rounded-xl border space-y-5 ${cardSurface}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-base">Display &amp; Colors</h3>
          </div>
          <p className={`text-xs ${subtitleText}`}>
            Click a color box to pick a color.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-semibold">Defect Circle Color</p>
              <p className={`text-xs ${subtitleText}`}>Color of circles around defects</p>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <span className="text-xs font-mono uppercase">{circleHex}</span>
              <input
                type="color"
                value={circleHex}
                onChange={(e) => {
                  setCircleHex(e.target.value);
                  onNotify?.(`Circle color set to ${e.target.value}`);
                }}
                className="h-9 w-12 rounded cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-semibold">Highlight Color</p>
              <p className={`text-xs ${subtitleText}`}>Color used for active buttons and accents</p>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <span className="text-xs font-mono uppercase">{highlightHex}</span>
              <input
                type="color"
                value={highlightHex}
                onChange={(e) => {
                  setHighlightHex(e.target.value);
                  onNotify?.(`Highlight color set to ${e.target.value}`);
                }}
                className="h-9 w-12 rounded cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Scan View */}
      <div className={`p-5 rounded-xl border space-y-4 ${cardSurface}`}>
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-base">Scan View</h3>
        </div>

        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <p className="text-xs font-semibold">Show Labels on Defect Circles</p>
            <p className={`text-xs ${subtitleText}`}>
              Show depth and defect labels next to circles.
            </p>
          </div>
          <input
            type="checkbox"
            checked={showCircleLabels}
            onChange={(e) => setShowCircleLabels(e.target.checked)}
            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0"
          />
        </label>

        <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold">Default Scan Filter</p>
            <p className={`text-xs ${subtitleText}`}>
              Show all scans or high severity only.
            </p>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
              darkmode
                ? 'bg-gray-950 border-gray-700 text-gray-100'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="All">All Scans</option>
            <option value="High">High Severity Only</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className={`p-5 rounded-xl border space-y-4 ${cardSurface}`}>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-base">Notifications</h3>
        </div>

        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <p className="text-xs font-semibold">Popup Messages</p>
            <p className={`text-xs ${subtitleText}`}>
              Show small popups when uploading or copying.
            </p>
          </div>
          <input
            type="checkbox"
            checked={toastAlerts}
            onChange={(e) => setToastAlerts(e.target.checked)}
            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0"
          />
        </label>

        <label className="flex items-center justify-between gap-4 cursor-pointer pt-3 border-t border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold">High-Severity Alert Badge</p>
            <p className={`text-xs ${subtitleText}`}>
              Show high-severity badge on the dashboard.
            </p>
          </div>
          <input
            type="checkbox"
            checked={highSeverityAlerts}
            onChange={(e) => setHighSeverityAlerts(e.target.checked)}
            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0"
          />
        </label>
      </div>
    </div>
  );
}

export default SettingsPage;