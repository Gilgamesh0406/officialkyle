import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Link from "next/link";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  children?: React.ReactNode;
  isSelected: boolean;
  selectedPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  children,
  isSelected,
  selectedPath,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Expand the parent if one of the child items is selected
    if (children && selectedPath.startsWith(path)) {
      setOpen(true);
    } else if (!children && isSelected) {
      setOpen(true); // Directly expand if the parent item is selected
    }
  }, [selectedPath, path, children, isSelected]);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem disablePadding className="mb-1">
        <Link href={!children ? path : "#"} className="w-full">
          <ListItemButton
            selected={isSelected}
            onClick={handleToggle}
            className={`rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700
              ${
                isSelected
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  : ""
              }
            `}
            sx={{
              minHeight: "48px",
              "&.Mui-selected": {
                backgroundColor: "inherit",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: "40px",
                "& svg": {
                  fontSize: "1.3rem",
                },
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "0.95rem",
                  fontWeight: isSelected ? 600 : 500,
                },
              }}
            />
            {children && (
              <div className="text-gray-400">
                {open ? <ExpandLess /> : <ExpandMore />}
              </div>
            )}
          </ListItemButton>
        </Link>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className="ml-3 space-y-1">{children}</div>
        </Collapse>
      )}
    </div>
  );
};

export default SidebarItem;
