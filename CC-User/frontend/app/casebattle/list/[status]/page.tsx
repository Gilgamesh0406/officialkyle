'use client';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import onMessageSocket from '@/lib/client/socket-message-handler';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import { toast } from 'react-toastify';
import { CaseBattleContext } from '@/providers/CaseBattleContext';
import { CaseBattleBetType, SocketResponseData } from '@/lib/client/types';
import CaseBattleBetItem from '@/components/pages/casebattle/list/CaseBattleBetItem';
import { getPlayersCountForCaseBattle } from '@/lib/client/utils';

const page = () => {
  const clientSocket = useSocketIoClient();
  const params = useParams();
  const context = useContext(CaseBattleContext);

  if (!context) {
    throw new Error(
      'CaseBattleContext must be used within a CaseBattleProvider'
    );
  }
  const { setStats, formData } = context;

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [caseBattleBets, setCaseBattleBets] = useState<CaseBattleBetType[]>();
  const [caseBattleBetsFiltered, setCaseBattleBetsFiltered] =
    useState<CaseBattleBetType[]>();
  const [firstLoad, setFirstLoad] = useState(false);
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

  const updateCaseBattleBets = (data: any) => {
    setCaseBattleBets((prev: any) => {
      switch (data.command) {
        case 'add':
          return data.casebattle
            ? [{ status: 0, casebattle: data.casebattle }, ...prev]
            : prev;
        case 'edit':
          return data.status === 6
            ? prev.map((bet: any) =>
                bet.casebattle.id === data.casebattle.id
                  ? { status: data.status, casebattle: data.casebattle }
                  : bet
              )
            : prev;
        case 'remove':
          return prev.filter(
            (bet: any) => bet.casebattle.id !== data.casebattle.id
          );
        default:
          return prev;
      }
    });
  };
  const handleCaseBattleCommand = (data: any) => {
    const isActive = params.status === 'active';

    switch (data.command) {
      case 'list':
        setCaseBattleBets(data.battles);
        break;

      case 'add':
      case 'edit':
      case 'remove':
        if (!isActive) {
          loadData();
          return;
        }
        updateCaseBattleBets(data);
        break;

      case 'stats':
        setStats(data.stats);
        break;
    }
  };
  const receiveMessageHandler = (receivedMessage: any) => {
    const { error, message, data }: SocketResponseData =
      onMessageSocket(receivedMessage);

    if (error) {
      console.log('[SOCK] error: ', error, message, data);
      setErrMsg(message);
      return;
    }

    switch (data.type) {
      case 'success':
        data.success && setSuccessMsg(data.success);
        break;

      case 'first':
        console.log('first socket received');
        setStats(data.casebattle.stats);
        params.status === 'active'
          ? setCaseBattleBets(data.casebattle.bets)
          : setFirstLoad(true);
        break;

      case 'casebattle':
        handleCaseBattleCommand(data);
        break;
    }
  };
  useEffect(() => {
    if (!clientSocket) {
      return;
    }

    // Remove any existing 'message' listeners
    clientSocket.removeAllListeners();
    clientSocket.subscribe('message', receiveMessageHandler);

    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['casebattle', 'list', params.status],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket, params.status]);

  const loadData = () => {
    clientSocket?.sendRequest({
      type: 'casebattle',
      command: params.status,
    });
  };
  useEffect(() => {
    if (firstLoad) {
      loadData();
    }
  }, [firstLoad]);

  useEffect(() => {
    if (!caseBattleBets) {
      return;
    }
    // Filter by search case
    let filtered = caseBattleBets.filter((bet) =>
      bet.casebattle.cases.some((a) =>
        a.name
          .toLocaleLowerCase()
          .includes(formData.searchCase.toLocaleLowerCase())
      )
    );

    // Filter by players count
    if (formData.players.toLowerCase() !== 'all') {
      const targetPlayers = parseInt(formData.players);
      filtered = filtered.filter((bet) => {
        return (
          getPlayersCountForCaseBattle(bet.casebattle.mode) === targetPlayers
        );
      });
    }

    // Sorting based on orderBy
    if (formData.orderBy === 'Latest') {
      filtered = filtered.sort((a, b) => b.casebattle.time - a.casebattle.time);
    } else if (formData.orderBy === 'Amount ascending') {
      filtered = filtered.sort(
        (a, b) => a.casebattle.amount - b.casebattle.amount
      );
    } else if (formData.orderBy === 'Amount descending') {
      filtered = filtered.sort(
        (a, b) => b.casebattle.amount - a.casebattle.amount
      );
    }

    console.log('sorted data', filtered);

    setCaseBattleBetsFiltered(filtered);
  }, [formData, caseBattleBets]);

  return (
    <div className='flex column gap-2 m-2'>
      <div className='flex column gap-2' id='casebattle_betlist'>
        {caseBattleBetsFiltered && caseBattleBetsFiltered.length > 0 ? (
          caseBattleBetsFiltered.map((bet) => (
            <CaseBattleBetItem bet={bet} key={bet.casebattle.id} />
          ))
        ) : (
          <div className='in-grid bg-light flex justify-center items-center font-8 p-4 history_message'>
            No active case battles
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
