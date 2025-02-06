import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Ensure correct import

export async function GET() {
  const cookieStore = cookies(); // Create cookieStore instance
  const steamID = cookieStore.get("steamID"); // Access the cookie
  if (steamID) {
    const apiKey = process.env.STEAM_API_KEY;
    const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID.value}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Steam data");
      }

      const data = await response.json();
      const playerData = data?.response?.players[0];

      return NextResponse.json(
        playerData
          ? { authenticated: !!steamID, steamId: steamID, playerData }
          : {
              error: "No player data found",
            }
      );
    } catch (error) {
      return NextResponse.json(
        { authenticated: !!steamID, steamId: steamID, error: error },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ authenticated: !!steamID, steamID: steamID });
}
