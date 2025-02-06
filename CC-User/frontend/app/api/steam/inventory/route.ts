import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const steamid = req.cookies.get("email")?.value; // Get steamid from cookie/session
  if (!steamid)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const inventoryUrl = `https://www.steamwebapi.com/steam/api/inventory?key=Q57B3200PEOB3CE4&steam_id=${steamid}&game=rust&no_cache=no_cache`;
  const response = await axios.get(inventoryUrl, {
    headers: {
      // Optional: Add headers if needed
      "User-Agent": "PostmanRuntime/7.29.0", // Mimic Postman user-agent if required
      "Cache-Control": "no-cache", // Avoid caching issues
    },
    withCredentials: true, // If cookies are needed
  });

  const data = response.data;

  if (data.length > 0) {
    const items = data.map((asset: any) => {
      return {
        assetid: asset.assetid,
        classid: asset.classid,
        name: asset.markethashname,
        icon_url: asset.image,
        tradable: asset.tradable,
        price: "$" + asset.pricelatest.toFixed(2),
      };
    });

    return NextResponse.json({ items });
  }
  return NextResponse.json({ items: [] });
}
