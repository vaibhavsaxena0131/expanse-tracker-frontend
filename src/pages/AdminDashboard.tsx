import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import Sidebar from "../compenents/SideBar";
import Navbar from "../compenents/Navbar";
import Footer from "../compenents/Footer";
// Import your admin components here
// import AllExpensesTable from "../compenents/AllExpensesTable";
// import ApprovalQueue from "../compenents/ApprovalQueue";
// import TeamAnalytics from "../compenents/TeamAnalytics";
import { logout } from "../features/authSlice";
import type { Expense } from "../features/expensesSlice";
import { useNavigate } from "react-router-dom";
import AllExpensesAdminTable from "../compenents/AllExpensesAdminTable";

export default function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Section state
  const [activeSection, setActiveSection] = useState<"all-expenses" | "approval-queue" | "team-analytics">("all-expenses");

  // Data state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all expenses for admin
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await api.get("/expenses"); // Adjust endpoint as needed
        setExpenses(res.data.expenses || res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
      setLoading(false);
    };
    fetchExpenses();
  }, [activeSection]);

  // Sign out
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  // Navbar config
  const navConfig = {
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
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <Sidebar
        user={user}
        active={activeSection}
        onSignOut={handleSignOut}
        // Employee handlers (not used for admin, but required by props)
        onAddClick={() => {}}
        onShowExpenses={() => {}}
        onShowDashboard={() => {}}
        // Admin handlers
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
            // <ApprovalQueue expenses={expenses} loading={loading} />
            <div>Approval Queue (replace with your component)</div>
          )}
          {activeSection === "team-analytics" && (
            // <TeamAnalytics expenses={expenses} loading={loading} />
            <div>Team Analytics (replace with your component)</div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}