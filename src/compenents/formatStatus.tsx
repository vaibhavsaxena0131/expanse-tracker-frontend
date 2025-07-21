import React from "react";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

function formatStatus(status: string) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return status;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const label = formatStatus(status);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[label] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
};

export default StatusBadge;