import React, { useState, useMemo } from "react";
import type { Expense } from "../features/expensesSlice";
import StatusBadge from "./formatStatus";

interface AllExpensesAdminTableProps {
  expenses: Expense[];
  loading: boolean;
}

const AllExpensesAdminTable: React.FC<AllExpensesAdminTableProps> = ({ expenses, loading }) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const totalPages = Math.max(1, Math.ceil(expenses.length / limit));
  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * limit;
    return expenses.slice(start, start + limit);
  }, [expenses, page, limit]);

  // Reset to page 1 if expenses change and current page is out of bounds
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [expenses, totalPages, page]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl overflow-x-auto border border-gray-200">
      <h2 className="text-2xl font-extrabold text-indigo-700 mb-8 flex items-center gap-3 tracking-tight">
        <span className="text-2xl">📋</span>
        All Expenses
      </h2>
      <table className="min-w-full text-base text-gray-700 rounded-2xl overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-200 to-blue-200 text-indigo-900 font-bold sticky top-0 z-10">
            <th scope="col" className="px-7 py-4 text-left rounded-tl-2xl">Date</th>
            <th scope="col" className="px-7 py-4 text-left">Category</th>
            <th scope="col" className="px-7 py-4 text-left">Description</th>
            <th scope="col" className="px-7 py-4 text-left">Submitted By</th>
            <th scope="col" className="px-7 py-4 text-left">Amount</th>
            <th scope="col" className="px-7 py-4 text-left rounded-tr-2xl">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-indigo-600 font-semibold">
                Loading...
              </td>
            </tr>
          ) : paginatedExpenses.length > 0 ? (
            paginatedExpenses.map((exp, idx) => (
              <tr
                key={exp.id}
                className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-indigo-50"} hover:bg-indigo-100`}
              >
                <td className="px-7 py-4 rounded-l-2xl">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-7 py-4">{exp.category}</td>
                <td className="px-7 py-4">{exp.description}</td>
                <td className="px-7 py-4">{exp.submittedBy || "—"}</td>
                <td className="px-7 py-4 font-bold text-indigo-700">${exp.amount}</td>
                <td className="px-7 py-4 rounded-r-2xl"><StatusBadge status={exp.status} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default React.memo(AllExpensesAdminTable);