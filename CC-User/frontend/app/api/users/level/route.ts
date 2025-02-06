import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const email = req.cookies.get("email")?.value;
  const url = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/`;

  try {
    const response = await axios.get(url, {
      params: {
        key: process.env.STEAM_API_KEY,
        steamid: email,
      },
    });

    // Extract the player level from the response
    const playerLevel = response.data.response.player_level;

    return NextResponse.json({
      level: playerLevel,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "User not found",
      },
      { status: 400 }
    );
  }
}
