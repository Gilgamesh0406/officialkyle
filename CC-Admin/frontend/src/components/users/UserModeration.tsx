"use client";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "@/utils/const";
import axios from "axios";
import { toast } from "react-toastify";

interface UserData {
  name: string;
  email: string;
  time_create: bigint;
  initialized: boolean;
  verified: boolean;
  private: boolean;
  rank: bigint;
  xp: bigint;
  avatar: string;
  tradelink: string;
  balance: number;
  discord_id: string;
  steam_level: number;
  deposit_count: bigint;
  deposit_total: number;
  withdraw_count: bigint;
  withdraw_total: number;
  used_ips: string;
}

interface UserModerationProps {
  userid: string;
}

const UserModeration: React.FC<UserModerationProps> = ({ userid }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [rank, setRank] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/users/${userid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.user);
        setRank(data.user.rank);
        setBalance(data.user.balance);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, [userid]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSetRank = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/users/rank/${userid}`,
        {
          rank,
        }
      );
      if (response.status === 200) {
        toast.success("Rank updated successfully");
      } else {
        toast.error("Failed to update rank");
      }
    } catch (error) {
      toast.error("Failed to update rank");
    }
  };

  const handleSetBalance = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/users/balance/${userid}`,
        {
          balance,
        }
      );
      if (response.status === 200) {
        toast.success("Balance updated successfully");
      } else {
        toast.error("Failed to update balance");
      }
    } catch (error) {
      toast.error("Failed to update balance");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-medium">
          User Moderation
        </Typography>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
        >
          <ArrowBackIcon /> Back
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
          <Typography variant="h6" className="mb-6 font-medium">
            User Information
          </Typography>

          <div className="space-y-6">
            {userData?.avatar && (
              <div className="mb-4">
                <img
                  src={userData.avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
                />
              </div>
            )}

            <div className="grid gap-6">
              {[
                { label: "User ID", value: userid },
                { label: "Username", value: userData?.name || "Loading..." },
                {
                  label: "Used IPs",
                  value: userData?.used_ips || "Loading...",
                },
                { label: "SteamID", value: userData?.email || "Loading..." },
                {
                  label: "Steam Level",
                  value: userData?.steam_level,
                },
                {
                  label: "DiscordID",
                  value: userData?.discord_id,
                },
                {
                  label: "Join Date",
                  value: userData?.time_create
                    ? new Date(
                        Number(userData.time_create) * 1000
                      ).toLocaleString()
                    : "Loading...",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 dark:text-gray-400 mb-1"
                  >
                    {item.label}
                  </Typography>
                  <Typography className="dark:text-gray-200 font-medium">
                    {item.value}
                  </Typography>
                </div>
              ))}

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="text-gray-500 dark:text-gray-400 mb-1"
                >
                  Account Status
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {userData &&
                    [
                      { label: "Initialized", value: userData.initialized },
                      { label: "Verified", value: userData.verified },
                      { label: "Private", value: userData.private },
                      { label: "XP", value: userData.xp.toString() },
                    ].map((status, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          {status.label}:
                        </span>
                        <span className="font-medium dark:text-gray-200">
                          {typeof status.value === "boolean"
                            ? status.value
                              ? "Yes"
                              : "No"
                            : status.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="text-gray-500 dark:text-gray-400 mb-1"
                >
                  Transaction Statistics
                </Typography>
                {userData && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Balance:
                      </span>
                      <span className="font-medium dark:text-gray-200">
                        ${Number(userData.balance).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Deposits:
                      </span>
                      <span className="font-medium dark:text-gray-200">
                        {userData.deposit_count} ($
                        {Number(userData.deposit_total).toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Withdrawals:
                      </span>
                      <span className="font-medium dark:text-gray-200">
                        {userData.withdraw_count} ($
                        {Number(userData.withdraw_total).toFixed(2)})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <Typography
                color="error"
                className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                {error}
              </Typography>
            )}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  color: "text.secondary",
                  fontWeight: 500,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: "3px",
                  borderRadius: "1.5px",
                },
              }}
            >
              <Tab label="Summary" />
              <Tab label="Restrictions" />
            </Tabs>
          </Box>

          {selectedTab === 0 && (
            <div className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-700 p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Typography variant="h6" className="mb-4">
                  Set Rank
                </Typography>
                <div className="flex gap-3">
                  <select
                    className="flex-1 p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-all duration-200"
                    value={rank}
                    onChange={(e) => {
                      setRank(parseInt(e.target.value));
                    }}
                  >
                    <option value={0}>User</option>
                    <option value={1}>Moderator</option>
                    <option value={2}>Admin</option>
                  </select>
                  <button
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => {
                      handleSetRank();
                    }}
                  >
                    Save Rank
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-gray-700 p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Typography variant="h6" className="mb-4">
                  Set Balance
                </Typography>
                <div className="flex gap-3">
                  <input
                    type="number"
                    className="flex-1 p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-all duration-200"
                    placeholder="Enter balance amount"
                    value={balance}
                    onChange={(e) => {
                      setBalance(Number(e.target.value));
                    }}
                    step="0.01"
                    min="0"
                  />
                  <button
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => {
                      handleSetBalance();
                    }}
                  >
                    Update Balance
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 1 && (
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Typography className="dark:text-gray-200">
                Restrictions Content
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModeration;
