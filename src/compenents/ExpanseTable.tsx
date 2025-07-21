import React from "react";
import type { Expense } from "../features/expensesSlice";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import StatusBadge from "./formatStatus";

interface ExpanseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

const ExpanseTable: React.FC<ExpanseTableProps> = ({ expenses, onEdit, onDelete }) => (
  <div className="bg-white p-8 rounded-3xl shadow-2xl overflow-x-auto border border-gray-200">
    <h2 className="text-2xl font-extrabold text-indigo-700 mb-8 flex items-center gap-3 tracking-tight">
      <span className="text-2xl">💸</span>
      Expenses
    </h2>
    <table className="min-w-full text-base text-gray-700 rounded-2xl overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-indigo-200 to-blue-200 text-indigo-900 font-bold sticky top-0 z-10">
          <th scope="col" className="px-7 py-4 text-left rounded-tl-2xl">Date</th>
          <th scope="col" className="px-7 py-4 text-left">Category</th>
          <th scope="col" className="px-7 py-4 text-left">Description</th>
          <th scope="col" className="px-7 py-4 text-left">Amount</th>
          <th scope="col" className="px-7 py-4 text-left">Status</th>
          <th scope="col" className="px-7 py-4 text-left rounded-tr-2xl">Edit</th>
        </tr>
      </thead>
      <tbody>
        {expenses.length > 0 ? (
          expenses.map((exp, idx) => (
            <tr
              key={exp.id}
              className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-indigo-50"} hover:bg-indigo-100`}
            >
              <td className="px-7 py-4 rounded-l-2xl font-medium">
                {new Date(exp.date).toLocaleDateString()}
              </td>
              <td className="px-7 py-4">{exp.category}</td>
              <td className="px-7 py-4">{exp.description}</td>
              <td className="px-7 py-4 font-bold text-indigo-700">
                ${exp.amount}
              </td>
              <td className="px-7 py-4">
                <StatusBadge status={exp.status} />
              </td>
              <td className="px-7 py-4 rounded-r-2xl flex gap-2">
                {exp.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => onEdit && onEdit(exp)}
                      className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(exp.id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </>
                ) : (
                  <span className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed flex">
                    <PencilSquareIcon className="h-5 w-5" />
                    <TrashIcon className="h-5 w-5 ml-2" />
                  </span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center py-8 text-gray-400 text-lg font-semibold">
              No expenses found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default React.memo(ExpanseTable);