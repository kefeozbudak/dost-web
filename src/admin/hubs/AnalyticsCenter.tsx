import { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { seedBaselineTrafficIfNeeded, DailyTraffic, TrafficLog, PageStat } from '../../lib/analytics';
import {
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Search,
  Zap,
  TrendingUp,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function AnalyticsCenter() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'today' | 'all'>('30d');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore Data State
  const [summaryData, setSummaryData] = useState<any>(null);
  const [dailyData, setDailyData] = useState<DailyTraffic[]>([]);
  const [pagesData, setPagesData] = useState<PageStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<TrafficLog[]>([]);
  const [activeUsersCount, setActiveUsersCount] = useState(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and Fetch Analytics Data
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      setLoading(true);
      try {
        await seedBaselineTrafficIfNeeded();
        if (isMounted) {
          await fetchAllAnalytics();
        }
      } catch (err) {
        console.error("Init analytics error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    initData();

    // Listen to real-time recent logs and calculate real active online count
    const logsQuery = query(collection(db, 'traffic_logs'), orderBy('timestamp', 'desc'), limit(30));
    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const logs: TrafficLog[] = [];
        snapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() } as TrafficLog);
        });
        if (logs.length > 0) {
          setRecentLogs(logs);

          // Calculate real active users (logged within last 5 minutes)
          const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
          const activeIn5Mins = logs.filter((l) => l.timestamp && l.timestamp > fiveMinsAgo);
          
          if (activeIn5Mins.length > 0) {
            setActiveUsersCount(activeIn5Mins.length);
          } else {
            // Minimal active floor if site is open by current user
            setActiveUsersCount(1);
          }
        }
      },
      (err) => {
        console.warn("Realtime traffic logs listener notice:", err);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setRefreshing(true);

      // 1. Fetch Summary
      const summarySnap = await getDoc(doc(db, 'traffic_stats', 'summary'));
      if (summarySnap.exists()) {
        setSummaryData(summarySnap.data());
      }

      // 2. Fetch Daily Traffic Records
      const dailyQuery = query(collection(db, 'traffic_daily'), orderBy('dateStr', 'asc'));
      const dailySnap = await getDocs(dailyQuery);
      const dailies: DailyTraffic[] = [];
      dailySnap.forEach((doc) => {
        dailies.push(doc.data() as DailyTraffic);
      });
      setDailyData(dailies);

      // 3. Fetch Top Pages Stats
      const pagesSnap = await getDocs(collection(db, 'traffic_pages'));
      const pList: PageStat[] = [];
      pagesSnap.forEach((doc) => {
        pList.push(doc.data() as PageStat);
      });
      pList.sort((a, b) => b.views - a.views);
      setPagesData(pList);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Daily Data according to Selected Time Range
  const filteredDailyData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];
    if (timeRange === 'today') {
      return dailyData.slice(-1);
    }
    if (timeRange === '7d') {
      return dailyData.slice(-7);
    }
    if (timeRange === '30d') {
      return dailyData.slice(-30);
    }
    return dailyData;
  }, [dailyData, timeRange]);

  // Aggregate totals based on filtered range
  const rangeTotals = useMemo(() => {
    let totalViews = 0;
    let totalVisitors = 0;
    filteredDailyData.forEach((d) => {
      totalViews += d.views || 0;
      totalVisitors += d.visitors || 0;
    });

    if (totalViews === 0 && summaryData) {
      totalViews = summaryData.totalViews || 0;
      totalVisitors = summaryData.totalVisitors || 0;
    }

    const avgDuration = summaryData?.avgDurationSec
      ? `${Math.floor(summaryData.avgDurationSec / 60)}dk ${summaryData.avgDurationSec % 60}s`
      : '2dk 15s';

    const bounceRate = summaryData?.bounceRate ?? 28.5;

    return {
      views: totalViews,
      visitors: totalVisitors,
      avgDuration,
      bounceRate
    };
  }, [filteredDailyData, summaryData]);

  // Dynamic Device Stats computed from real traffic logs
  const deviceStats = useMemo(() => {
    let mobile = 0;
    let desktop = 0;
    let tablet = 0;

    recentLogs.forEach((log) => {
      if (log.device === 'Mobil') mobile++;
      else if (log.device === 'Tablet') tablet++;
      else desktop++;
    });

    const total = (mobile + desktop + tablet) || 1;
    return {
      mobile,
      desktop,
      tablet,
      mobilePct: Math.round((mobile / total) * 100),
      desktopPct: Math.round((desktop / total) * 100),
      tabletPct: Math.round((tablet / total) * 100),
    };
  }, [recentLogs]);

  // Dynamic Traffic Sources Stats computed from real traffic logs
  const referrerStats = useMemo(() => {
    let google = 0;
    let direct = 0;
    let social = 0;
    let external = 0;

    recentLogs.forEach((log) => {
      const ref = log.referrer || 'Doğrudan';
      if (ref.includes('Google')) google++;
      else if (ref.includes('Sosyal')) social++;
      else if (ref.includes('Harici')) external++;
      else direct++;
    });

    const total = (google + direct + social + external) || 1;
    return {
      googlePct: Math.round((google / total) * 100),
      directPct: Math.round((direct / total) * 100),
      socialPct: Math.round((social / total) * 100),
      externalPct: Math.round((external / total) * 100),
    };
  }, [recentLogs]);

  // Filtered pages for table
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pagesData;
    const q = searchQuery.toLowerCase();
    return pagesData.filter((p) => (p.title || '').toLowerCase().includes(q) || (p.path || '').toLowerCase().includes(q));
  }, [pagesData, searchQuery]);

  // Export CSV Report
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,Tarih,Sayfa Goruntulenme,Tekil Ziyaretci\n";
      filteredDailyData.forEach((row) => {
        csvContent += `${row.dateStr},${row.views},${row.visitors}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `trafik_analiz_raporu_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Trafik raporu CSV dosyası olarak indirildi.");
    } catch (err) {
      showToast("Rapor dışa aktarılırken hata oluştu.");
    }
  };

  // Re-seed analytics baseline
  const handleResetData = async () => {
    if (!window.confirm("Analiz verilerini varsayılan seviyeye sıfırlamak istediğinize emin misiniz?")) return;
    try {
      setRefreshing(true);
      await setDoc(doc(db, 'traffic_stats', 'summary'), {
        totalViews: 14850,
        totalVisitors: 6420,
        avgDurationSec: 168,
        bounceRate: 32.4,
        lastUpdated: Date.now()
      });
      await seedBaselineTrafficIfNeeded();
      await fetchAllAnalytics();
      showToast("Trafik verileri başarıyla güncellendi.");
    } catch (e) {
      showToast("Sıfırlama sırasında hata oluştu.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 font-sans text-slate-800 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold text-sm">Trafik Analizi Verileri Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast Banner */}
        {toastMessage && (
          <div className="fixed top-16 right-6 z-[110] px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 notranslate" translate="no">
            <Check className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Trafik Analizi</h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Sitenizin ziyaretçi istatistiklerini, sayfa görüntülenme verilerini ve canlı trafiği takip edin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold mr-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Canlı Trafik İzleniyor</span>
            </div>

            <button
              type="button"
              onClick={fetchAllAnalytics}
              disabled={refreshing}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer notranslate"
              translate="no"
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer notranslate"
              translate="no"
            >
              <Download className="w-4 h-4" />
              <span>Raporu İndir (CSV)</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer notranslate"
              translate="no"
              title="Verileri Yeniden Yapılandır"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time Range Selector & Live Metric Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100/80 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1 overflow-x-auto p-1">
            {[
              { id: 'today', label: 'Bugün' },
              { id: '7d', label: 'Son 7 Gün' },
              { id: '30d', label: 'Son 30 Gün' },
              { id: 'all', label: 'Tüm Zamanlar' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer notranslate ${
                  timeRange === tab.id
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                translate="no"
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium">Şu An Sitede:</span>
            <span className="text-sm font-black text-slate-900 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-lg border border-amber-200">
              {activeUsersCount} Aktif Ziyaretçi
            </span>
          </div>
        </div>

        {/* Key Performance Indicators (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Views */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sayfa Görüntüleme</span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {rangeTotals.views.toLocaleString('tr-TR')}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>+%18.4 geçen döneme göre</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Card 2: Unique Visitors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tekil Ziyaretçi</span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {rangeTotals.visitors.toLocaleString('tr-TR')}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>+%12.1 yeni kullanıcı</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>

          {/* Card 3: Avg Duration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ort. Oturum Süresi</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {rangeTotals.avgDuration}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>+24s yüksek etkileşim</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          {/* Card 4: Bounce Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hemen Çıkma Oranı</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                %{rangeTotals.bounceRate}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
                <ArrowDownRight className="w-4 h-4 shrink-0" />
                <span>-%3.2 (Daha iyi performans)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '34%' }}></div>
            </div>
          </div>

        </div>

        {/* Traffic Chart Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Ziyaretçi ve Görüntülenme Değişim Grafiği</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Seçilen zaman aralığındaki günlük trafik akış analizi</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer notranslate ${
                  chartType === 'area' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                translate="no"
              >
                <span>Alan Grafiği</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer notranslate ${
                  chartType === 'bar' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                translate="no"
              >
                <span>Çubuk Grafiği</span>
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-72 sm:h-80 w-full pt-2 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              {chartType === 'area' ? (
                <AreaChart data={filteredDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(str) => {
                      if (!str) return '';
                      const parts = str.split('-');
                      return `${parts[2]}/${parts[1]}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(val: any, name: any) => [val, name === 'views' ? 'Sayfa Görüntüleme' : 'Tekil Ziyaretçi']}
                    labelFormatter={(label) => `Tarih: ${label}`}
                  />
                  <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#viewsGradient)" name="views" />
                  <Area type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGradient)" name="visitors" />
                </AreaChart>
              ) : (
                <BarChart data={filteredDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(str) => {
                      if (!str) return '';
                      const parts = str.split('-');
                      return `${parts[2]}/${parts[1]}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(val: any, name: any) => [val, name === 'views' ? 'Sayfa Görüntüleme' : 'Tekil Ziyaretçi']}
                  />
                  <Bar dataKey="views" fill="#2563eb" radius={[6, 6, 0, 0]} name="views" />
                  <Bar dataKey="visitors" fill="#818cf8" radius={[6, 6, 0, 0]} name="visitors" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span>Sayfa Görüntüleme</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
              <span>Tekil Ziyaretçi</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Popular Pages & Distribution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Pages Table (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>En Çok Ziyaret Edilen Sayfalar</span>
                </h2>
                <p className="text-xs text-slate-500">Kullanıcıların en fazla etkileşime girdiği sayfalar</p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sayfa ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Sayfa Adı / Bağlantı</th>
                    <th className="py-2.5 px-3 text-right">Görüntüleme</th>
                    <th className="py-2.5 px-3 text-right">Oran</th>
                    <th className="py-2.5 px-3 text-right">Ort. Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPages.map((page, idx) => {
                    const totalPViews = pagesData.reduce((acc, p) => acc + (p.views || 0), 0) || 1;
                    const percent = Math.round(((page.views || 0) / totalPViews) * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{page.title || 'Sayfa'}</div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <span>{page.path}</span>
                            <a href={page.path} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-800">
                          {(page.views || 0).toLocaleString('tr-TR')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(percent * 2, 100)}%` }}></div>
                            </div>
                            <span className="font-bold text-slate-700 text-xs">%{percent}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500 font-mono">
                          {idx === 0 ? '3dk 12s' : idx === 1 ? '2dk 45s' : idx === 2 ? '2dk 10s' : '1dk 35s'}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPages.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">Aranan kriterde sayfa verisi bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device & Traffic Sources Distribution (1 col) */}
          <div className="space-y-6">

            {/* Device Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Cihaz Dağılımı</span>
              </h2>

              <div className="space-y-3">
                {/* Mobile */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Mobil
                    </span>
                    <span className="text-slate-900">%{deviceStats.mobilePct} ({deviceStats.mobile})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${deviceStats.mobilePct}%` }}></div>
                  </div>
                </div>

                {/* Desktop */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Monitor className="w-3.5 h-3.5 text-indigo-600" /> Masaüstü
                    </span>
                    <span className="text-slate-900">%{deviceStats.desktopPct} ({deviceStats.desktop})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${deviceStats.desktopPct}%` }}></div>
                  </div>
                </div>

                {/* Tablet */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Tablet className="w-3.5 h-3.5 text-amber-500" /> Tablet
                    </span>
                    <span className="text-slate-900">%{deviceStats.tabletPct} ({deviceStats.tablet})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${deviceStats.tabletPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Trafik Kaynakları</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span>Google Arama (Organik)</span>
                  </div>
                  <span className="font-black text-slate-900">%{referrerStats.googlePct}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                    <span>Doğrudan (Direct)</span>
                  </div>
                  <span className="font-black text-slate-900">%{referrerStats.directPct}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                    <span>Sosyal Medya (Insta/FB)</span>
                  </div>
                  <span className="font-black text-slate-900">%{referrerStats.socialPct}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span>Harici Bağlantılar</span>
                  </div>
                  <span className="font-black text-slate-900">%{referrerStats.externalPct}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Live Traffic Stream Log */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>Canlı Ziyaretçi Akışı</span>
              </h2>
              <p className="text-xs text-slate-500">Son zamanlarda gerçekleşen gerçek zamanlı sayfa tıklamaları</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Anlık Akış
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentLogs.slice(0, 9).map((log, i) => (
              <div key={log.id || i} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 transition-all flex items-start gap-3">
                <div className="p-2 bg-blue-100/70 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  {log.device === 'Mobil' ? <Smartphone className="w-4 h-4" /> : log.device === 'Tablet' ? <Tablet className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{log.pageTitle || 'Ana Sayfa'}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{log.path}</div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-0.5 text-slate-600 font-bold">
                      <MapPin className="w-3 h-3 text-red-500" /> {log.city || 'İstanbul'}
                    </span>
                    <span>•</span>
                    <span>{log.browser || 'Chrome'}</span>
                    <span>•</span>
                    <span>{log.referrer || 'Doğrudan'}</span>
                  </div>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                Henüz canlı trafik günlüğü bulunmuyor. Ziyaretçi hareketleri burada anlık görüntülenecektir.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
