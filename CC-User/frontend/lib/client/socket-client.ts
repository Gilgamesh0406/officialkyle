import io, { Socket } from "socket.io-client";
import { EventEmitter } from "events";
import Cookies from "js-cookie";

interface SocketConfig {
  url?: string;
}

class SocketIoClient extends EventEmitter {
  private socket: Socket | null = null;
  private config: SocketConfig;

  constructor(config: SocketConfig) {
    super();
    this.config = config;
    this.initializeSocket();
  }

  private async initializeSocket() {
    // await this.waitForCookie('session');
    this.connect();
  }

  private waitForCookie(
    cookieName: string,
    delay: number = 500
  ): Promise<void> {
    return new Promise((resolve) => {
      const checkCookie = () => {
        if (Cookies.get(cookieName)) {
          resolve();
        } else {
          setTimeout(checkCookie, delay);
        }
      };
      checkCookie();
    });
  }

  private connect() {
    const options = {
      autoConnect: true,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      withCredentials: true,
      transports: ["websocket"],
    };
    this.socket = io(
      //@ts-ignore
      this.config.url ? this.config.url : process.env.NEXT_PUBLIC_SOCKET_URL,
      options
    );

    this.socket.on("disconnect", (reason: string) => {
      this.emit("disconnect", reason);
    });

    this.socket.on("connect", () => {
      this.emit("connect", "connected");
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error(error.message);
    });

    this.socket.on("depositStatus", (success, status) => {
      console.log(success)
    });
  }
  disconnect() {
    this.socket?.disconnect();
  }
  sendRequest<T>(request: T) {
    this.socket?.emit("request", request);
  }

  sendDepositRequest<T>(request: T) {
    this.socket?.emit("depositRequest", request);
  }

  sendBalanceRequest() {
    console.log("updateBalance")
    this.socket?.emit("updateBalance");
  }

  send<T>(event: string, data: T) {
    // console.log('[SOCKET] Sending event and data: ', event, data);
    this.socket?.emit(event, data);
  }

  subscribe(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  get isConnected(): boolean {
    return !!this.socket?.connected;
  }

  get userId(): string | undefined {
    return this.socket?.id;
  }
}

export default SocketIoClient;
