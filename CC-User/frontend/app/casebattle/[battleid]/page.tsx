'use client';

import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import { CaseBattleContext } from '@/providers/CaseBattleContext';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
  ActiveEmoji,
  CaseBattleBetType,
  SocketResponseData,
} from '@/lib/client/types';
import onMessageSocket from '@/lib/client/socket-message-handler';
import CaseBattleInfo from '@/components/pages/casebattle/battle/CaseBattleInfo';
import CaseBattlePlayer from '@/components/pages/casebattle/battle/CaseBattlePlayer';
import CaseBattleItem from '@/components/pages/casebattle/list/CaseBattleItem';
import { getPlayersCountForCaseBattle } from '@/lib/client/utils';

type Props = {};

export default function CaseBattlePage({}: Props) {
  const clientSocket = useSocketIoClient();
  const params = useParams();
  const context = useContext(CaseBattleContext);

  if (!context) {
    throw new Error(
      'CaseBattleContext must be used within a CaseBattleProvider'
    );
  }

  const { setStats, setCreateBattleData, create } = context;

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [battle, setBattle] = useState<CaseBattleBetType>();
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeEmoji, setActiveEmoji] = useState<ActiveEmoji>({
    position: null,
    emoji: null,
  });

  const [activeRound, setActiveRound] = useState<null | number>(null);

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
        console.error('[SOCK] error:', error, message, data);
        setErrMsg(message);
        return;
      }

      switch (data.type) {
        case 'success':
          if (data.success) setSuccessMsg(data.success);
          break;

        case 'first':
          data.user && setCurrentUserId(data.user.userid);
          setStats(data.casebattle.stats);
          clientSocket.sendRequest({
            type: 'casebattle',
            command: 'show',
            id: params.battleid,
          });
          break;

        case 'casebattle':
          handleCaseBattleCommands(data);
          break;

        case 'gamebots':
          if (data.command === 'show') {
            handleGameBotsShowCommand(data);
          }
          break;

        default:
          break;
      }
    };

    const handleCaseBattleCommands = (data: SocketResponseData['data']) => {
      switch (data.command) {
        case 'show':
          setBattle({
            status: data.status,
            casebattle: data.casebattle,
          });
          setCreateBattleData(data.casebattle);
          break;
        case 'edit':
        case 'update':
          if (
            data.stage === 'position' &&
            data.casebattle.data &&
            data.casebattle.data.spinner
          ) {
            // update spinner data
            //@ts-ignore
            setBattle((prevBattle) => ({
              status: data.status || prevBattle?.status,
              casebattle: {
                ...prevBattle?.casebattle,
                ...data.casebattle,
                players: data.casebattle.players,
                data: {
                  ...prevBattle?.casebattle.data,
                  ...data.casebattle?.data,
                  spinners: {
                    ...prevBattle?.casebattle.data.spinners,
                    [data.position]: data.casebattle.data.spinner,
                  },
                },
              },
            }));
          } else if (data.stage === 'roll') {
            // do nothing
          } else if (data.stage === 'round') {
            // update round --- for animation
            setActiveRound(data.round);
          } else if (data.stage === 'items') {
            // update items, do nothing as edit command is received with new items data
          } else {
            //@ts-ignore
            setBattle((prevBattle) => ({
              status: data.status || prevBattle?.status,
              casebattle: {
                ...prevBattle?.casebattle,
                ...data.casebattle,
                data: {
                  ...prevBattle?.casebattle.data,
                  ...data.casebattle?.data,
                },
              },
            }));
          }

          if (
            data.status === 6 &&
            data.stage === 'refresh' &&
            data.casebattle.data.game
          ) {
            setCreateBattleData((prev: any) => ({
              ...prev,
              data: {
                ...prev.data,
                game: data.casebattle.data.game,
              },
            }));
          }
          break;

        case 'emoji':
          setActiveEmoji({
            position: data.position,
            emoji: data.emoji,
          });
          setTimeout(() => {
            setActiveEmoji({
              position: null,
              emoji: null,
            });
          }, 3000);
          break;

        case 'redirect':
          if (data.action === 'join') {
            window.location.href = `/casebattle/${data.id}`;
            return;
          }

          window.location.href = '/casebattle/list/active';
          break;

        default:
          break;
      }
    };

    const handleGameBotsShowCommand = (data: SocketResponseData['data']) => {
      const randomBotId =
        data.bots[Math.floor(Math.random() * data.bots.length)].user.userid;
      clientSocket.sendRequest({
        type: 'gamebots',
        command: 'confirm',
        userid: randomBotId,
        game: 'casebattle',
        data: data.data,
      });
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session: session,
      paths: ['casebattle', params.battleid],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);

  const onJoin = (position: number) => {
    clientSocket?.sendRequest({
      type: 'casebattle',
      command: 'join',
      id: battle?.casebattle.id,
      position: position,
    });
  };

  const onBotCall = (position: number) => {
    if (!clientSocket || !battle) {
      setErrMsg('Please log in again.');
      return;
    }
    clientSocket?.sendRequest({
      type: 'gamebots',
      command: 'show',
      game: 'casebattle',
      data: {
        id: battle?.casebattle.id,
        position: position,
      },
    });
  };

  const onLeave = (position: number) => {
    clientSocket?.sendRequest({
      type: 'casebattle',
      command: 'leave',
      id: battle?.casebattle.id,
      position: position,
    });
  };

  const onClickEmoji = (id: string, position: number, emoji: number) => {
    clientSocket?.sendRequest({
      type: 'casebattle',
      command: 'emoji',
      id: id,
      position: position,
      emoji: emoji,
    });
  };

  useEffect(() => {
    if (create === true) {
      clientSocket?.sendRequest({
        type: 'casebattle',
        command: 'create',
        cases: battle?.casebattle.cases.map((c) => c.id),
        mode: battle?.casebattle.mode,
        privacy: battle?.casebattle.data.privacy,
        free: battle?.casebattle.data.free,
        crazy: battle?.casebattle.data.crazy,
      });
    }
  }, [create]);

  if (!battle) {
    return null;
  }

  return (
    <div className='flex flex-col items-center gap-2 m-2'>
      <CaseBattleInfo battle={battle} key='battle_info' />
      <div
        className='flex flex-row justify-center gap-2 responsive'
        id='casebattle_roundlist'
      >
        {Array.from({
          length: getPlayersCountForCaseBattle(battle.casebattle.mode),
        }).map((_, index) => {
          const player = battle.casebattle.players.find(
            (p) => p.position === index
          );
          const creator = battle.casebattle.players.some(
            (a) => a.user.userid === currentUserId && a.creator
          );
          const joined = battle.casebattle.players.some(
            (a) => a.user.userid === currentUserId
          );

          return (
            <CaseBattlePlayer
              key={index}
              status={battle.status}
              player={player}
              creator={creator}
              joined={joined}
              currentUserId={currentUserId}
              onCallBotClick={onBotCall}
              onJoinClick={onJoin}
              onLeaveClick={onLeave}
              casebattle={battle.casebattle}
              position={index}
              onClickEmoji={onClickEmoji}
              activeEmoji={activeEmoji}
              round={activeRound}
            />
          );
        })}
      </div>
      <div
        className='flex flex-row justify-center gap-2 responsive'
        id='casebattle_itemslist'
      >
        {Array.from({
          length: getPlayersCountForCaseBattle(battle.casebattle.mode),
        }).map((_, index) => {
          const player = battle.casebattle.players.find(
            (p) => p.position === index
          );

          return (
            <CaseBattleItem
              key={`won-item-${index}`}
              player={player}
              caseCount={battle.casebattle.cases.length}
            />
          );
        })}
      </div>
    </div>
  );
}
