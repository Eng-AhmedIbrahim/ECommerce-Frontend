import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiMenu,
  FiGrid,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiPackage,
  FiLayers,
} from "react-icons/fi";
import {
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

import "./Dashboard.css";

const useDashboardState = () => {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);

  const kpis = [
    { id: 1, title: "المبيعات", value: "EGP 128,450", icon: <HiOutlineCurrencyDollar size={20} />, trend: "+5.4%", trendColor: "trend-green" },
    { id: 2, title: "العملاء", value: "2,430", icon: <HiOutlineUsers size={20} />, trend: "+2.1%", trendColor: "trend-green" },
    { id: 3, title: "الأوامر", value: "1,124", icon: <HiOutlineShoppingCart size={20} />, trend: "-1.5%", trendColor: "trend-red" },
  ];

  const lineData = [
    { name: "Oct 1", sales: 4000 },
    { name: "Oct 5", sales: 3000 },
    { name: "Oct 10", sales: 5000 },
    { name: "Oct 15", sales: 4780 },
    { name: "Oct 20", sales: 5890 },
    { name: "Oct 25", sales: 4390 },
    { name: "Oct 30", sales: 5489 },
  ];

  const barData = [
    { name: "Electronics", uv: 4000, pv: 2400 },
    { name: "Fashion", uv: 3000, pv: 1398 },
    { name: "Home", uv: 2000, pv: 9800 },
    { name: "Books", uv: 2780, pv: 3908 },
    { name: "Toys", uv: 1890, pv: 4800 },
  ];

  const transactions = [
    { id: 1, user: "محمد علي", amount: "EGP 1,250", status: "Completed", date: "2025-11-28" },
    { id: 2, user: "سارة محمود", amount: "EGP 320", status: "Pending", date: "2025-11-29" },
    { id: 3, user: "أحمد سمير", amount: "EGP 850", status: "Refunded", date: "2025-11-30" },
    { id: 4, user: "ليلى حسين", amount: "EGP 2,100", status: "Completed", date: "2025-12-01" },
  ];

  const sidebarNav = [
    { name: "لوحة التحكم", href: "#", icon: FiGrid },
    { name: "المستخدمين", href: "#", icon: FiUsers },
    { name: "المنتجات", href: "#", icon: FiPackage },
    { name: "الفئات", href: "#", icon: FiLayers },
    { name: "الأوامر", href: "#", icon: FiShoppingCart },
    { name: "التقارير", href: "#", icon: FiBarChart },
    { name: "الإعدادات", href: "#", icon: FiSettings },
  ];

  const filteredTransactions = useMemo(() => {
    if (!query) return transactions;
    const q = query.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        t.user.toLowerCase().includes(q) ||
        t.amount.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [query, transactions]);

  return {
    query,
    setQuery,
    sidebarOpen,
    setSidebarOpen,
    dark,
    setDark,
    kpis,
    lineData,
    barData,
    filteredTransactions,
    sidebarNav,
  };
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Completed": return "status-completed";
    case "Pending": return "status-pending";
    case "Refunded": return "status-refunded";
    default: return "status-default";
  }
};

export default function Dashboard() {
  const {
    query, setQuery, sidebarOpen, setSidebarOpen, dark, setDark,
    kpis, lineData, barData, filteredTransactions, sidebarNav,
  } = useDashboardState();

  return (
    <div className={`dashboard-container ${dark ? "dark" : ""}`} dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="layout-flex">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon">M</div>
              {sidebarOpen && <h1 className="logo-title">Marktech</h1>}
            </div>
            <button className="menu-toggle-btn" onClick={() => setSidebarOpen(s => !s)}>
              <FiMenu size={20} />
            </button>
          </div>
          <nav className="sidebar-nav">
            {sidebarNav.map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.href} className="nav-item">
                  <Icon size={20} />
                  {sidebarOpen && <span className="nav-text">{item.name}</span>}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          {/* Header */}
          <header className="main-header">
            <div className="header-controls">
              <div className="search-box">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث هنا..."
                  className="search-input"
                />
                <FiSearch className="search-icon" />
              </div>
              <div className="action-buttons-group">
                <button className="action-button">تصفية</button>
                <button className="action-button">تصدير</button>
              </div>
            </div>
            <div className="user-controls">
              <button
                onClick={() => setDark(d => !d)}
                className="theme-toggle-btn"
              >
                {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <div className="user-profile">
                <img src="https://i.pravatar.cc/40?img=1" alt="avatar" className="user-avatar" />
                <div className="user-name">أحمد</div>
              </div>
            </div>
          </header>

          {/* KPI Cards */}
          <section className="kpi-cards-grid">
            {kpis.map(k => (
              <div key={k.id} className="kpi-card">
                <div className="kpi-main">
                  <div>
                    <div className="kpi-title">{k.title}</div>
                    <div className="kpi-value">{k.value}</div>
                  </div>
                  <div className="kpi-icon-wrapper">{k.icon}</div>
                </div>
                <div className={`kpi-trend ${k.trendColor}`}>
                  {k.trend} مقارنة بالأسبوع الماضي
                </div>
              </div>
            ))}
          </section>

          {/* Charts */}
          <section className="charts-grid">
            <div className="chart-panel chart-line">
              <h3 className="chart-title">مبيعات الشهر</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="name" stroke={dark ? "#d1d5db" : "#4b5563"} />
                    <YAxis stroke={dark ? "#d1d5db" : "#4b5563"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dark ? "#1f2937" : "#fff",
                        border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: dark ? "#d1d5db" : "#4b5563" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={dark ? "#4A90E2" : "#1f80be"}
                      strokeWidth={3}
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-panel chart-bar">
              <h3 className="chart-title">فئات الأكثر مبيعاً</h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#e5e7eb"} horizontal={false} />
                    <XAxis type="number" stroke={dark ? "#d1d5db" : "#4b5563"} />
                    <YAxis type="category" dataKey="name" stroke={dark ? "#d1d5db" : "#4b5563"} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dark ? "#1f2937" : "#fff",
                        border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: dark ? "#d1d5db" : "#4b5563" }}
                    />
                    <Legend />
                    <Bar dataKey="pv" fill="#F03A37" name="PV" barSize={10} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section className="transactions-panel">
            <div className="transactions-header">
              <h4 className="panel-title">آخر المعاملات</h4>
              <div className="result-count">عرض {filteredTransactions.length} نتيجة</div>
            </div>
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>العميل</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                    <tr key={t.id}>
                      <td>{t.user}</td>
                      <td>{t.amount}</td>
                      <td><span className={`status-badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td>{t.date}</td>
                      <td><button className="view-button">عرض</button></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="no-results">لا توجد معاملات مطابقة للبحث.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="main-footer">© 2025 Marktech - لوحة تحكم تجريبية.</footer>
        </main>
      </div>
    </div>
  );
}
