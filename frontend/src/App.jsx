import React, { useState } from 'react';
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
  ArrowRight,
  MapPin,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

const MOCK_SCANS = [
  {
    id: 'SCN-1042',
    roadSegment: 'NH-46 Bhopal–Indore Highway, Km 18.4',
    date: '19 Nov 2026',
    defectType: 'Deep Pothole Cluster',
    severity: 'High',
    confidence: '94.2%',
    count: 4,
    status: 'Action Required',
  },
  {
    id: 'SCN-1041',
    roadSegment: 'Kothri Kalan Campus Access Road, Sector B',
    date: '18 Nov 2026',
    defectType: 'Alligator Cracking',
    severity: 'Medium',
    confidence: '89.7%',
    count: 7,
    status: 'Under Review',
  },
  {
    id: 'SCN-1040',
    roadSegment: 'Sehore Bypass Service Lane, Junction 3',
    date: '17 Nov 2026',
    defectType: 'Surface Waterlogging & Rutting',
    severity: 'High',
    confidence: '91.5%',
    count: 2,
    status: 'Action Required',
  },
  {
    id: 'SCN-1039',
    roadSegment: 'Ashta Link Road, Stretch 09',
    date: '15 Nov 2026',
    defectType: 'Longitudinal Edge Crack',
    severity: 'Low',
    confidence: '86.0%',
    count: 3,
    status: 'Logged',
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

    const newScan = {
    id: `SCN-${1043 + scans.length}`,

    roadSegment: `Uploaded Frame: ${ file.name }`,
    date: '19 Nov 2026',
    defectType: 'Pothole & Transverse Crack (Mock Preview)',
    severity: 'High',
    confidence: '92.8%',
    count: 3,
    status: 'Pending FastAPI Sync',
};

setScans([newScan, ...scans]);
showToast(`Added "${file.name}" to inspection queue`);
  };

const handleRunSample = () => {
  const sampleScan = {
    id: `SCN - ${ 1043 + scans.length}`,

  roadSegment: 'Sample Feed: Arterial Road Cam #04',
  date: '19 Nov 2026',
  defectType: 'Transverse Pavement Crack',
  severity: 'Medium',
  confidence: '90.4%',
  count: 2,
  status: 'Verified Sample',
    };
setScans([sampleScan, ...scans]);
showToast('Sample road-defect inference completed');
  };

const copyReportSummary = (scan) => {
  const summary = `${ scan.id } | ${ scan.roadSegment } | ${ scan.defectType } (${ scan.severity }, ${ scan.confidence })`;
  navigator.clipboard.writeText(summary);
  showToast(`Copied ${ scan.id } summary`);
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
    {/* Left Sidebar (matching your previous project layout) */}
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
          <span>+ Upload Road Scan</span>
          <input
            type="file"
            accept="image/,video/"
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

      <div className="bg-gray-100 rounded-xl p-3.5 text-xs text-gray-600">
        <p className="font-semibold text-gray-800">Backend Status</p>
        <p className="mt-1">Mock Dataset Mode (FastAPI endpoint pending integration)</p>
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

      {/* WelcomeContainer equivalent */}
      <div className="bg-gray-200/80 p-5 rounded-xl flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-bold">Welcome Back, Pavement Inspection Team</h2>
          <p className="text-sm text-gray-700">
            AI-Driven Road Defect Detection &amp; Severity Monitoring
          </p>
        </div>
        <span className="text-xs font-medium bg-white px-3 py-1.5 rounded-full border border-gray-300 text-gray-700">
          YOLO Hybrid Pipeline • v0.1 Preview
        </span>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Total Road Scans</p>
          <p className="text-2xl font-bold mt-1">{scans.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Defects Flagged</p>
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

      {/* CreateOptions equivalent */}
      <h3 className="text-xl font-bold mb-4">Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <label className="bg-gray-100 hover:bg-gray-200/70 border border-gray-300 rounded-xl p-5 flex flex-col gap-2 cursor-pointer transition">
          <Camera className="p-2.5 text-blue-600 bg-blue-100 rounded-lg h-11 w-11" />
          <h4 className="font-bold text-base mt-1">Upload Road Image / Dashcam Frame</h4>
          <p className="text-sm text-gray-700">
            Select a road surface image to preview pothole, crack, and waterlogging tagging.
          </p>
          <input
            type="file"
            accept="image/,video/"
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
            Simulate a sample road-segment scan using preloaded validation metrics.
          </p>
        </button>
      </div>

      {/* LatestInterviewsList + InterviewCard equivalent */}
      <div>
        <h3 className="font-bold text-xl mb-4">Previously Scanned Road Segments</h3>

        {scans.length === 0 ? (
          <div className="p-8 flex flex-col gap-3 items-center bg-gray-200/70 rounded-2xl">
            <ShieldAlert className="h-10 w-10 text-blue-600" />
            <p className="font-medium">No road scans recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {scan.id}
                    </span>
                    <span className="text-xs text-gray-500">{scan.date}</span>
                  </div>

                  <h4 className="mt-3 font-bold text-base">{scan.defectType}</h4>
                  <p className="mt-1 text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{scan.roadSegment}</span>
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border font-medium ${severityBadge(
                        scan.severity
                      )}`}
                    >
                      {scan.severity} Severity
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      {scan.count} defects • {scan.confidence} conf.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full mt-5">
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

      {/* Simple Detail Modal when clicking "View Detail" */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
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
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Location:</span> {selectedScan.roadSegment}
              </p>
              <p>
                <span className="font-semibold">Severity:</span> {selectedScan.severity}
              </p>
              <p>
                <span className="font-semibold">Detected Count:</span> {selectedScan.count}{' '}
                instances
              </p>
              <p>
                <span className="font-semibold">Model Confidence:</span> {selectedScan.confidence}
              </p>
              <p>
                <span className="font-semibold">Workflow Status:</span> {selectedScan.status}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <a
                href={`mailto:maintenance@example.com?subject=Road Defect Alert ${selectedScan.id}&body=${encodeURIComponent(
                  `${ selectedScan.defectType } detected at ${ selectedScan.roadSegment }(${ selectedScan.severity } severity).`
                  )}`}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50"
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
    </main>
  </div>
);
}

export default App;