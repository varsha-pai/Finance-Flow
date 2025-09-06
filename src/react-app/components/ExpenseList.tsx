import { Trash2, Calendar, Tag } from "lucide-react";
import type { ExpenseType, CategoryType } from "@/shared/types";

interface ExpenseListProps {
  expenses: ExpenseType[];
  categories: CategoryType[];
  onDelete: (id: number) => Promise<void>;
}

export default function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start tracking your spending by adding your first expense.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: getCategoryColor(expense.category) }}
            >
              {(expense.currency === 'INR' || !expense.currency) ? '₹' : expense.currency === 'USD' ? '$' : expense.currency + ' '}{Math.round(expense.amount)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{expense.description}</p>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{expense.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold text-gray-900">{(expense.currency === 'INR' || !expense.currency) ? '₹' : expense.currency === 'USD' ? '$' : expense.currency + ' '}{expense.amount.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
