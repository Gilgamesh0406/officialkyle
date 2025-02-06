import { socketIoContext } from '@/providers/SocketIoProvider';
import { useContext } from 'react';

export function useSocketIoClient() {
  const context = useContext(socketIoContext);
  return context.socketIoClient;
}

export function useIsSocketConnected() {
  const context = useContext(socketIoContext);
  return context.connected;
}
