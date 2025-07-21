import {
  PlusCircleIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ClockIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import SidebarSection from "./SidebarSection";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { useAppDispatch } from "../store/hooks";

function Sidebar({
  user,
  onAddClick,
  onShowExpenses,
  onShowDashboard,
  active,
  onSignOut,
  onShowAllExpenses,
  onShowApprovalQueue,
  onShowTeamAnalytics,
}: {
  user: any;
  onAddClick: () => void;
  onShowExpenses: () => void;
  onShowDashboard: () => void;
  active: string;
  onSignOut?: () => void;
  onShowAllExpenses?: () => void;
  onShowApprovalQueue?: () => void;
  onShowTeamAnalytics?: () => void;
}) {
  const isAdmin = user?.role === "ADMIN";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
    if (onSignOut) onSignOut();
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-xl p-6 border-r border-gray-200 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
          <CurrencyRupeeIcon className="h-6 w-6 mr-2 text-indigo-500" />
          ExpenseTracker <span className="ml-2 text-xs text-gray-400 font-normal">Pro</span>
        </h2>
      </div>
      <div className="flex items-center mb-8 space-x-3">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
          {user?.name?.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div>
          <div className="font-semibold text-gray-800">{user?.name}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.role || "Employee"}</div>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
            isAdmin
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}>
            {isAdmin ? "ADMIN" : "EMPLOYEE"}
          </span>
        </div>
      </div>

      <nav className="flex-1">
        <SidebarSection>
          {/* Employee Section */}
          {!isAdmin && (
            <>
              <li>
                <button
                  onClick={onShowDashboard}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={onShowExpenses}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "expenses"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                  My Expenses
                </button>
              </li>
              <li>
                <button
                  onClick={onAddClick}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "add"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-3 text-indigo-500" />
                  Add Expense
                </button>
              </li>
            </>
          )}
          {/* Admin Tools Section */}
          {isAdmin && (
            <>
              <div className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2 tracking-wider px-1">
                Admin Tools
              </div>
              <li>
                <button
                  onClick={onShowAllExpenses}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "all-expenses"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5 mr-3" />
                  All Expenses
                </button>
              </li>
              <li>
                <button
                  onClick={onShowApprovalQueue}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "approval-queue"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <ClockIcon className="h-5 w-5 mr-3" />
                  Approval Queue
                </button>
              </li>
              <li>
                <button
                  onClick={onShowTeamAnalytics}
                  className={`flex items-center px-3 py-2 rounded-lg w-full transition font-medium ${
                    active === "team-analytics"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <ChartBarSquareIcon className="h-5 w-5 mr-3" />
                  Team Analytics
                </button>
              </li>
            </>
          )}
          {/* Sign Out as last item */}
          <li>
            <button
              className="flex items-center text-gray-500 hover:text-red-600 transition px-3 py-2 w-full"
              onClick={handleSignOut}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </li>
        </SidebarSection>
      </nav>
    </aside>
  );
}

export default Sidebar;