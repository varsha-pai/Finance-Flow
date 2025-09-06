import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/react-app/pages/Dashboard";
import HomePage from "@/react-app/pages/Home";
import BudgetPlanner from './components/BudgetPlanner';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/budget-planner" element={<BudgetPlanner />} />
      </Routes>
      <nav className="w-full flex items-center gap-6 px-6 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-b border-teal-100">
        <a href="/dashboard" className="text-gray-700 font-medium hover:text-teal-600">Dashboard</a>
      </nav>
    </Router>
  );
}
