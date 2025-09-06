import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Sparkles, DollarSign } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FinanceFlow
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Financial Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your Money with
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent block">
                Smart Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Track expenses effortlessly, discover spending patterns, and get personalized financial advice powered by AI. 
              Your path to financial freedom starts here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize your spending patterns with beautiful charts and get actionable insights about your financial habits.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Tips</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive personalized recommendations and financial tips based on your spending behavior and goals.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your financial data is encrypted and secure. We prioritize your privacy and never share your information.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto"
            >
              Get Started Free
            </Link>
            <p className="text-sm text-gray-500">
              No sign-in required • No credit card required
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2025 FinanceFlow. Built with care for your financial future.</p>
        </div>
      </footer>
    </div>
  );
}
