import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Target } from 'lucide-react';
import type { ExpenseType } from '@/shared/types';

interface InsightsPanelProps {
  analytics: any;
  expenses: ExpenseType[];
  loading: boolean;
}

export default function InsightsPanel({ analytics, expenses, loading }: InsightsPanelProps) {
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

  const generateInsights = () => {
    if (!analytics || !expenses.length) return [];

    const insights = [];
    const { insights: analyticsInsights, spendingByCategory } = analytics;

    // Spending trend insight
    if (analyticsInsights.monthOverMonthChange !== undefined) {
      if (analyticsInsights.monthOverMonthChange > 20) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'High Spending Alert',
          description: `Your spending increased by ${analyticsInsights.monthOverMonthChange.toFixed(1)}% this month compared to last month. Consider reviewing your recent purchases.`,
          action: 'Review your top spending categories and look for areas to cut back.'
        });
      } else if (analyticsInsights.monthOverMonthChange < -10) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Great Job Saving!',
          description: `You've reduced your spending by ${Math.abs(analyticsInsights.monthOverMonthChange).toFixed(1)}% this month. Keep up the excellent work!`,
          action: 'Consider putting these savings into an emergency fund or investment.'
        });
      }
    }

    // Top category insight
    if (analyticsInsights.topCategory && spendingByCategory?.length) {
      const topCategorySpending = spendingByCategory[0];
      const totalSpending = spendingByCategory.reduce((sum: number, cat: any) => sum + cat.total, 0);
      const percentage = (topCategorySpending.total / totalSpending) * 100;

      if (percentage > 40) {
        insights.push({
          type: 'tip',
          icon: Target,
          title: 'Category Concentration',
          description: `${percentage.toFixed(1)}% of your spending is on ${analyticsInsights.topCategory}. This seems high for a single category.`,
          action: 'Consider setting a monthly budget for this category to better control spending.'
        });
      }
    }

    // Spending frequency insight
    const recentExpenses = expenses.slice(0, 10);
    const avgDaysBetween = calculateAverageSpendingFrequency(recentExpenses);
    
    if (avgDaysBetween < 1) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        title: 'Frequent Spending Pattern',
        description: 'You have multiple transactions per day on average. This could indicate impulse spending.',
        action: 'Try the "24-hour rule" - wait a day before making non-essential purchases.'
      });
    }

    // Weekly spending pattern
    const weekdaySpending = analyzeWeekdaySpending(expenses);
    if (weekdaySpending.weekendPercent > 60) {
      insights.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Weekend Spending Pattern',
        description: `${weekdaySpending.weekendPercent.toFixed(1)}% of your spending happens on weekends.`,
        action: 'Plan weekend activities with a set budget to avoid overspending on leisure.'
      });
    }

    // Daily average insight
    if (analyticsInsights.averageDailySpending > 100) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Daily Average',
        description: `Your average daily spending is ₹${analyticsInsights.averageDailySpending.toFixed(2)}. This adds up to over ₹3,000 per month.`,
        action: 'Set a daily spending limit and track progress to reduce this amount.'
      });
    }

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const calculateAverageSpendingFrequency = (expenses: ExpenseType[]) => {
    if (expenses.length < 2) return 7; // Default to once a week
    
    const dates = expenses.map(e => new Date(e.date).getTime()).sort((a, b) => b - a);
    let totalDays = 0;
    
    for (let i = 1; i < dates.length; i++) {
      totalDays += (dates[i-1] - dates[i]) / (1000 * 60 * 60 * 24);
    }
    
    return totalDays / (dates.length - 1);
  };

  const analyzeWeekdaySpending = (expenses: ExpenseType[]) => {
    let weekendTotal = 0;
    let weekdayTotal = 0;
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday = 0, Saturday = 6
        weekendTotal += expense.amount;
      } else {
        weekdayTotal += expense.amount;
      }
    });
    
    const total = weekendTotal + weekdayTotal;
    return {
      weekendPercent: total > 0 ? (weekendTotal / total) * 100 : 0,
      weekdayPercent: total > 0 ? (weekdayTotal / total) * 100 : 0
    };
  };

  const insights = generateInsights();

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-600';
      case 'warning': return 'from-orange-500 to-red-500';
      case 'tip': return 'from-blue-500 to-indigo-600';
      case 'info': return 'from-purple-500 to-violet-600';
      default: return 'from-emerald-500 to-teal-600';
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'tip': return 'bg-blue-50 border-blue-200';
      case 'info': return 'bg-purple-50 border-purple-200';
      default: return 'bg-emerald-50 border-emerald-200';
    }
  };

  if (!insights.length) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available yet</h3>
        <p className="text-gray-500">Add more expenses to get personalized AI insights about your spending habits.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Financial Insights</h2>
            <p className="text-gray-600">Personalized recommendations based on your spending patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl border-2 ${getInsightBg(insight.type)} hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 bg-gradient-to-r ${getInsightColor(insight.type)} rounded-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-gray-700 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="bg-white/50 rounded-lg p-3 border-l-4 border-gray-300">
                      <p className="text-sm font-medium text-gray-800">
                        💡 <span className="font-semibold">Recommendation:</span> {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* General Financial Tips */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">General Financial Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "50/30/20 Rule",
              tip: "Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment."
            },
            {
              title: "Emergency Fund",
              tip: "Aim to save 3-6 months of expenses for unexpected situations."
            },
            {
              title: "Track Small Expenses",
              tip: "Small daily purchases like coffee can add up to hundreds per month."
            },
            {
              title: "Use Cash for Discretionary Spending",
              tip: "Physical cash makes you more aware of your spending than cards."
            },
            {
              title: "Review Subscriptions",
              tip: "Cancel unused subscriptions and memberships to save money monthly."
            },
            {
              title: "Compare Prices",
              tip: "Always compare prices for major purchases and look for deals."
            }
          ].map((tip, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
