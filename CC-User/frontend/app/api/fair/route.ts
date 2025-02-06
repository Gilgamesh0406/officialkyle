import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { serializeData, hashSha256 } from '@/lib/server/utils';
import { getUserSeedServer } from '@/prisma/db/userSeedsServer';
import { getUserSeedClient } from '@/prisma/db/userSeedsClient';
import { getCoinflipHistory } from '@/prisma/db/coinflipGames';
import { getCasebattleHistory } from '@/prisma/db/casebattleGames';
import { getUnboxingHistory } from '@/prisma/db/unboxingBets';
import { getPlinkoHistory } from '@/prisma/db/plinkoBets';

const handler = async (req: NextApiRequest) => {
  if (!req.url) {
    return NextResponse.json({
      error: 'Invalid url',
    });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userid');
  if (!userId) {
    return NextResponse.json({
      error: 'userid is required',
    });
  }
  const serverSeeds = await getUserSeedServer(userId);
  const fairServerSeeds = serverSeeds.map((seed: any) => ({
    id: seed.id,
    using: !seed.removed,
    seed: !seed.removed ? hashSha256(seed.seed) : seed.seed,
    nonce: seed.nonce,
    time: seed.time,
  }));

  const clientSeed = await getUserSeedClient(userId);

  const coinflipHistory = await getCoinflipHistory();
  const casebattleHistory = await getCasebattleHistory();

  const unboxingHistory = await getUnboxingHistory(userId);
  const fairUnboxingHistory = unboxingHistory.map((bet: any) => ({
    id: bet.id,
    using: !bet.users_seeds_server.removed,
    server_seed: !bet.users_seeds_server.removed
      ? hashSha256(bet.users_seeds_server.seed)
      : bet.users_seeds_server.seed,
    client_seed: bet.users_seeds_client.seed,
    nonce: bet.nonce,
    tickets: bet.tickets,
    roll: bet.roll,
  }));

  const plinkoHistory = await getPlinkoHistory(userId);
  const fairPlinkoHistory = plinkoHistory.map((bet: any) => ({
    id: bet.id,
    using: !bet.users_seeds_server.removed,
    server_seed: !bet.users_seeds_server.removed
      ? hashSha256(bet.users_seeds_server.seed)
      : bet.users_seeds_server.seed,
    client_seed: bet.users_seeds_client.seed,
    nonce: bet.nonce,
    roll: bet.roll,
  }));

  return NextResponse.json(
    serializeData({
      fair: {
        client_seed: clientSeed?.seed,
        server_seed: fairServerSeeds[0]?.seed,
        server_seeds: fairServerSeeds,
        coinflip: coinflipHistory,
        casebattle: casebattleHistory,
        histories: {
          unboxing: fairUnboxingHistory,
          plinko: fairPlinkoHistory,
        },
      },
    })
  );
};

export { handler as GET };
