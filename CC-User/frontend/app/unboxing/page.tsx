'use client';
import React, { useEffect, useState } from 'react';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import onMessageSocket from '@/lib/client/socket-message-handler';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
  SocketResponseData,
  UnboxingCaseType,
  UnboxingHistoryItemType,
} from '@/lib/client/types';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import UnboxingCase from '@/components/pages/unboxing/UnboxingCase';
import UnboxingHistory from '@/components/pages/unboxing/UnboxingHistory';

const page = () => {
  const clientSocket = useSocketIoClient();
  const [errMsg, setErrMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);
  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
    }
  }, [successMsg]);

  const [cases, setCases] = useState<UnboxingCaseType[]>([]);
  const [history, setHistory] = useState<UnboxingHistoryItemType[]>([]);
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
        setCases(data.unboxing.cases);
        setHistory([...data.unboxing.history.toReversed()]);
      } else if (data.type === 'unboxing' && data.command === 'history') {
        setHistory((prev) => [data.history, ...prev]);
      }
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    // join channel to get initial data
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['unboxing'],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);
  return (
    <>
      <UnboxingHistory items={history} />
      <div className='p-2' id='unboxing_list_cases'>
        {cases && cases.length > 0 ? (
          cases.map((unboxing) => (
            <UnboxingCase unboxing={unboxing} key={unboxing.id} />
          ))
        ) : (
          <div className='history_message flex justify-center items-center width-full height-full'>
            No unboxes
          </div>
        )}
      </div>
    </>
  );
};

export default page;
