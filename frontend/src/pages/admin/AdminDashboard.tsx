import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Users, Calendar, ArrowUpRight, TrendingUp, Package, RefreshCw } from 'lucide-react';
import api from '@/api/axios';
import { Coffee } from 'lucide-react';

const COLORS = ['#1A3324', '#D4AF37', '#3C2415', '#A5D6A7', '#EF9A9A'];

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/gold-logo.png" className="w-12 h-12 animate-spin mb-4 object-contain" alt="Loading" />
        <p className="text-coffee-500 text-sm">Gathering store metrics...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    activeSubscriptions: 0,
  };

  const recentOrders = dashboardData?.recentOrders || [];
  const topProducts = dashboardData?.topProducts || [];
  const ordersByStatus = (dashboardData?.ordersByStatus || []).map((item: any) => ({
    name: item.status,
    value: item._count || item.count || 0,
  }));

  // Setup sample chart data if DB query is empty/unformatted
  const chartData = (dashboardData?.revenueByMonth || []).map((item: any) => ({
    name: item.month,
    revenue: item.revenue || 0,
  }));

  const metrics = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Orders Placed', value: stats.totalOrders, icon: ShoppingBag, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: RefreshCw, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900 dark:text-cream-50">Overview & Insights</h1>
        <p className="text-coffee-500 dark:text-coffee-400">Café performance, transactions, and user summaries.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-coffee-950 p-6 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-coffee-400">{card.label}</p>
              <p className="text-2xl font-bold mt-2 text-coffee-900 dark:text-cream-50">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white dark:bg-coffee-950 p-6 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-500" /> Revenue Growth
            </h3>
            <span className="text-xs text-coffee-400 font-semibold">Last 6 Months</span>
          </div>

          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3324" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A3324" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#1A3324" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-coffee-400">
                No monthly sales records to display.
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-coffee-950 p-6 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-coffee-900 dark:text-cream-100 mb-4">Orders Distribution</h3>

          <div className="h-56 relative flex items-center justify-center">
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-coffee-400">No statuses to chart.</div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {ordersByStatus.map((status: any, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-coffee-600 dark:text-cream-250 truncate capitalize">
                  {status.name.toLowerCase()} ({status.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-coffee-950 p-6 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100">Recent Orders</h3>
            <TrendingUp className="w-4 h-4 text-coffee-400" />
          </div>

          <div className="space-y-4">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-50 dark:border-forest-500/5 text-sm">
                <div>
                  <p className="font-bold text-coffee-900 dark:text-cream-100">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-coffee-500">{order.user?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-forest-650">₹{order.total}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-400 border border-forest-150 uppercase tracking-wide">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular / Best Sellers */}
        <div className="bg-white dark:bg-coffee-950 p-6 rounded-2xl border border-coffee-100 dark:border-forest-500/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-coffee-900 dark:text-cream-100">Popular Offerings</h3>
            <Package className="w-4 h-4 text-coffee-400" />
          </div>

          <div className="space-y-4">
            {topProducts.map((tp: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-50 dark:border-forest-500/5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-forest-500/10 flex items-center justify-center font-bold text-forest-600">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-coffee-900 dark:text-cream-100">{tp.product?.name || 'Artisanal Blend'}</p>
                    <p className="text-xs text-coffee-500">{tp._sum?.quantity || tp.quantity} items sold</p>
                  </div>
                </div>
                <p className="font-bold text-coffee-900 dark:text-cream-50">₹{tp._sum?.total || tp.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
