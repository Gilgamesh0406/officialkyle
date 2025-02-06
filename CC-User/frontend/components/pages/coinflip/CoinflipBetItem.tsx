import { Coinflip, GameUser } from '@/lib/client/types';
import { CoinflipPlayer } from './CoinflipPlayer';
import { CoinflipMiddle } from './CoinflipMiddle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

type CoinflipBetItemProps = {
  coinflip: Coinflip;
  status: number;
  user: GameUser;
  onJoin: (id: string) => void;
  showFairFor: (cf: Coinflip) => void;
  onShowBots: (id: string) => void;
  removeBet: (id: string) => void;
  timer: any;
};

const CoinflipBetItem: React.FC<CoinflipBetItemProps> = ({
  coinflip,
  status,
  user,
  onJoin,
  showFairFor,
  onShowBots,
  removeBet,
  timer,
}) => {
  const creator = coinflip.players.some(
    (a) => a.user.userid === user?.userid && a.creator
  );
  return (
    <div
      className='coinflip_betitem bg-light-transparent relative height-full width-full flex justify-between p-2'
      data-id={coinflip.id}
    >
      <CoinflipPlayer
        coinflip={coinflip}
        status={status}
        position={0}
        user={user}
        onJoin={onJoin}
        onShowBots={onShowBots}
      />
      <CoinflipMiddle
        status={status}
        coinflip={coinflip}
        showFairFor={showFairFor}
        timer={timer}
      />
      <CoinflipPlayer
        coinflip={coinflip}
        status={status}
        position={1}
        user={user}
        onJoin={onJoin}
        onShowBots={onShowBots}
      />
      {creator && status < 1 && (
        <div
          className='coinflip_betitem_remove absolute top-1 right-1 p-1 cursor-pointer bg-red-950 shadow-md hover:border hover:shadow-sm rounded-full w-6 h-6'
          onClick={() => removeBet(coinflip.id)}
        >
          <FontAwesomeIcon icon={faClose} className='' />
        </div>
      )}
    </div>
  );
};

export default CoinflipBetItem;
