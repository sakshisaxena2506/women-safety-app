import { useState } from 'react';
import { Download, FileText, BarChart2, Users, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const monthlyData = [
  { month: 'Nov', alerts: 45, resolved: 40, volunteers: 12 },
  { month: 'Dec', alerts: 62, resolved: 55, volunteers: 18 },
  { month: 'Jan', alerts: 38, resolved: 36, volunteers: 22 },
  { month: 'Feb', alerts: 71, resolved: 63, volunteers: 25 },
  { month: 'Mar', alerts: 55, resolved: 50, volunteers: 30 },
  { month: 'Apr', alerts: 88, resolved: 82, volunteers: 35 },
];

const reports = [
  { title: 'Monthly Alert Summary', description: 'Complete breakdown of all SOS alerts, response times, and resolutions for the current month.', type: 'Alerts', date: 'May 2026', size: '2.4 MB' },
  { title: 'Volunteer Performance Report', description: 'Individual volunteer response statistics, ratings, and coverage analysis.', type: 'Volunteers', date: 'May 2026', size: '1.8 MB' },
  { title: 'User Engagement Report', description: 'Platform usage statistics, new registrations, and active user trends.', type: 'Users', date: 'May 2026', size: '1.1 MB' },
  { title: 'Incident Response Analysis', description: 'Detailed analysis of response times, volunteer assignment efficiency, and resolution rates.', type: 'Analysis', date: 'Q1 2026', size: '4.2 MB' },
  { title: 'Geographic Coverage Report', description: 'Heatmap analysis of alert density and volunteer coverage gaps by region.', type: 'Geographic', date: 'Q1 2026', size: '3.6 MB' },
];

export default function AdminReports() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('this-month');

  const handleDownload = (title: string) => {
    setDownloading(title);
    setTimeout(() => {
      setDownloading(null);
      toast.success(`${title} downloaded successfully.`);
    }, 1500);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'Alerts': return AlertTriangle;
      case 'Volunteers': return Users;
      case 'Users': return Users;
      default: return BarChart2;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Reports</h1>
              <p className="text-gray-500 text-sm mt-1">Analytics and downloadable platform reports.</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-red-400 focus:outline-none bg-white text-gray-700"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="q1">Q1 2026</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Alerts', value: '359', change: '+23%', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
              { label: 'Resolved', value: '326', change: '91%', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
              { label: 'New Users', value: '284', change: '+41%', icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'New Volunteers', value: '47', change: '+15%', icon: Users, color: 'text-purple-600 bg-purple-50' },
            ].map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-gray-500 text-xs font-medium">{label}</p>
                <p className="text-green-600 text-xs font-semibold mt-1">{change}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-6">6-Month Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="alerts" fill="#DC2626" name="Total Alerts" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#16a34a" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Downloadable reports */}
          <div>
            <h2 className="font-bold text-gray-900 mb-4">Downloadable Reports</h2>
            <div className="space-y-3">
              {reports.map(report => {
                const Icon = typeIcon(report.type);
                const isLoading = downloading === report.title;
                return (
                  <div key={report.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{report.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{report.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{report.type}</span>
                        <span className="text-xs text-gray-400">{report.date}</span>
                        <span className="text-xs text-gray-400">PDF · {report.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(report.title)}
                      disabled={isLoading}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm transition-all"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:block">Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:block">Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
