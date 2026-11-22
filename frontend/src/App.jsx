import React, { useState } from 'react';
import { SettingsPage, DetectedDefects, InspectionReports } from './components';
import {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  FileText,
  Settings,
  Camera,
  PlayCircle,
  Copy,
  Send,
  Phone,
  ArrowRight,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  Ruler,
  Building2,
} from 'lucide-react';

// Generates a clean road-surface SVG preview with detection circles for mock scans
const createMockRoadPreview = (circles) => {
  const circleMarkup = circles
    .map(
      (c) => `
      <circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="rgba(239, 68, 68, 0.22)" stroke="#ef4444" stroke-width="3" />
      <circle cx="${c.x}" cy="${c.y}" r="4" fill="#ef4444" />
      <text x="${c.x + c.r + 6}" y="${c.y + 4}" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold">${c.label}</text>
    `
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320">
      <rect width="600" height="320" fill="#374151" />
      <polygon points="140,0 460,0 580,320 20,320" fill="#1f2937" />
      <line x1="300" y1="0" x2="300" y2="320" stroke="#facc15" stroke-width="4" stroke-dasharray="22,16" />
      <line x1="145" y1="0" x2="35" y2="320" stroke="#e5e7eb" stroke-width="3" />
      <line x1="455" y1="0" x2="565" y2="320" stroke="#e5e7eb" stroke-width="3" />
      ${circleMarkup}
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const MOCK_SCANS = [
  {
    id: 'SCN-1042',
    roadSegment: 'NH-46 Bhopal–Indore Highway, Km 18.4',
    date: '19 Nov 2026',
    defectType: 'Deep Pothole Cluster',
    severity: 'High',
    estimatedDepth: '9.4 cm',
    confidence: '94.2%',
    count: 3,
    status: 'Action Required',
    authority: 'NHAI Regional Office, Bhopal',
    contactPhone: '+91-755-2426638',
    contactEmail: 'robhopal@nhai.org',
    imageUrl: createMockRoadPreview([
      { x: 235, y: 175, r: 34, label: 'Pothole (9.4 cm)' },
      { x: 355, y: 225, r: 26, label: 'Pothole (6.8 cm)' },
      { x: 270, y: 115, r: 20, label: 'Crack' },
    ]),
    markers: [],
  },
  {
    id: 'SCN-1041',
    roadSegment: 'Kothri Kalan Campus Access Road, Sector B',
    date: '18 Nov 2026',
    defectType: 'Alligator Cracking',
    severity: 'Medium',
    estimatedDepth: '3.6 cm',
    confidence: '89.7%',
    count: 2,
    status: 'Under Review',
    authority: 'PWD Sehore Division (Sub-Division Ashta)',
    contactPhone: '+91-7562-226041',
    contactEmail: 'eepwdsehore@mp.gov.in',
    imageUrl: createMockRoadPreview([
      { x: 220, y: 190, r: 38, label: 'Alligator Crack (3.6 cm)' },
      { x: 375, y: 145, r: 24, label: 'Surface Wear' },
    ]),
    markers: [],
  },
  {
    id: 'SCN-1040',
    roadSegment: 'Sehore Bypass Service Lane, Junction 3',
    date: '17 Nov 2026',
    defectType: 'Surface Waterlogging & Rutting',
    severity: 'High',
    estimatedDepth: '7.8 cm',
    confidence: '91.5%',
    count: 2,
    status: 'Action Required',
    authority: 'MPRDC Divisional Office, Sehore',
    contactPhone: '+91-7562-224510',
    contactEmail: 'dm.sehore@mprdc.gov.in',
    imageUrl: createMockRoadPreview([
      { x: 310, y: 200, r: 44, label: 'Rutting / Water (7.8 cm)' },
      { x: 195, y: 140, r: 22, label: 'Edge Break' },
    ]),
    markers: [],
  },
  {
    id: 'SCN-1039',
    roadSegment: 'Ashta Link Road, Stretch 09',
    date: '15 Nov 2026',
    defectType: 'Longitudinal Edge Crack',
    severity: 'Low',
    estimatedDepth: '1.8 cm',
    confidence: '86.0%',
    count: 1,
    status: 'Logged',
    authority: 'PWD Sehore Division (Sub-Division Ashta)',
    contactPhone: '+91-7562-226041',
    contactEmail: 'eepwdsehore@mp.gov.in',
    imageUrl: createMockRoadPreview([
      { x: 410, y: 195, r: 28, label: 'Edge Crack (1.8 cm)' },
    ]),
    markers: [],
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scans, setScans] = useState(MOCK_SCANS);
  const [selectedScan, setSelectedScan] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedPreviewUrl = URL.createObjectURL(file);

    const newScan = {
      id: SCN - `${1043 + scans.length}`,
      roadSegment: `Uploaded Image: ${file.name}`,
      date: '22 Nov 2026',
      defectType: 'Pothole & Transverse Crack (Preview)',
      severity: 'High',
      estimatedDepth: '8.1 cm',
      confidence: '92.8%',
      count: 2,
      status: 'Pending FastAPI Sync',
      authority: 'PWD Sehore Division (Sub-Division Ashta)',
      contactPhone: '+91-7562-226041',
      contactEmail: 'eepwdsehore@mp.gov.in',
      imageUrl: uploadedPreviewUrl,
      // Percentage coordinates overlaid on the uploaded photo until FastAPI returns real boxes/circles
      markers: [
        { top: '54%', left: '42%', size: 68, label: '8.1 cm' },
        { top: '66%', left: '63%', size: 48, label: '4.2 cm' },
      ],
    };

    setScans([newScan, ...scans]);
    setSelectedScan(newScan);
    showToast(`Marked defects on "${file.name}"`);
  };

  const handleRunSample = () => {
    const sampleScan = {
      id: `SCN-${1043 + scans.length}`,
      roadSegment: 'Sample Capture: Kothri Kalan Main Gate Stretch',
      date: '22 Nov 2026',
      defectType: 'Transverse Pavement Crack',
      severity: 'Medium',
      estimatedDepth: '4.1 cm',
      confidence: '90.4%',
      count: 2,
      status: 'Verified Sample',
      authority: 'PWD Sehore Division (Sub-Division Ashta)',
      contactPhone: '+91-7562-226041',
      contactEmail: 'eepwdsehore@mp.gov.in',
      imageUrl: createMockRoadPreview([
        { x: 260, y: 185, r: 32, label: 'Crack (4.1 cm)' },
        { x: 365, y: 135, r: 22, label: 'Crack (2.3 cm)' },
      ]),
      markers: [],
    };
    setScans([sampleScan, ...scans]);
    showToast('Sample road-image detection completed');
  };

  const copyReportSummary = (scan) => {
    const summary = `${scan.id} | ${scan.roadSegment} | ${scan.defectType} | Severity: ${scan.severity} | Depth: ${scan.estimatedDepth} | Authority: ${scan.authority} (${scan.contactPhone})`;
    navigator.clipboard.writeText(summary);
    showToast(`Copied ${scan.id} full report`);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detections', label: 'Detected Defects', icon: AlertTriangle },
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const severityBadge = (severity) => {
    if (severity === 'High') return 'bg-red-100 text-red-700 border-red-200';
    if (severity === 'Medium') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Gravelo</h1>
              <p className="text-xs text-gray-500">Road Defect AI</p>
            </div>
          </div>

          <label className="w-full mb-6 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition">
            <Upload className="h-4 w-4" />
            <span>+ Upload Road Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-6xl">
        {/* Toast notification */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsPage
            prefs={settingsPrefs}
            setters={settingsSetters}
            onNotify={showToast}
          />
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Banner */}
            <div className="bg-gray-200/80 p-5 rounded-xl flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold">Welcome Back, Pavement Inspection Team</h2>
                <p className="text-sm text-gray-700">
                  AI-Driven Defect Localization, Depth Estimation &amp; Authority Dispatch
                </p>
              </div>
            </div>

            {/* Summary Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Total Road Images Scanned</p>
                <p className="text-2xl font-bold mt-1">{scans.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Circled Defects Flagged</p>
                <p className="text-2xl font-bold mt-1">
                  {scans.reduce((acc, item) => acc + item.count, 0)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">High-Severity Alerts</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {scans.filter((s) => s.severity === 'High').length}
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <h3 className="text-xl font-bold mb-4">Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <label className="bg-gray-100 hover:bg-gray-200/70 border border-gray-300 rounded-xl p-5 flex flex-col gap-2 cursor-pointer transition">
                <Camera className="p-2.5 text-blue-600 bg-blue-100 rounded-lg h-11 w-11" />
                <h4 className="font-bold text-base mt-1">Upload Road Picture</h4>
                <p className="text-sm text-gray-700">
                  Upload a road surface photo to highlight defects with circles, estimate depth, and notify local authorities.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleRunSample}
                className="text-left bg-gray-100 hover:bg-gray-200/70 border border-gray-300 rounded-xl p-5 flex flex-col gap-2 transition"
              >
                <PlayCircle className="p-2.5 text-blue-600 bg-blue-100 rounded-lg h-11 w-11" />
                <h4 className="font-bold text-base mt-1">Run Sample Road Detection</h4>
                <p className="text-sm text-gray-700">
                  Simulate detection circles, severity scoring, and depth calculation on a sample road image.
                </p>
              </button>
            </div>

            {/* Previously Scanned Road Segments */}
            <div>
              <h3 className="font-bold text-xl mb-4">Previously Scanned Road Segments</h3>

              {scans.length === 0 ? (
                <div className="p-8 flex flex-col gap-3 items-center bg-gray-200/70 rounded-2xl">
                  <ShieldAlert className="h-10 w-10 text-blue-600" />
                  <p className="font-medium">No road images scanned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                            {scan.id}
                          </span>
                          <span className="text-xs text-gray-500">{scan.date}</span>
                        </div>

                        {/* Annotated Image Thumbnail with Defect Circles */}
                        <div
                          onClick={() => setSelectedScan(scan)}
                          className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-900 border border-gray-200 cursor-pointer group"
                        >
                          <img
                            src={scan.imageUrl}
                            alt={scan.defectType}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          {scan.markers?.map((m, idx) => (
                            <div
                              key={idx}
                              style={{
                                top: m.top,
                                left: m.left,
                                width: `${m.size}px`,
                                height: `${m.size}px`,
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-red-500 bg-red-500/20 flex items-end justify-center"
                            >
                              <span className="translate-y-5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {m.label}
                              </span>
                            </div>
                          ))}
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded">
                            {scan.count} circled zones
                          </span>
                        </div>

                        <h4 className="mt-3 font-bold text-base">{scan.defectType}</h4>
                        <p className="mt-1 text-xs text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{scan.roadSegment}</span>
                        </p>

                        {/* Severity + Depth Row */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span
                            className={`px-2.5 py-0.5 rounded-full border font-medium ${severityBadge(
                              scan.severity
                            )}`}
                          >
                            {scan.severity} Severity
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                            <Ruler className="h-3 w-3" />
                            Depth: {scan.estimatedDepth}
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            {scan.confidence} conf.
                          </span>
                        </div>

                        {/* Responsible Authority Preview */}
                        <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 truncate">
                            <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{scan.authority}</span>
                          </span>
                          <span className="font-medium text-gray-800 shrink-0 ml-2">
                            {scan.contactPhone}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full mt-4">
                        <button
                          onClick={() => copyReportSummary(scan)}
                          className="w-full py-2 px-3 rounded-lg border border-gray-300 text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-1.5"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Summary</span>
                        </button>
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="w-full py-2 px-3 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 flex items-center justify-center gap-1.5"
                        >
                          <span>View Detail</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Modal with Circled Output Image, Depth & Authority Contact (Phone + Email) */}
            {selectedScan && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-blue-600">{selectedScan.id}</span>
                      <h4 className="text-lg font-bold mt-0.5">{selectedScan.defectType}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedScan(null)}
                      className="text-gray-400 hover:text-gray-700 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Circled Output Preview */}
                  <div className="relative w-full h-52 mt-3 rounded-lg overflow-hidden bg-gray-900 border border-gray-200">
                    <img
                      src={selectedScan.imageUrl}
                      alt={selectedScan.defectType}
                      className="w-full h-full object-cover"
                    />
                    {selectedScan.markers?.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          top: m.top,
                          left: m.left,
                          width: `${m.size}px`,
                          height: `${m.size}px`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-red-500 bg-red-500/20 flex items-end justify-center"
                      >
                        <span className="translate-y-5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-gray-700 bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                    <p className="col-span-2">
                      <span className="font-semibold">Location:</span> {selectedScan.roadSegment}
                    </p>
                    <p>
                      <span className="font-semibold">Severity:</span> {selectedScan.severity}
                    </p>
                    <p>
                      <span className="font-semibold">Est. Depth:</span> {selectedScan.estimatedDepth}
                    </p>
                    <p>
                      <span className="font-semibold">Circled Issues:</span> {selectedScan.count}
                    </p>
                    <p>
                      <span className="font-semibold">Confidence:</span> {selectedScan.confidence}
                    </p>
                  </div>

                  {/* Responsible Road Authority Contact Block */}
                  <div className="mt-3 p-3.5 rounded-lg border border-blue-100 bg-blue-50/60 text-xs text-gray-800 space-y-1">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      <span>Responsible Authority: {selectedScan.authority}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {selectedScan.contactPhone}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {selectedScan.contactEmail}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <a
                      href={`tel:${selectedScan.contactPhone}`}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Authority</span>
                    </a>
                    <a
                      href={`mailto:${selectedScan.contactEmail}?subject=Road Defect Alert ${selectedScan.id}&body=${encodeURIComponent(
                        `${selectedScan.defectType} detected at ${selectedScan.roadSegment}.\nSeverity: ${selectedScan.severity}\nEstimated Depth: ${selectedScan.estimatedDepth}\nCircled Defects: ${selectedScan.count}`
                      )}`}
                      className="px-3.5 py-2 rounded-lg border border-gray-300 text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Email Alert</span>
                    </a>
                    <button
                      onClick={() => setSelectedScan(null)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>)}
          </main>
    </div>
  );
}

export default App;