// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export async function getOffersStats(userId: string) {
//   const stats = await prisma.userTrade.groupBy({
//     by: ['type'],
//     where: { userid: userId },
//     _sum: { amount: true },
//     _count: { amount: true },
//   });

//   const offersStats: any = {
//     deposit: { count: 0, total: 0 },
//     withdraw: { count: 0, total: 0 },
//   };

//   stats.forEach((stat) => {
//     offersStats[stat.type] = {
//       count: stat._count.amount,
//       total: stat._sum.amount || 0,
//     };
//   });

//   return offersStats;
// }
