import React from "react";
import { List } from "@mui/material";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem"; // Import the SidebarItem component
import {
  Dashboard,
  Settings,
  Person,
  CreditScore,
  BusinessCenter,
  Add,
  List as ListIcon,
  Block,
  SmartToy,
  Foundation,
  Support,
  Group,
  AttachMoneyOutlined,
} from "@mui/icons-material";
const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800">
      <List className="py-2 px-3 space-y-1">
        <SidebarItem
          icon={<Dashboard />}
          label="Dashboard"
          path="/"
          isSelected={pathname === "/"}
          selectedPath={pathname}
        />

        <SidebarItem
          icon={<BusinessCenter />}
          label="Case"
          path="/case"
          isSelected={pathname === "/case"}
          selectedPath={pathname}
        >
          <SidebarItem
            icon={<Add />}
            label="New Case"
            path="/case/create"
            isSelected={pathname === "/case/create"}
            selectedPath={pathname}
          />
          <SidebarItem
            icon={<ListIcon />}
            label="Case List"
            path="/case/list"
            isSelected={pathname === "/case/list"}
            selectedPath={pathname}
          />
        </SidebarItem>

        <SidebarItem
          icon={<Settings />}
          label="Settings"
          path="/settings"
          isSelected={pathname === "/settings"}
          selectedPath={pathname}
        >
          <SidebarItem
            icon={<Foundation />}
            label="Basic"
            path="/settings/basic"
            isSelected={pathname === "/settings/basic"}
            selectedPath={pathname}
          />
          <SidebarItem
            icon={<CreditScore />}
            label="Deposit"
            path="/settings/deposit"
            isSelected={pathname === "/settings/deposit"}
            selectedPath={pathname}
          />
          <SidebarItem
            icon={<AttachMoneyOutlined />}
            label="Bonus"
            path="/settings/bonus"
            isSelected={pathname === "/settings/bonus"}
            selectedPath={pathname}
          />
          <SidebarItem
            icon={<Block />}
            label="Block Skin"
            path="/settings/blockskin"
            isSelected={pathname === "/settings/blockskin"}
            selectedPath={pathname}
          />
          <SidebarItem
            icon={<SmartToy />}
            label="Steam Bots"
            path="/settings/steambots"
            isSelected={pathname === "/settings/steambots"}
            selectedPath={pathname}
          />
        </SidebarItem>

        <SidebarItem
          icon={<Group />}
          label="Users"
          path="/users"
          isSelected={pathname === "/users"}
          selectedPath={pathname}
        />

        <SidebarItem
          icon={<Person />}
          label="Profile"
          path="/profile"
          isSelected={pathname === "/profile"}
          selectedPath={pathname}
        />

        <SidebarItem
          icon={<Support />}
          label="Support"
          path="/support"
          isSelected={pathname === "/support"}
          selectedPath={pathname}
        />
      </List>
    </div>
  );
};

export default Sidebar;
