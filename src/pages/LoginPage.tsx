import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../compenents/Button";
import { useAppDispatch } from "../store/hooks";
import { login } from "../features/authSlice";
import Navbar from "../compenents/Navbar";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      setLoading(true);
      try {
        const resultAction = await dispatch(login({ email, password }));

        if (login.fulfilled.match(resultAction)) {
          const { user } = resultAction.payload;
          if (user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/employee");
          }
        } else {
          alert(resultAction.payload || "Login failed");
        }
      } catch (error) {
        alert("Unexpected error occurred");
      }
      setLoading(false);
    },
    [dispatch, navigate, loading]
  );

  return (
    <>
      <Navbar
        title="Intelebee Expense Tracker"
        subtitle=""
        rightContent={
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
        }
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="flex-1 flex items-center justify-center px-4">
          <form
            onSubmit={handleLogin}
            className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md"
          >
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Login
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
