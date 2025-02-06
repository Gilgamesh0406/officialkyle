'use client';
import BetInputField from '@/components/pages/coinflip/BetInput';
import CoinflipSelector from '@/components/pages/coinflip/CoinflipSelector';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import onMessageSocket from '@/lib/client/socket-message-handler';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import CoinflipBetItem from '@/components/pages/coinflip/CoinflipBetItem';
import {
  CoinFlipBetType,
  Coinflip,
  BotType,
  SocketResponseData,
} from '@/lib/client/types';
import CoinflipFairModal from '@/components/modals/CoinflipFairModal';
import CoinflipChooseBotModal from '@/components/modals/CoinflipChooseBotModal';

const page = () => {
  const clientSocket = useSocketIoClient();
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeBattleList, setActiveBattleList] = useState(0);
  const [inputVal, setInputVal] = useState('1.00');
  const clear = () => {
    setInputVal('0.00');
  };
  const max = () => {
    setInputVal('0.00');
  };
  const add = (num: number) => {
    let currentValToNumber = parseFloat(inputVal);
    let result = currentValToNumber + num;
    setInputVal(result.toFixed(2));
  };
  const divide = (times: number) => {
    let currentValToNumber = parseFloat(inputVal);
    let result = currentValToNumber / times;
    setInputVal(result.toFixed(2));
  };
  const multiple = (times: number) => {
    let currentValToNumber = parseFloat(inputVal);
    let result = currentValToNumber * times;
    setInputVal(result.toFixed(2));
  };

  const [coinfilipGames, setCoinflipGames] = useState<CoinFlipBetType[]>([]);
  const [user, setUser] = useState<any>();
  const onCreateGame = () => {
    clientSocket?.sendRequest({
      type: 'coinflip',
      command: 'create',
      amount: inputVal,
      position: activeBattleList,
    });
  };

  const onJoinGame = (id: string) => {
    const session = Cookies.get('session');
    if (!session) {
      setErrMsg('Please login to join game');
      return;
    }
    clientSocket?.sendRequest({
      type: 'coinflip',
      command: 'join',
      id: id,
    });
  };

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
      setErrMsg('');
    }
  }, [errMsg]);
  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
      setSuccessMsg('');
    }
  }, [successMsg]);

  useEffect(() => {
    if (!clientSocket) {
      return;
    }

    const receiveMessageHandler = (receivedMessage: any) => {
      const { error, message, data }: SocketResponseData =
        onMessageSocket(receivedMessage);
      if (error) {
        setErrMsg(message);
        return;
      }

      if (data.type === 'success') {
        data.success && setSuccessMsg(data.success);
        return;
      } else if (data.type === 'first') {
        setCoinflipGames(data.coinflip.bets);
        setUser(data.user);
        return;
      } else if (data.type === 'coinflip' && data.command === 'add') {
        setCoinflipGames((prev: CoinFlipBetType[]) => {
          if (prev.some((game) => game.coinflip.id === data.coinflip.id))
            return prev;
          return [{ status: 0, coinflip: data.coinflip }, ...prev];
        });
      } else if(data.type === 'coinflip' && data.command === "bet_confirmed") {
          setSuccessMsg('A new bet has been placed!');
      } else if (data.type === 'coinflip' && data.command === 'remove') {
        setCoinflipGames((prev) =>
          prev.filter(
            (gm) => parseInt(gm.coinflip.id) !== parseInt(data.coinflip.id)
          )
        );
        return;
      } else if (data.type === 'gamebots' && data.command === 'show') {
        setBots(data.bots);
        setBotuserid(
          data.bots[Math.floor(Math.random() * data.bots.length)].user.userid
        );
        setBotCall((prev) => prev + 1);
        return;
      } else if (data.type === 'gamebots' && data.command === 'hide') {
        setShowBots(false);
      } else if (data.type === 'coinflip' && data.command === 'edit') {
        setCoinflipGames((prev) => {
          const gameIdx = prev.findIndex(
            (tt) => parseInt(tt.coinflip.id) === parseInt(data.coinflip.id)
          );
          if (gameIdx !== -1) {
            const tmp = [...prev];
            tmp[gameIdx] = { status: data.status, coinflip: data.coinflip };
            return tmp;
          }
          return [{ status: data.status, coinflip: data.coinflip }, ...prev];
        });
      }
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    // join channel to get initial data
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['coinflip'],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);
  /**
   * Fair Modal
   */
  const [fairModal, setFairModal] = useState(false);
  const [fairModalData, setFairModalData] = useState<Coinflip>();
  const showFairFor = (cf: Coinflip) => {
    setFairModalData(cf);
    setFairModal(true);
  };
  /**
   * Bot call
   */
  const [showBots, setShowBots] = useState(false); // currently not used
  const [bots, setBots] = useState<BotType[]>(); // currently not used
  const [currentBotIndex, setCurrentBotIndex] = useState(0); // currently not used

  // used to call bot immediately without choosing bot in the modal
  const [botCall, setBotCall] = useState(0);
  const [botuserid, setBotuserid] = useState<string>();

  const [gameid, setGameid] = useState<string>();

  const onShowBots = (id: string) => {
    console.log('set gameid', id);
    clientSocket?.sendRequest({
      type: 'gamebots',
      command: 'show',
      game: 'coinflip',
      data: {
        id: id,
      },
    });
    setGameid(id);
  };

  const playWithBot = (userid: string) => {
    clientSocket?.sendRequest({
      type: 'gamebots',
      command: 'confirm',
      userid: userid,
      game: 'coinflip',
      data: {
        id: gameid,
      },
    });
  };

  // for one click bot call
  useEffect(() => {
    if (!clientSocket || !botuserid) {
      return;
    }
    playWithBot(botuserid);
  }, [botCall]);

  //
  const removeBet = (id: string) => {
    console.log('removing coinflip bet: ', id);
    clientSocket?.sendRequest({
      type: 'coinflip',
      command: 'remove',
      id: id,
    });
  };
  const [timers, setTimers] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        coinfilipGames.forEach((game) => {
          if (game.status === 1) {
            if (updatedTimers[game.coinflip.id] === undefined) {
              updatedTimers[game.coinflip.id] = 3;
            } else if (updatedTimers[game.coinflip.id] > 0) {
              updatedTimers[game.coinflip.id]--;
            }
          } else {
            updatedTimers[game.coinflip.id] = 3;
          }
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [coinfilipGames]);
  return (
    <>
      <div className="relative flex responsive items-center before:content-[''] before:absolute before:w-[calc(100%+30px)] before:h-[calc(100%+8px)] before:bg-[#27273180] before:border before:border-black border-transparent before:-left-6  bb-d2 p-2">
        <div className='width-8 responsive z-10 relative'>
          <BetInputField
            inputVal={inputVal}
            onAdd={add}
            onClear={clear}
            onDivide={divide}
            onMax={max}
            onMultiply={multiple}
            setInputVal={setInputVal}
          />
        </div>

        <div className='width-3 responsive p-2 ml-6 z-10 relative'>
          <CoinflipSelector
            activeBattleList={activeBattleList}
            onCreateGame={onCreateGame}
            setActiveBattleList={setActiveBattleList}
            isCreateDisabled={false}
          />
        </div>
      </div>
      <div className='coinflip-grid gap-2 p-2' id='coinflip_betlist'>
        {coinfilipGames &&
          coinfilipGames.length > 0 &&
          coinfilipGames.map((game, idx) => (
            <div className='coinflip-game bg-dark rounded-1 b-l2' key={idx}>
              <CoinflipBetItem
                coinflip={game.coinflip}
                onJoin={onJoinGame}
                status={game.status}
                user={user}
                showFairFor={showFairFor}
                onShowBots={onShowBots}
                removeBet={removeBet}
                timer={timers[game.coinflip.id]}
              />
            </div>
          ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='coinflip-game bg-dark rounded-1 b-l2'
          ></div>
        ))}
      </div>

      <CoinflipFairModal
        isOpen={fairModal}
        setIsOpen={setFairModal}
        fairModalData={fairModalData}
      />
      <CoinflipChooseBotModal
        isOpen={showBots}
        setIsOpen={setShowBots}
        bots={bots}
        currentBotIndex={currentBotIndex}
        setCurrentBotIndex={setCurrentBotIndex}
        playWithBot={playWithBot}
      />
    </>
  );
};

export default page;
