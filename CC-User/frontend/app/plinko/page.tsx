'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import onMessageSocket from '@/lib/client/socket-message-handler';
import PlinkoHistory from '@/components/pages/plinko/PlinkoHistoryAnimated';
import PlinkoWinnings from '@/components/pages/plinko/PlinkoWinnings';
import PlinkoBetInput from '@/components/pages/plinko/PlinkoBetInput';
import PlinkoBet from '@/components/pages/plinko/PlinkoBet';
import Cookies from 'js-cookie';
import { getProfileSettingValue } from '@/lib/client/profile-settings';

import { CSSTransition } from 'react-transition-group';
import AvatarField from '@/components/common/AvatarField';
import {
  capitalizeText,
  getFormatAmountString,
  getProfitFromAmount,
  playSound,
  roundedToFixed,
} from '@/lib/client/utils';
import {
  SocketResponseData,
  SocketResponseDataDetails,
} from '@/lib/client/types';

const PlinkoPage: React.FC = () => {
  const clientSocket = useSocketIoClient();

  const [inputVal, setInputVal] = useState('1.00');
  const [history, setHistory] = useState<any[]>([]); // Store Plinko history
  const [balls, setBalls] = useState<any[]>([]); // Store active Plinko balls
  const [maxVal, setMaxVal] = useState(10.0);
  const [minVal, setMinVal] = useState(0.01);

  const [errMsg, setErrMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
      setErrMsg(undefined);
    }
    if (successMsg) {
      toast.success(successMsg);
      setSuccessMsg(undefined);
    }
  }, [errMsg, successMsg]);
  const handleFirstData = (data: SocketResponseDataDetails) => {
    data.plinko.history.forEach(addHistoryItem);
    setMinVal(data.amounts.plinko.min);
    setMaxVal(data.amounts.plinko.max);
  };

  const handlePlinkoData = (data: SocketResponseDataDetails) => {
    if (data.command === 'bet') {
      addNewBall(data);
    } else if (data.command === 'history') {
      addHistoryItem(data.history);
    }
  };

  const addNewBall = (data: SocketResponseDataDetails) => {
    const { id, plinko, game } = data;
    setBalls((prev) => {
      const idExists = prev.some((ball) => ball.id === id);
      if (!idExists) {
        return [...prev, { id, plinko, game, status: 0 }];
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!clientSocket) {
      return;
    }

    const receiveMessageHandler = (receivedMessage: any) => {
      const { error, message, data }: SocketResponseData =
        onMessageSocket(receivedMessage);

      if (error) {
        console.log('[SOCK] error: ', error, message, data);
        setErrMsg(message);
        return;
      }

      switch (data.type) {
        case 'first':
          handleFirstData(data);
          break;
        case 'success':
          setSuccessMsg(data.success);
          break;
        case 'plinko':
          handlePlinkoData(data);
          break;
      }
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    // join channel to get initial data
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['plinko'],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);

  const clear = () => {
    setInputVal(minVal.toFixed(2));
  };
  const max = () => {
    setInputVal(maxVal.toFixed(2));
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
  const multiply = (times: number) => {
    let currentValToNumber = parseFloat(inputVal);
    let result = currentValToNumber * times;
    setInputVal(result.toFixed(2));
  };

  const bet = (game: string) => {
    const session = Cookies.get('session');
    if (!session) {
      setErrMsg('Please log in to place a bet!');
      return;
    }
    clientSocket?.sendRequest({
      type: 'plinko',
      command: 'bet',
      amount: inputVal,
      game: game,
    });
  };

  // Handle Plinko ball movement
  const moveBall = (ball: any) => {
    let tmp_ = balls.map((bl) =>
      bl.id === ball.id ? { ...ball, status: 1 } : bl
    );
    setBalls(tmp_);
    const ballElement = document.querySelector(
      `.plinko-ball[data-id="${ball.id}"]`
    );
    // + 30 * deepWinnings['low']
    if (ballElement) {
      ballElement.setAttribute('style', `top: -10px; left: 0px;`);
    }
    let deeps = 0;
    const widthArena = document.getElementById('plinko-case')?.offsetWidth || 0;
    const heightArena =
      document.getElementById('plinko-case')?.offsetHeight || 0;
    const widthHole = widthArena / 32;
    const heightHole = heightArena / 15;
    const deepWinnings: Record<string, number> = { low: 1, medium: 2, high: 3 };
    let deepX = 0;
    const interval = setInterval(() => {
      if (!ball.plinko) {
        return;
      }
      if (deeps >= 14) {
        clearInterval(interval);
        playSound('plinko_end');
        setTimeout(() => {
          setBalls((prev) => prev.filter((b) => b.id !== ball.id));
        }, 10000);
        return;
      }

      const route = ball.plinko[deeps];
      deepX = route === 1 ? deepX + 1 : deepX - 1;
      const deepY = deeps + 1;

      // + 30 * deepWinnings['low']
      if (ballElement) {
        ballElement.setAttribute(
          'style',
          `top: ${deepY * heightHole - 10}px; left: ${deepX * widthHole}px;`
        );
      }

      deeps++;
    }, 200);
  };

  useEffect(() => {
    balls.forEach((ball) => {
      if (ball.status === 0) {
        moveBall(ball);
      }
    });
  }, [balls]);

  // Add Plinko history item
  const addHistoryItem = (newItem: any) => {
    // setHistory((prevHistory) => {
    //   // Check if the item with the same id already exists in the previous state
    //   if (prevHistory.some((h) => h.id === newItem.id)) {
    //     return prevHistory; // Return the previous state unchanged if the item exists
    //   }

    //   console.log('adding history', newItem.id);

    //   // Add the new item and slice the array to keep only the most recent 10 items
    //   return [newItem, ...prevHistory].slice(0, 10);
    // });
    const classHistory =
      getProfitFromAmount(newItem.amount, newItem.multiplier) >= 0
        ? 'text-success'
        : 'text-danger';

    const newHistoryItem = (
      <CSSTransition key={newItem.id} timeout={300} classNames='slide'>
        <div
          className={`table-row plinko_historyitem ${classHistory}`}
          data-id={newItem.id}
        >
          <div className='table-column text-left'>
            <div className='flex items-center gap-1'>
              <AvatarField user={newItem.user} type='small' />
              <div className='text-left width-full ellipsis'>
                {newItem.user.name}
              </div>
            </div>
          </div>
          <div className='table-column text-left'>
            {getFormatAmountString(newItem.amount)}
          </div>
          <div className='table-column text-left'>
            {roundedToFixed(newItem.multiplier, 2).toFixed(2)}x
          </div>
          <div className='table-column text-left'>
            {capitalizeText(newItem.game)}
          </div>
          <div className='table-column text-left'>{newItem.roll}</div>
          <div className='table-column text-left'>
            {getFormatAmountString(
              getProfitFromAmount(newItem.amount, newItem.multiplier)
            )}
          </div>
        </div>
      </CSSTransition>
    );

    setHistory((prevHistory: any) => {
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 10);
      return updatedHistory;
    });
  };

  return (
    <div className='flex responsive justify-center mt-2'>
      <div className='width-8 responsive'>
        <div className='width-12 flex responsive column items-center mb-2 gap-2'>
          <div className='plinko-grid width-full relative' id='plinko-case'>
            <div className='absolute height-full width-full flex items-center justify-center'>
              <div className='absolute flex justify-center' id='plinko-arena'>
                {balls.map((ball) => (
                  <div
                    key={ball.id}
                    className={`plinko-ball ${ball.game} flex column items-center justify-end transition-5`}
                    data-id={ball.id}
                  ></div>
                ))}
              </div>
            </div>

            <div className='stage flex justify-center'></div>
            {Array.from({ length: 14 }, (_, i) => i + 2).map((i) => (
              <div key={i} className='stage flex justify-center'>
                {Array.from({ length: i + 1 }).map((_, j) => (
                  <div
                    key={j}
                    className='hole height-full flex justify-center items-center'
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <PlinkoWinnings />
          <PlinkoBetInput
            add={add}
            max={max}
            clear={clear}
            divide={divide}
            multiply={multiply}
            inputVal={inputVal}
            setInputVal={setInputVal}
          />

          <PlinkoBet bet={bet} />

          <PlinkoHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default PlinkoPage;
