import React from "react";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => (
  <div className="mb-6">
    {title && (
      <div className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider px-1">
        {title}
      </div>
    )}
    <ul className="space-y-2">{children}</ul>
  </div>
);

export default SidebarSection;