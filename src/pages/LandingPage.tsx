import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Navbar from "../compenents/Navbar"; // <-- Import Navbar

export default function LandingPage() {
  // Memoize animation variants for performance
  const headingVariants = useMemo(() => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1 }
  }), []);
  const spanVariants = useMemo(() => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 1, delay: 0.5 }
  }), []);
  const pVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1, delay: 1 }
  }), []);
  const btnVariants = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: 1.5 }
  }), []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navbar at the top */}
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
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4">
        <motion.h1
          {...headingVariants}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          Welcome to{" "}
          <motion.span
            {...spanVariants}
            className="text-yellow-300"
          >
            Intelebee
          </motion.span>{" "}
          Expense Tracker
        </motion.h1>

        <motion.p
          {...pVariants}
          className="mb-8 text-center max-w-xl"
        >
          Track your and team's expenses effortlessly. Simple, fast, and secure
          expense tracking.
        </motion.p>

        <motion.div {...btnVariants}>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg font-semibold text-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            tabIndex={0}
            aria-label="Get Started with Intelebee Expense Tracker"
          >
            Get Started
          </Link>
        </motion.div>
      </main>
    </div>
  );
}