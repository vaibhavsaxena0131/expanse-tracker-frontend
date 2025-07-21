import React from "react";
import type { Expense } from "../features/expensesSlice";
import StatusBadge from "./formatStatus";

interface AllExpensesAdminTableProps {
  expenses: Expense[];
  loading: boolean;
}

const AllExpensesAdminTable: React.FC<AllExpensesAdminTableProps> = ({ expenses, loading }) => (
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
        ) : expenses.length > 0 ? (
          expenses.map((exp, idx) => (
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
  </div>
);

export default React.memo(AllExpensesAdminTable);