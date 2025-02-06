import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userid, service, amount, time } = await req.json();

    await prisma.userTransaction.create({
      data: {
        userid,
        service,
        amount,
        time,
      },
    });
    await prisma.creditCardDeposit.create({
      data: {
        userid,
        amount,
        time
      }
    })

    const user = await prisma.user.findFirst({
      where: { userid },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User doesn't exist" }), {
        status: 400,
      });
    }

    await prisma.user.updateMany({
        where: {
          userid
        },
        data: {
          balance:
            parseFloat(user ? user.balance.toString() : "0") + amount
        },
      });

    return new Response("success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to create transaction" }),
      { status: 500 }
    );
  }
}
