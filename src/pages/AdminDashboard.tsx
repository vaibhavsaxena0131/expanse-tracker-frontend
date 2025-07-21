import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/axios";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ApprovalQueue from "../compenents/ApprovalQueue";
import Sidebar from "../compenents/SideBar";
import Navbar from "../compenents/Navbar";
import Footer from "../compenents/Footer";
import { logout } from "../features/authSlice";
import type { Expense } from "../features/expensesSlice";
import { useNavigate } from "react-router-dom";
import AllExpensesAdminTable from "../compenents/AllExpensesAdminTable";
import TeamAnalytics from "../compenents/TeamAnalytics";

export default function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<
    "all-expenses" | "approval-queue" | "team-analytics"
  >("all-expenses");

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses/all");
      setExpenses(res.data.expenses || res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [activeSection, fetchExpenses]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const navConfig = useMemo(() => ({
    "all-expenses": {
      title: "All Expenses",
      subtitle: "View and manage all team expenses",
    },
    "approval-queue": {
      title: "Approval Queue",
      subtitle: "Review and approve pending expenses",
    },
    "team-analytics": {
      title: "Team Analytics",
      subtitle: "Comprehensive overview of team expense patterns",
    },
  }), []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <Sidebar
        user={user}
        active={activeSection}
        onSignOut={handleSignOut}
        onAddClick={() => {}}
        onShowExpenses={() => {}}
        onShowDashboard={() => {}}
        onShowAllExpenses={() => setActiveSection("all-expenses")}
        onShowApprovalQueue={() => setActiveSection("approval-queue")}
        onShowTeamAnalytics={() => setActiveSection("team-analytics")}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="px-6 pt-6">
          <Navbar
            title={navConfig[activeSection].title}
            subtitle={navConfig[activeSection].subtitle}
          />
        </div>
        <main className="flex-1 px-6 md:px-10 py-6">
          {activeSection === "all-expenses" && (
            <AllExpensesAdminTable expenses={expenses} loading={loading} />
          )}
          {activeSection === "approval-queue" && (
            <ApprovalQueue
              expenses={expenses}
              loading={loading}
              onStatusChange={fetchExpenses}
            />
          )}
          {activeSection === "team-analytics" && (
            <TeamAnalytics expenses={expenses} loading={loading} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}