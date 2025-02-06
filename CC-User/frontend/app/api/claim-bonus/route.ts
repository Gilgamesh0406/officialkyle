import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { bonusCode } = await req.json();
  const userid = req.cookies.get("userid")?.value;

  if (!userid) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const bonus = await prisma.bonus.findFirst({
    where: {
      code: bonusCode,
    },
  });

  if (!bonus) {
    return NextResponse.json({ error: "Bonus not found" }, { status: 404 });
  }

  const bonusClaims = await prisma.bonusClaim.findMany({
    where: {
      bonus_id: bonus.id,
    },
  });

  if (bonusClaims.findIndex((v) => v.user_id === userid) !== -1) {
    return NextResponse.json(
      { error: "Bonus already claimed" },
      { status: 400 }
    );
  }

  if (bonusClaims.length >= bonus.max_claims) {
    return NextResponse.json(
      { error: "Bonus already claimed" },
      { status: 400 }
    );
  }

  await prisma.bonusClaim.create({
    data: {
      bonus_id: bonus.id,
      user_id: userid,
    },
  });

  await prisma.userTransaction.create({
    data: {
      userid: userid,
      amount: bonus.amount,
      service: "bonus claim",
      time: Date.now(),
    },
  });

  await prisma.user.update({
    where: { userid: userid },
    data: { balance: { increment: bonus.amount } },
  });

  return NextResponse.json(
    { message: "Bonus claimed successfully" },
    { status: 200 }
  );
};
