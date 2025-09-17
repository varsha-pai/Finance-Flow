// Hardcoded exchange rates to INR
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
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import {
  CreateExpenseSchema,
  CreateCategorySchema,
  DEFAULT_CATEGORIES,
} from "@/shared/types";

// Minimal local Env interface for TS builds (Cloudflare Workers bindings)
interface Env {
  DB: D1Database;
}

// D1Database minimal shape used in this file
interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { last_row_id: number; changes?: number } }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

const app = new Hono<{ Bindings: Env }>();

// Allow browser requests from any origin (adjust origin to your domain if needed)
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

const MOCK_USER_ID = '01991a93-71cc-768d-b863-88c72628dcf0';

// Expenses endpoints
app.get('/api/expenses', async (c) => {
  // Check if user already has categories, if not create them
  const existingCategories = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM categories WHERE user_id = ?"
  ).bind(MOCK_USER_ID).first();

  if (existingCategories?.count === 0) {
    // Create default categories for new user
    for (const category of DEFAULT_CATEGORIES) {
      await c.env.DB.prepare(
        "INSERT INTO categories (user_id, name, color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
      ).bind(MOCK_USER_ID, category.name, category.color, category.icon).run();
    }
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC"
  ).bind(MOCK_USER_ID).all();

  return c.json(results);
});

app.post('/api/expenses', zValidator('json', CreateExpenseSchema.passthrough()), async (c) => {
  const data = c.req.valid('json');
  // Use INR as default if not provided
  const { amount, description, category, date } = data;
  const currency = data.currency || 'INR';

  const result = await c.env.DB.prepare(
    "INSERT INTO expenses (user_id, amount, description, category, date, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(MOCK_USER_ID, amount, description, category, date, currency).run();

  const expense = await c.env.DB.prepare(
    "SELECT * FROM expenses WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(expense, 201);
});

app.delete('/api/expenses/:id', async (c) => {
  const id = c.req.param('id');

  const result = await c.env.DB.prepare(
    "DELETE FROM expenses WHERE id = ? AND user_id = ?"
  ).bind(id, MOCK_USER_ID).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Expense not found' }, 404);
  }

  return c.json({ success: true });
});

// Categories endpoints
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM categories WHERE user_id = ? ORDER BY name"
  ).bind(MOCK_USER_ID).all();

  return c.json(results);
});

app.post('/api/categories', zValidator('json', CreateCategorySchema), async (c) => {
  const data = c.req.valid('json');

  const result = await c.env.DB.prepare(
    "INSERT INTO categories (user_id, name, color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(MOCK_USER_ID, data.name, data.color, data.icon).run();

  const category = await c.env.DB.prepare(
    "SELECT * FROM categories WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(category, 201);
});

// Analytics endpoints
app.get('/api/analytics/spending-by-category', async (c) => {
  // Get all expenses for the last 30 days
  const { results } = await c.env.DB.prepare(
    "SELECT category, amount, currency FROM expenses WHERE user_id = ? AND date >= date('now', '-30 days')"
  ).bind(MOCK_USER_ID).all();

  // Group and sum in INR, ensure all default categories are present
  const categoryMap: Record<string, { total: number, count: number, amounts: number[] }> = {};
  // Initialize all default categories with zero
  for (const cat of DEFAULT_CATEGORIES) {
    categoryMap[cat.name] = { total: 0, count: 0, amounts: [] };
  }
  for (const exp of results) {
    const category = String(exp.category);
    const amount = Number(exp.amount);
    const currency = exp.currency ? String(exp.currency) : undefined;
    const inrAmount = toINR(amount, currency);
    if (!categoryMap[category]) {
      categoryMap[category] = { total: 0, count: 0, amounts: [] };
    }
    categoryMap[category].total += inrAmount;
    categoryMap[category].count += 1;
    categoryMap[category].amounts.push(inrAmount);
  }
  const out = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count,
    average: data.amounts.length ? data.total / data.amounts.length : 0,
  })).sort((a, b) => b.total - a.total);
  return c.json(out);
});

app.get('/api/analytics/spending-trends', async (c) => {
  // Get all expenses for the last 30 days
  const { results } = await c.env.DB.prepare(
    "SELECT date(date) as day, amount, currency FROM expenses WHERE user_id = ? AND date >= date('now', '-30 days') ORDER BY day"
  ).bind(MOCK_USER_ID).all();

  // Group by day and sum in INR
  const dayMap: Record<string, number> = {};
  for (const exp of results) {
    const day = String(exp.day);
    const amount = Number(exp.amount);
    const currency = exp.currency ? String(exp.currency) : undefined;
    const inrAmount = toINR(amount, currency);
    if (!dayMap[day]) dayMap[day] = 0;
    dayMap[day] += inrAmount;
  }
  const out = Object.entries(dayMap).map(([day, total]) => ({ day, total }));
  return c.json(out);
});

app.get('/api/analytics/insights', async (c) => {
  // Get all expenses for current and previous month
  const { results: allExpenses } = await c.env.DB.prepare(
    "SELECT amount, currency, category, date FROM expenses WHERE user_id = ?"
  ).bind(MOCK_USER_ID).all();

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = prevMonthDate.toISOString().slice(0, 7);

  let currentMonthTotal = 0, previousMonthTotal = 0;
  let topCategoryMap: Record<string, number> = {};
  let dailyTotals: Record<string, number> = {};

  for (const exp of allExpenses) {
    const amount = Number(exp.amount);
    const currency = exp.currency ? String(exp.currency) : undefined;
    const category = String(exp.category);
    const date = String(exp.date);
    const inrAmount = toINR(amount, currency);
    const expMonth = date.slice(0, 7);
    if (expMonth === thisMonth) {
      currentMonthTotal += inrAmount;
      // Top category
      if (!topCategoryMap[category]) topCategoryMap[category] = 0;
      topCategoryMap[category] += inrAmount;
    }
    if (expMonth === prevMonth) {
      previousMonthTotal += inrAmount;
    }
    // Daily totals (last 30 days)
    const expDate = date;
    const daysAgo = (now.getTime() - new Date(expDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo <= 30) {
      if (!dailyTotals[expDate]) dailyTotals[expDate] = 0;
      dailyTotals[expDate] += inrAmount;
    }
  }

  // Top category
  let topCategory = null, topCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(topCategoryMap)) {
    if (amt > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = amt;
    }
  }

  // Average daily spending (last 30 days)
  const avgDaily = Object.values(dailyTotals);
  const averageDailySpending = avgDaily.length ? avgDaily.reduce((a, b) => a + b, 0) / avgDaily.length : 0;

  const insights = {
    currentMonthSpending: currentMonthTotal,
    previousMonthSpending: previousMonthTotal,
    topCategory,
    topCategoryAmount,
    averageDailySpending,
    monthOverMonthChange: previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0,
  };
  return c.json(insights);
});

export default app;
