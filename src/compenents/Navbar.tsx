import { ReactNode } from "react";
import logo from "../assets/logo-Intelebee.webp";
import { Link } from "react-router-dom";

type NavbarProps = {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
};

export default function Navbar({ title, subtitle, rightContent }: NavbarProps) {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </Link>

      {/* Center: Title and subtitle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="font-bold text-2xl text-gray-900">{title}</span>
        {subtitle && (
          <span className="text-gray-500 text-sm">{subtitle}</span>
        )}
      </div>

      {/* Right: Custom content or Current Month */}
      <div className="flex flex-col items-end">
        {rightContent ? (
          rightContent
        ) : (
          <>
            <span className="text-xs text-gray-500">Current Month</span>
            <span className="font-semibold text-lg text-gray-900">{month} {year}</span>
          </>
        )}
      </div>
    </nav>
  );
}