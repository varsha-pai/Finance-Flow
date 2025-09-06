
import { useState, useEffect } from 'react';
//BudgetPlannerComponent: Card UI + Progress Table + Habit Tracker Checkboxes
import { Plus, DollarSign } from "lucide-react";

export default function BudgetPlannerComponent() {
  // Editable spendings and savings state
  const [spendings, setSpendings] = useState({
    Groceries: 5000,
    Transport: 2000,
    Entertainment: 1500,
    Utilities: 1200,
  });
  const [savings, setSavings] = useState({
    'Emergency Fund': 3000,
    Investments: 2000,
    Travel: 1000,
  });
  // Habit tracker state: { [category]: [bool, ...4] } (weekly, 4 weeks)
  const [habitGrid, setHabitGrid] = useState<{ [cat: string]: boolean[][] }>(() => {
    const saved = localStorage.getItem('budget_habit_grid_weekly4x7');
    if (saved) return JSON.parse(saved);
    const grid: { [cat: string]: boolean[][] } = {};
    [...Object.keys(spendings), ...Object.keys(savings)].forEach(cat => {
      grid[cat] = Array(4).fill(null).map(() => Array(7).fill(false));
    });
    return grid;
  });
  useEffect(() => {
  localStorage.setItem('budget_habit_grid_weekly4x7', JSON.stringify(habitGrid));
  }, [habitGrid]);
  const handleHabitCheck = (cat: string, week: number, day: number) => {
    setHabitGrid((prev: { [cat: string]: boolean[][] }) => ({
      ...prev,
      [cat]: prev[cat].map((weekArr, wIdx) =>
        wIdx === week
          ? weekArr.map((v, dIdx) => dIdx === day ? !v : v)
          : weekArr
      )
    }));
  };
  const handleSpendChange = (key: string, value: string) => {
    setSpendings((prev: typeof spendings) => ({ ...prev, [key]: Number(value) }));
  };
  const handleSaveChange = (key: string, value: string) => {
    setSavings((prev: typeof savings) => ({ ...prev, [key]: Number(value) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header (copied from Dashboard) */}
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
              <a
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                style={{ textDecoration: 'none' }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation Tabs (copied from Dashboard) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1">
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            Overview
          </a>
          <a
            href="/dashboard#expenses"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            Expenses
          </a>
          <a
            href="/dashboard#analytics"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            Analytics
          </a>
          <a
            href="/dashboard#insights"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            AI Insights
          </a>
          <a
            href="/budget-planner"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md ml-2"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            Budget Planner
          </a>
        </div>
      </div>
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400 tracking-tight mb-2">Budget & Savings Planner</h1>
          <p className="text-lg text-gray-500">Plan your spendings, set savings goals, and track your progress with a beautiful, organized dashboard.</p>
        </header>
        {/* Monthly Progress Bar */}
        <div>
          <div className="text-2xl font-semibold text-orange-500">Monthly Progress</div>
          <div className="text-sm text-gray-500">Track your savings and spending goals for this month</div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <div className="w-full bg-orange-100 rounded-full h-4">
            <div className="bg-orange-400 h-4 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">70% of goal reached</div>
        </div>
      </div>
      {/* Grid for Budget, Savings, and Goals - pastel cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Editable Spendings */}
        <div className="bg-orange-50 rounded-2xl shadow p-6 border border-orange-100">
          <h2 className="text-xl font-bold text-orange-500 mb-2">Planned Spendings</h2>
          <ul className="text-gray-700 space-y-2">
            {Object.entries(spendings).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between">
                <span>{key}:</span>
                <input
                  type="number"
                  className="ml-2 w-24 border border-gray-200 rounded-lg p-1 text-right focus:ring-2 focus:ring-orange-200 bg-white"
                  value={typeof value === 'number' ? value : ''}
                  min={0}
                  onChange={e => handleSpendChange(key, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Editable Savings */}
        <div className="bg-pink-50 rounded-2xl shadow p-6 border border-pink-100">
          <h2 className="text-xl font-bold text-pink-500 mb-2">Planned Savings</h2>
          <ul className="text-gray-700 space-y-2">
            {Object.entries(savings).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between">
                <span>{key}:</span>
                <input
                  type="number"
                  className="ml-2 w-24 border border-gray-200 rounded-lg p-1 text-right focus:ring-2 focus:ring-pink-200 bg-white"
                  value={typeof value === 'number' ? value : ''}
                  min={0}
                  onChange={e => handleSaveChange(key, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Savings Goal */}
        <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-100">
          <h2 className="text-xl font-bold text-green-500 mb-2">Savings Goal</h2>
          <div className="mb-2 font-medium">Set your goal:</div>
          <input type="number" className="w-full border border-gray-200 rounded-lg p-2 mb-2 bg-white" placeholder="Enter amount (₹)" />
          <button className="w-full bg-green-400 text-white rounded-lg py-2 font-semibold hover:bg-green-500 transition">Set Goal</button>
          <div className="mt-4 text-sm text-gray-500">Track your progress daily, monthly, and yearly.</div>
        </div>
      </div>
      {/* Progress & Reflections Table with weekly checkboxes */}
      <div className="bg-white/80 rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Progress & Reflections</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-center">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2 align-bottom" rowSpan={2}>Category</th>
                {[...Array(4)].map((_, w) => (
                  <th key={w} className={`p-2 text-center`} colSpan={7}>{`Week ${w+1}`}</th>
                ))}
              </tr>
              <tr className="bg-orange-50">
                {[...Array(4)].flatMap((_, w) => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, dIdx) => (
                  <th
                    key={w*7+dIdx}
                    className={
                      `p-1 font-normal` +
                      (dIdx === 0 && w !== 0 ? ' border-l-4 border-orange-200' : '')
                    }
                  >
                    {d}
                  </th>
                )))}
              </tr>
            </thead>
            <tbody>
              {/* Spendings rows with checkboxes */}
              {Object.keys(spendings).map((cat) => (
                <tr key={cat}>
                  <td className="p-2 font-semibold text-orange-500 text-left bg-orange-50">{cat}</td>
                  {[...Array(4)].map((_, w) =>
                    [...Array(7)].map((_, d) => (
                      <td
                        key={w*7+d}
                        className={
                          `p-1` +
                          (d === 0 && w !== 0 ? ' border-l-4 border-orange-200' : '')
                        }
                      >
                        <input
                          type="checkbox"
                          className="accent-orange-400"
                          checked={habitGrid[cat]?.[w]?.[d] || false}
                          onChange={() => handleHabitCheck(cat, w, d)}
                        />
                      </td>
                    ))
                  )}
                </tr>
              ))}
              {/* Savings rows with checkboxes */}
              {Object.keys(savings).map((cat) => (
                <tr key={cat}>
                  <td className="p-2 font-semibold text-pink-500 text-left bg-pink-50">{cat}</td>
                  {[...Array(4)].map((_, w) =>
                    [...Array(7)].map((_, d) => (
                      <td
                        key={w*7+d}
                        className={
                          `p-1` +
                          (d === 0 && w !== 0 ? ' border-l-4 border-orange-200' : '')
                        }
                      >
                        <input
                          type="checkbox"
                          className="accent-pink-400"
                          checked={habitGrid[cat]?.[w]?.[d] || false}
                          onChange={() => handleHabitCheck(cat, w, d)}
                        />
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="font-semibold text-orange-400 mb-1">Weekly Reflection</div>
            <textarea className="w-full border border-gray-200 rounded-lg p-2" rows={2} placeholder="How did you do this week?"></textarea>
          </div>
          <div className="bg-pink-50 rounded-xl p-4">
            <div className="font-semibold text-pink-400 mb-1">Monthly Reflection</div>
            <textarea className="w-full border border-gray-200 rounded-lg p-2" rows={2} placeholder="How did you do this month?"></textarea>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="font-semibold text-green-400 mb-1">Next Month's Goals</div>
            <textarea className="w-full border border-gray-200 rounded-lg p-2" rows={2} placeholder="What are your goals for next month?"></textarea>
          </div>
        </div>
      </div>
    </div>
    );
  
  }
