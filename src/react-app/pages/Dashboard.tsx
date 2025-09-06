import { useState } from "react";
import { Plus, DollarSign, Loader2 } from "lucide-react";
import { useExpenses, useCategories, useAnalytics } from "@/react-app/hooks/useApi";
import ExpenseForm from "@/react-app/components/ExpenseForm";
import ExpenseList from "@/react-app/components/ExpenseList";
import AnalyticsDashboard from "@/react-app/components/AnalyticsDashboard";
import InsightsPanel from "@/react-app/components/InsightsPanel";

export default function Dashboard() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { expenses, loading: expensesLoading, addExpense, deleteExpense } = useExpenses();
  const { categories, loading: categoriesLoading } = useCategories();
  const { analytics, loading: analyticsLoading } = useAnalytics();

  if (expensesLoading || categoriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="animate-spin">
          <Loader2 className="w-8 h-8 text-emerald-600" />
        </div>
        <p className="text-gray-600 font-medium mt-4">Loading your financial data...</p>
      </div>
    );
  }

  // Use INR conversion for total spent
  const EXCHANGE_RATES: Record<string, number> = {
    'INR': 1,
    'USD': 83,
    'EUR': 90,
    'GBP': 105,
    'JPY': 0.55,
    'AUD': 55,
    'CAD': 61,
  };
  function toINR(amount: number, currency: string | undefined): number {
    if (!currency || !EXCHANGE_RATES[currency]) return amount;
    return amount * EXCHANGE_RATES[currency];
  }
  const totalSpent = expenses.reduce((sum, expense) => sum + toINR(expense.amount, expense.currency), 0);
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExpenseForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'expenses', label: 'Expenses' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'insights', label: 'AI Insights' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {/* Budget Planner tab as a link */}
          <a
            href="/budget-planner"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50 ml-2"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            Budget Planner
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
                <p className="text-3xl font-bold text-emerald-600">₹{totalSpent.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
                <p className="text-3xl font-bold text-teal-600">
                  ₹{analytics?.insights?.currentMonthSpending?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics?.insights?.monthOverMonthChange > 0 ? '+' : ''}{analytics?.insights?.monthOverMonthChange?.toFixed(1) || 0}% vs last month
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Transactions</h3>
                <p className="text-3xl font-bold text-purple-600">{expenses.length}</p>
                <p className="text-sm text-gray-500 mt-1">Tracked expenses</p>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
                <ExpenseList 
                  expenses={recentExpenses} 
                  categories={categories} 
                  onDelete={deleteExpense} 
                />
                {expenses.length > 5 && (
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className="w-full mt-4 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                  >
                    View All Expenses
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowExpenseForm(true)}
                    className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Add New Expense
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full p-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className="w-full p-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Get AI Insights
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'expenses' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Expenses</h2>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
            <ExpenseList 
              expenses={expenses} 
              categories={categories} 
              onDelete={deleteExpense} 
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} loading={analyticsLoading} />
        )}

        {activeTab === 'insights' && (
          <InsightsPanel analytics={analytics} expenses={expenses} loading={analyticsLoading} />
        )}
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          categories={categories}
          onSubmit={addExpense}
          onCancel={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
}
