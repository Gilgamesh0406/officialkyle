import AvatarField from '@/components/common/AvatarField';
import { Coinflip, GameUser } from '@/lib/client/types';

type CoinflipPlayerProps = {
  coinflip: Coinflip;
  status: number;
  position: number;
  user: GameUser;
  onJoin: (id: string) => void;
  onShowBots: (id: string) => void;
};

export const CoinflipPlayer: React.FC<CoinflipPlayerProps> = ({
  coinflip,
  status,
  position,
  user,
  onJoin,
  onShowBots,
}) => {
  let classPlayer = '';
  if (status === 4)
    classPlayer = position !== coinflip.data.winner ? 'active' : '';

  const joined = coinflip.players.some((a) => a.user.userid === user?.userid);
  const creator = coinflip.players.some(
    (a) => a.user.userid === user?.userid // && a.creator
  );

  const player = coinflip.players.find((a) => a.position === position);

  return (
    <div
      className={`coinflip-player ${classPlayer} width-5 height-full bg-dark rounded-1 p-1`}
    >
      <div className='flex column justify-between items-center height-full'>
        <div className='flex column items-center justify-center height-full width-full gap-2'>
          {player ? (
            <>
              <AvatarField
                user={player.user}
                type='large'
                coinflipPosition={position}
              />
              <div className='width-full ellipsis'>{player.user.name}</div>
            </>
          ) : joined ? (
            creator ? (
              <div className='relative'>
                <button
                  className='site-button purple width-full'
                  onClick={() => onShowBots(coinflip.id)}
                >
                  Call a Bot
                </button>
                <div className='sop-large-left flex justify-center items-center b-m2 bg-dark rounded-full'>
                  <img src={`/imgs/coinflip/coin${position}.png`} alt='Coin' />
                </div>
              </div>
            ) : null
          ) : (
            <div className='relative'>
              <button
                className='site-button purple width-full'
                onClick={() => onJoin(coinflip.id)}
              >
                Join Game
              </button>
              <div className='sop-large-left flex justify-center items-center b-m2 bg-dark rounded-full'>
                <img src={`/imgs/coinflip/coin${position}.png`} alt='Coin' />
              </div>
            </div>
          )}
        </div>
        <div className='bg-light rounded-1 b-l2 pl-2 pr-2 flex items-center justify-center'>
          <div className='coins mr-1'></div>
          <span>{coinflip.amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
