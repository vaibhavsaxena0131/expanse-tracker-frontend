import React, { useState, useMemo } from "react";
import api from "../api/axios";
import type { Expense } from "../features/expensesSlice";
import StatusBadge from "./formatStatus";

interface ApprovalQueueProps {
  expenses: Expense[];
  loading: boolean;
  onStatusChange?: () => void;
}

function ApprovalQueue({
  expenses,
  loading,
  onStatusChange,
}: ApprovalQueueProps) {
  const pendingExpenses = expenses.filter((exp) => exp.status === "PENDING");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // Paginated pending expenses
  const totalPages = Math.max(1, Math.ceil(pendingExpenses.length / limit));
  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * limit;
    return pendingExpenses.slice(start, start + limit);
  }, [pendingExpenses, page, limit]);

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.post(`/expenses/${id}/status`, { status });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl overflow-x-auto border border-gray-200">
      <h2 className="text-2xl font-extrabold text-indigo-700 mb-8 flex items-center gap-3 tracking-tight">
        <span className="text-2xl">📝</span>
        Approval Queue
      </h2>
      <div className="mb-6 text-right">
        <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
          {pendingExpenses.length} Pending Reviews
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-indigo-600 font-semibold">
          Loading...
        </div>
      ) : pendingExpenses.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No pending expenses.
        </div>
      ) : (
        <>
          <table className="min-w-full text-base text-gray-700 rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-200 to-blue-200 text-indigo-900 font-bold sticky top-0 z-10">
                <th className="px-7 py-4 text-left rounded-tl-2xl">Date</th>
                <th className="px-7 py-4 text-left">Category</th>
                <th className="px-7 py-4 text-left">Description</th>
                <th className="px-7 py-4 text-left">Submitted By</th>
                <th className="px-7 py-4 text-left">Amount</th>
                <th className="px-7 py-4 text-left">Status</th>
                <th className="px-7 py-4 text-left rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map((exp, idx) => (
                <tr
                  key={exp.id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } hover:bg-indigo-100`}
                >
                  <td className="px-7 py-4 rounded-l-2xl">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="px-7 py-4">{exp.category}</td>
                  <td className="px-7 py-4">{exp.description}</td>
                  <td className="px-7 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700">
                        {exp.submittedBy
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {exp.submittedBy || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-4 font-bold text-indigo-700">
                    ${exp.amount}
                  </td>
                  <td className="px-7 py-4">
                    <StatusBadge status={exp.status} />
                  </td>
                  <td className="px-7 py-4 rounded-r-2xl flex gap-2">
                    <button
                      className="px-4 py-2 rounded bg-red-100 text-red-700 font-bold hover:bg-red-200 flex items-center gap-1"
                      onClick={() => handleStatusUpdate(exp.id, "REJECTED")}
                    >
                      &#10006; Reject
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-1"
                      onClick={() => handleStatusUpdate(exp.id, "APPROVED")}
                    >
                      &#10004; Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        </>
      )}
    </div>
  );
}

export default React.memo(ApprovalQueue);
