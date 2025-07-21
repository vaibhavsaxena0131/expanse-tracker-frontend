import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../api/axios";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import type { Expense } from "../features/expensesSlice";
import Sidebar from "../compenents/SideBar";
import AddExpenseForm from "../compenents/AddExpenseForm";
import ExpanseTable from "../compenents/ExpanseTable";
import DashboardAnalytics from "../compenents/DashboardAnalytics";
import Navbar from "../compenents/Navbar";
import { logout } from "../features/authSlice";
import Footer from "../compenents/Footer";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeSection, setActiveSection] = useState<"dashboard" | "expenses" | "add">("dashboard");
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/expenses`);
        setExpenses(res.data.expenses || res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
      setLoading(false);
    };
    if (user?.id) fetchExpenses();
  }, [activeSection, isSubmitting, user?.id]);

  // Filter and paginate
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) =>
      exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / limit));
  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredExpenses.slice(start, start + limit);
  }, [filteredExpenses, page, limit]);

  // Handle Add/Edit
  const handleEditExpense = useCallback((expense: Expense) => {
    setEditExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: expense.date.slice(0, 10),
    });
    setActiveSection("add");
  }, []);
  const handleAddClick = useCallback(() => {
    setEditExpense(null);
    setFormData({ amount: "", category: "", description: "", date: "" });
    setActiveSection("add");
  }, []);

  // Handle submit (add or update)
  const handleSubmitExpense = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editExpense) {
        // Update
        await api.put(`/expenses/${editExpense.id}`, {
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        });
      } else {
        // Create
        await api.post("/expenses", {
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        });
      }
      setFormData({ amount: "", category: "", description: "", date: "" });
      setEditExpense(null);
      setActiveSection("expenses");
      setPage(1);
    } catch (err) {
      alert("Failed to save expense");
    }
    setIsSubmitting(false);
  }, [editExpense, formData]);

  // Handle delete
  const handleDeleteExpense = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      alert("Failed to delete expense");
    }
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  // Navbar titles/subtitles by section
  const navConfig = useMemo(() => ({
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your expense activity",
    },
    expenses: {
      title: "My Expenses",
      subtitle: "Track and manage your submitted expenses",
    },
    add: {
      title: "Add New Expense",
      subtitle: "Submit a new expense for approval",
    },
  }), []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-white">
      <Sidebar
        user={user}
        onAddClick={handleAddClick}
        onShowExpenses={() => setActiveSection("expenses")}
        onShowDashboard={() => setActiveSection("dashboard")}
        active={activeSection}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Navbar always at the top */}
        <div className="px-6 pt-6">
          <Navbar
            title={navConfig[activeSection].title}
            subtitle={navConfig[activeSection].subtitle}
          />
        </div>
        <main className="flex-1 px-6 md:px-10 py-6">
          {/* Search bar only for expenses section */}
          {activeSection === "expenses" && (
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by category..."
                className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring focus:border-indigo-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          )}

          {activeSection === "dashboard" && (
            <DashboardAnalytics expenses={expenses} loading={loading} />
          )}

          {activeSection === "add" && (
            <AddExpenseForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmitExpense}
              isSubmitting={isSubmitting}
              editExpense={editExpense ? { id: editExpense.id } : undefined}
            />
          )}

          {activeSection === "expenses" && (
            <>
              {loading ? (
                <div className="text-center py-8 text-indigo-600 font-semibold">
                  Loading...
                </div>
              ) : (
                <ExpanseTable
                  expenses={paginatedExpenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              )}
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
        </main>
        {/* Footer always at the bottom */}
        <Footer />
      </div>
    </div>
  );
}