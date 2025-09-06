
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/shared/types';

interface AnalyticsDashboardProps {
  analytics: any;
  loading: boolean;
}


// Map category name to color for consistent chart coloring
const CATEGORY_COLOR_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_CATEGORIES.map(cat => [cat.name, cat.color])
);

export default function AnalyticsDashboard({ analytics, loading }: AnalyticsDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">Add some expenses to see your analytics.</p>
      </div>
    );
  }

  const { spendingByCategory = [], spendingTrends = [], insights = {} } = analytics;

  const categoryData = spendingByCategory.map((item: any) => ({
    ...item,
    color: CATEGORY_COLOR_MAP[item.category] || '#6b7280',
    name: item.category
  }));

  const trendData = spendingTrends.map((item: any) => ({
    ...item,
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

//  const topCategories = spendingByCategory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{insights.currentMonthSpending?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">₹{insights.averageDailySpending?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{insights.topCategory || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Month Change</p>
              <p className={`text-2xl font-bold ${insights.monthOverMonthChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {insights.monthOverMonthChange >= 0 ? '+' : ''}{insights.monthOverMonthChange?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="name"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Amount (INR)']} />
                <Legend formatter={(value) => <span>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No spending data available
            </div>
          )}
        </div>

        {/* Spending Trends Line Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Spending Trends (Last 30 Days)</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Daily Spending (INR)']} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Top Categories Bar Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Categories (INR)</h3>
        {categoryData.filter((cat: any) => cat.total > 0).length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData.filter((cat: any) => cat.total > 0)} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                stroke="#6b7280" 
                fontSize={12} 
                tickFormatter={v => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={14} width={140} />
              <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total Spent (INR)']} />
              <Bar 
                dataKey="total" 
                radius={[0, 4, 4, 0]} 
                label={({ value, x, y, width, height, index }: any) => (
                  <text
                    x={x + width + 8}
                    y={y + height / 2}
                    fill={categoryData[index]?.color || '#374151'}
                    fontSize={14}
                    alignmentBaseline="middle"
                  >
                    ₹{value.toLocaleString('en-IN')}
                  </text>
                )}
                >
                {categoryData.filter((cat: any) => cat.total > 0).map((entry: any, index: number) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-gray-500">
            No category data available
          </div>
        )}
      </div>

    </div>
  );
}
