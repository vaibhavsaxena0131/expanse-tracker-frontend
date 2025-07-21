import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import React, { useMemo } from "react";
import type { Expense } from "../features/expensesSlice";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4D4F", "#A020F0", "#82ca9d", "#FF69B4",
  "#FFD700", "#A9A9A9", "#40E0D0", "#FF6347", "#B8860B", "#4682B4", "#32CD32"
];

export default function TeamAnalytics({ expenses, loading }: { expenses: Expense[]; loading: boolean }) {
  const total = useMemo(() =>
    expenses.reduce((sum, exp) => sum + Number(exp.amount), 0), [expenses]);
  const totalPending = useMemo(() =>
    expenses.filter(exp => exp.status === "PENDING").reduce((sum, exp) => sum + Number(exp.amount), 0), [expenses]);
  const totalApproved = useMemo(() =>
    expenses.filter(exp => exp.status === "APPROVED").reduce((sum, exp) => sum + Number(exp.amount), 0), [expenses]);
  const totalSubmissions = expenses.length;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + Number(exp.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const monthlyTrends = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(exp => {
      const month = exp.date.slice(0, 7);
      map[month] = (map[month] || 0) + Number(exp.amount);
    });
    return Object.entries(map).map(([month, value]) => ({ month, value }));
  }, [expenses]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Team Analytics</h2>
      <div className="text-gray-500 mb-6">Comprehensive overview of team expense patterns</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">💲</div>
          <div className="text-xs text-gray-500">Total Expenses</div>
          <div className="text-2xl font-bold">${total.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-xs text-gray-500">Total Submissions</div>
          <div className="text-2xl font-bold">{String(totalSubmissions).padStart(6, "0")}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">⏰</div>
          <div className="text-xs text-gray-500">Pending</div>
          <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-xs text-gray-500">Approved</div>
          <div className="text-2xl font-bold">${totalApproved.toLocaleString()}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Team Expenses by Category</div>
          {loading ? (
            <div className="text-indigo-600 text-center py-16">Loading...</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name }) => name}
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                {categoryData.map((entry, idx) => (
                  <span key={entry.name} className="flex items-center gap-1">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: COLORS[idx % COLORS.length] }}
                    ></span>
                    {entry.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Monthly Expense Trends</div>
          {loading ? (
            <div className="text-indigo-600 text-center py-16">Loading...</div>
          ) : monthlyTrends.length === 0 ? (
            <div className="text-gray-400 text-center py-16">No monthly data available</div>
          ) : (
            <div>Coming Soon...</div>
          )}
        </div>
      </div>
    </div>
  );
}