"use client";

import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import LogoutButton from "./LogoutButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Link from "next/link";
import { useColorScheme } from "@mui/material/styles";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { setMode } = useColorScheme();

  useEffect(() => {
    // Retrieve the dark mode setting from localStorage
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
      setMode(savedMode === "true" ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Toggle dark mode on the root element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      setMode("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      setMode("light");
    }
  }, [darkMode, setMode]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: darkMode
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${
          darkMode ? "rgb(31, 41, 55)" : "rgb(229, 231, 235)"
        }`,
        transition: "all 300ms",
      }}
      className="shadow-sm"
    >
      <Toolbar className="px-4 md:px-6 py-2">
        <Typography
          variant="h6"
          className="flex-1 flex items-center hover:scale-105 transition-transform duration-300"
        >
          <Link
            href="/"
            passHref
            className="flex items-center gap-3 text-inherit no-underline dark:text-white text-gray-800"
          >
            <LocalShippingIcon
              className="transform hover:rotate-12 transition-transform duration-300 text-blue-600 dark:text-blue-400"
              sx={{ fontSize: "2rem" }}
            />
            <span className="font-bold tracking-tight text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              CRAZY CARGO
            </span>
          </Link>
        </Typography>

        <div className="flex items-center gap-3">
          <IconButton
            color="inherit"
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              transform: "rotate(0)",
              transition: "transform 500ms",
              color: darkMode ? "rgb(209, 213, 219)" : "rgb(75, 85, 99)",
              "&:hover": {
                transform: "rotate(180deg)",
                backgroundColor: darkMode
                  ? "rgb(31, 41, 55)"
                  : "rgb(243, 244, 246)",
              },
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <LogoutButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
