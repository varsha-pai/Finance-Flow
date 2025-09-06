import { useState, useEffect } from "react";
import type { 
  ExpenseType, 
  CreateExpenseType, 
  CategoryType, 
  CreateCategoryType 
} from "@/shared/types";

export function useApi() {
  const apiCall = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  return { apiCall };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/expenses');
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: CreateExpenseType) => {
    try {
      const newExpense = await apiCall('/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      });
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await apiCall(`/expenses/${id}`, { method: 'DELETE' });
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: CreateCategoryType) => {
    try {
      const newCategory = await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    refetch: fetchCategories,
  };
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [spendingByCategory, spendingTrends, insights] = await Promise.all([
        apiCall('/analytics/spending-by-category'),
        apiCall('/analytics/spending-trends'),
        apiCall('/analytics/insights'),
      ]);

      setAnalytics({
        spendingByCategory,
        spendingTrends,
        insights,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics,
  };
}
