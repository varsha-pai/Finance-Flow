import z from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
  currency: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  currency: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
});

export const BudgetSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  category: z.string(),
  amount: z.number(),
  month: z.number(),
  year: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateBudgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export type ExpenseType = z.infer<typeof ExpenseSchema>;
export type CreateExpenseType = z.infer<typeof CreateExpenseSchema>;
export type CategoryType = z.infer<typeof CategorySchema>;
export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export type BudgetType = z.infer<typeof BudgetSchema>;
export type CreateBudgetType = z.infer<typeof CreateBudgetSchema>;

export const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", color: "#ef4444", icon: "utensils" },
  { name: "Transportation", color: "#3b82f6", icon: "car" },
  { name: "Shopping", color: "#8b5cf6", icon: "shopping-bag" },
  { name: "Entertainment", color: "#f59e0b", icon: "music" },
  { name: "Bills & Utilities", color: "#10b981", icon: "receipt" },
  { name: "Healthcare", color: "#ec4899", icon: "heart" },
  { name: "Education", color: "#06b6d4", icon: "book" },
  { name: "Travel", color: "#84cc16", icon: "plane" },
  { name: "Other", color: "#6b7280", icon: "more-horizontal" },
];
