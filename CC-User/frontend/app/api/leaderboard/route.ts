import { convertBigIntToString } from "@/lib/client/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "today";

  const dateFilter = {
    today: new Date(new Date().setHours(0, 0, 0, 0)),
    week: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  }[period as "today" | "week" | "month"];

  if (!dateFilter) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const leaderboard = await prisma.user.findMany({
    include: {
      UserTransaction: {
        select: {
          amount: true,
          service: true,
          time: true,
        },
      },
    },
    orderBy: {
      UserTransaction: {
        _count: "desc",
      },
    },
    take: 20,
  });

  const leaderboardWithTotals = leaderboard
    .map((user) => {
      const winningTransactions = user.UserTransaction.filter(
        (tx) =>
          (tx.service.indexOf("win") !== -1 ||
            tx.service.indexOf("sell_item") !== -1) &&
          new Date(Number(tx.time) * 1000) >= dateFilter
      );
      const bettingAmount = winningTransactions.reduce(
        (sum, tx) => sum + tx.amount.toNumber(),
        0
      );
      return {
        userid: user.userid,
        username: user.username,
        xp: user.xp,
        total_played: winningTransactions.length,
        total_amount: bettingAmount,
      };
    })
    .sort((a, b) => b.total_amount - a.total_amount);

  return NextResponse.json(convertBigIntToString(leaderboardWithTotals));
}
