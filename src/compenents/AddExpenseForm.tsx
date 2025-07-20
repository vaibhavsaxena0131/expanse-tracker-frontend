import React from "react";

interface AddExpenseFormProps {
  formData: {
    amount: string;
    category: string;
    description: string;
    date: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      amount: string;
      category: string;
      description: string;
      date: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  editExpense?: { id: string };
}

const categories = ["Travel", "Food", "Office"];

function AddExpenseForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting = false,
  editExpense,
}: AddExpenseFormProps) {
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 max-w-lg mx-auto mt-8 space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-4">
          {editExpense ? "Edit Expense" : "Add a New Expense"}
        </h2>
        {/* Amount input with $ */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 font-bold select-none">$</span>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData((f) => ({ ...f, amount: e.target.value }))
            }
            className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            required
            min="0"
            step="0.01"
          />
        </div>
        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData((f) => ({ ...f, category: e.target.value }))
          }
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          required
        />
        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          required
        />
        {/* Submit */}
        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editExpense
              ? "Updating..."
              : "Submitting..."
            : editExpense
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </form>
    </>
  );
}

export default AddExpenseForm;