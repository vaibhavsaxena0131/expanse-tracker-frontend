import { CurrencyRupeeIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import type { Expense } from "../features/expensesSlice";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Label,
} from "recharts";

const CATEGORY_COLORS = [
  "#6366f1", "#34D399", "#F59E42", "#EF4444", "#A78BFA", "#F472B6", "#06B6D4"
];

function renderCustomizedLabel(props: { percent?: number }) {
  return `${((props.percent ?? 0) * 100).toFixed(0)}%`;
}

export default function DashboardAnalytics({ expenses }: { expenses: Expense[] }) {
  // Analytics
  const total = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
  const approved = useMemo(() => expenses.filter(e => e.status === "APPROVED").reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
  const pending = useMemo(() => expenses.filter(e => e.status === "PENDING").reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
  const rejected = useMemo(() => expenses.filter(e => e.status === "REJECTED").reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);

  // Pie chart data
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));
  }, [expenses]);

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const amount = expenses
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      months.push({ month: label, amount });
    }
    return months;
  }, [expenses]);

  // Recent expenses (latest 3)
  const recentExpenses = useMemo(() =>
    [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    [expenses]
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Analytics Cards */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-4">
          <span className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <CurrencyRupeeIcon className="h-7 w-7" />
          </span>
          <div>
            <div className="text-gray-500 text-sm">Total Expenses</div>
            <div className="text-2xl font-bold">${total.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-4">
          <span className="bg-green-100 text-green-600 p-3 rounded-full">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
          <div>
            <div className="text-gray-500 text-sm">Approved</div>
            <div className="text-2xl font-bold">${approved.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-4">
          <span className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
          </span>
          <div>
            <div className="text-gray-500 text-sm">Pending</div>
            <div className="text-2xl font-bold">${pending.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-4">
          <span className="bg-red-100 text-red-600 p-3 rounded-full">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" /></svg>
          </span>
          <div>
            <div className="text-gray-500 text-sm">Rejected</div>
            <div className="text-2xl font-bold">${rejected.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-4">Expenses by Category</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive
            >
              {categoryData.map((entry, idx) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-4">
          {categoryData.map((entry) => (
            <span key={entry.name} className="flex items-center text-sm" style={{ color: entry.color }}>
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: entry.color }}></span>
              {entry.name}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Monthly Trend</div>
          <div className="text-xs text-gray-500">Last 6 months</div>
        </div>
        <ResponsiveContainer width="100%" minWidth={600} height={320}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month">
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value="Amount" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Recent Expenses</div>
          <a href="/employee" className="text-blue-600 text-sm font-medium hover:underline">View all</a>
        </div>
        <ul>
          {recentExpenses.map((exp) => (
            <li key={exp.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-500 p-2 rounded-lg">
                  <CurrencyRupeeIcon className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-medium">{exp.description}</div>
                  <div className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800">${Number(exp.amount).toFixed(2)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${exp.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    exp.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"}`}>
                  {exp.status.charAt(0) + exp.status.slice(1).toLowerCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}