'use client';
import React, { useEffect, useState } from 'react';
import {
  useIsSocketConnected,
  useSocketIoClient,
} from '@/hooks/useSocketIoClient';
import onMessageSocket from '@/lib/client/socket-message-handler';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
  SocketResponseData,
  UnboxingCaseType,
  UnboxingGameItem,
  UnboxingHistoryItemType,
  UnboxingWinningType,
} from '@/lib/client/types';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import UnboxingHistory from '@/components/pages/unboxing/UnboxingHistory';
import UnboxingGame from '@/components/pages/unboxing/UnboxingGame';
import UnboxingGameControl from '@/components/pages/unboxing/UnboxingGameControl';
import UnboxingGameItems from '@/components/pages/unboxing/UnboxingGameItems';
import { useParams } from 'next/navigation';
import UnboxingGameInfo from '@/components/pages/unboxing/UnboxingGameInfo';

export default function page() {
  const params = useParams();
  const clientSocket = useSocketIoClient();
  const [errMsg, setErrMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [items, setItems] = useState<UnboxingGameItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
      setErrMsg(undefined);
    }
  }, [errMsg]);
  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
      setSuccessMsg(undefined);
    }
  }, [successMsg]);

  const [history, setHistory] = useState<UnboxingHistoryItemType[]>([]);
  const [spinners, setSpinners] = useState<
    UnboxingWinningType[][] | undefined
  >();
  const [moving, setMoving] = useState<boolean>(false);
  const [unboxingInfo, setUnboxingInfo] = useState<UnboxingCaseType>();
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

      if (data.type === 'success') {
        setSuccessMsg(data.success);
        return;
      } else if (data.type === 'first') {
        // setCases(data.unboxing.cases);
        setHistory([...data.unboxing.history.toReversed()]);
        // get case data
        clientSocket.sendRequest({
          type: 'unboxing',
          command: 'show',
          id: params.case,
        });
        setInitialized(true);
      } else if (data.type === 'unboxing' && data.command === 'show') {
        data.items && setItems(data.items);
        setUnboxingInfo(data.unboxing);
      } else if (data.type === 'unboxing' && data.command === 'spinner') {
        data.spinner && setSpinners(data.spinner);
      } else if (data.type === 'unboxing' && data.command === 'roll') {
        data.spinner && setSpinners(data.spinner);
        setMoving(true);
      } else if (data.type === 'unboxing' && data.command === 'history') {
        setHistory((prev) => [data.history, ...prev]);
      }
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    // join channel to get initial data
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['unboxing', params.case],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);

  const [amount, setAmount] = useState(1);
  useEffect(() => {
    if (!clientSocket || !initialized) {
      return;
    }
    clientSocket.sendRequest({
      type: 'unboxing',
      command: 'spinner',
      id: params.case,
      amount: amount,
    });
  }, [amount, initialized, clientSocket]);

  const openCase = () => {
    const session = Cookies.get('session');
    if (!session) {
      setErrMsg('You need to login to open case');
      return;
    }
    clientSocket?.sendRequest({
      type: 'unboxing',
      command: 'open',
      id: params.case,
      amount: amount,
    });
  };
  const openDemo = () => {
    const session = Cookies.get('session');
    if (!session) {
      setErrMsg('You need to login to open case');
      return;
    }
    clientSocket?.sendRequest({
      type: 'unboxing',
      command: 'demo',
      id: params.case,
      amount: amount,
    });
  };

  return (
    <div>
      <UnboxingHistory items={history} />
      <UnboxingGameInfo
        name={unboxingInfo ? unboxingInfo.name : 'Unboxing Case'}
        price={unboxingInfo ? unboxingInfo.price : '1.00'}
      />
      {spinners ? (
        <>
          <UnboxingGame
            items={spinners}
            moving={moving}
            setMoving={setMoving}
          />
          <UnboxingGameControl
            moving={moving}
            amount={amount}
            setAmount={setAmount}
            openCase={openCase}
            openDemo={openDemo}
          />
        </>
      ) : (
        <div className='h-32 justify-center flex items-center'>
          {errMsg ? errMsg : 'Loading'}
        </div>
      )}

      <UnboxingGameItems items={items} />
    </div>
  );
}
