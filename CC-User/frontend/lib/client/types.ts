export type NavMenuType = {
  text: string;
  to: string;
  role?: "admin" | "user";
  textClassname?: string;
};

export type HeaderProps = {
  pathname: string;
  modalIsOpen: boolean;
  setsetSettingsModalIsOpen: (f: boolean) => void;
  filteredRoutes: NavMenuType[];
  session: any;
  userData: UserData;
  setDailyCaseOpen: (f: boolean) => void;
  setInventoryOpen: (f: boolean) => void;
};

export type SocketResponseDataDetails = {
  // common
  type?: string;
  command?: string;
  id?: any;
  success?: string;
  error?: string;
  message?: string;
  // for user
  balance: any;
  level: any;
  user: any;
  coinflip: any; // coinflip
  bots: any; // coinflip
  status: number; // coinflip
  items?: any[]; // unboxing
  unboxing?: any; // unboxing
  spinner: UnboxingWinningType[][] | undefined; // unboxing spinner

  plinko: any; // for plinko
  game: any; // for plinko
  amounts: any;
  history: any;
  cases: any; //casebattle
  casebattle: any; //casebattle
  battles: CaseBattleBetType[]; //casebattle

  list: any; // inventory list
  pages: any; // inventory total pages
  inventory: any; // inventory info
  ids: any; // inventory sell all
  emoji: any; // casebattle emoji interaction
  position: any; // casebattle emoji interaction
  data: any; //
  stage: string;
  players: any;
  action: string;
  round: any;

  stats: any;
};

export type SocketResponseData = {
  error?: boolean;
  message: string;
  data: SocketResponseDataDetails;
};

export type UserLevel = {
  level: number;
  next: number;
  have: number;
  start: number;
};

export type SiteSetting = {
  key: string;
  value: string;
};

export type UserData = {
  userid: string;
  name: string;
  rank: number;
  balance: string;
  level: UserLevel;
  siteSettings: SiteSetting[];
};
/**
 * Types for Messaging
 */
export type MessageUserType = {
  userid: string;
  name: string;
  avatar: string;
  level: number;
  rank: number;
};
export type MessageMentionType = {
  mention: string;
  name: string;
};

export type UserMessageType = {
  type: string;
  id: number;
  user: MessageUserType;
  rank: number;
  private: number;
  message: string;
  channel: string;
  mentions: MessageMentionType[];
  time: number;
};

export type DailyCaseType = {
  id: string;
  name: string;
  image: string;
  level: number;
  time: number;
};
/**
 * Plinko Game
 */
export type PlinkoAndUnboxingFairHistoryType = {
  id: string;
  using: boolean;
  server_seed: string;
  client_seed: string;
  nonce: string;
  roll: string;
  tickets?: string;
};

/**
 * Coinflip Game
 */
export type CoinflipRoll = {
  public_seed: string;
  blockid: string;
  roll: number;
};

export type CoinflipHistoryRecord = {
  id: string;
  canceled: boolean;
  ended: boolean;
  amount: string;
  server_seed: string;
  time: string;
  coinflip_rolls: CoinflipRoll[];
};

export type CoinFlipBetType = {
  status: number;
  coinflip: Coinflip;
};
export type Coinflip = {
  id: string;
  players: CoinflipPlayer[];
  amount: number;
  data: CoinflipGameData;
};

export type CoinflipGameData = {
  server_seed_hashed: string;
  nonce: string;
  time?: number;
  winner?: number;
  game?: {
    server_seed_hashed: string;
    server_seed?: string;
    public_seed?: string;
    block?: string;
    nonce?: string;
  };
};

export type CoinflipPlayer = {
  user: GameUser;
  position: number;
  creator: boolean;
  bot: boolean;
};

export type GameUser = {
  userid: string;
  name: string;
  avatar: string;
  level: number;
};

export type BotType = {
  user: GameUser;
  bets: number;
  winnings: number;
};

/**
 * Unboxing Game
 */
export type UnboxingCaseItemType = {
  id: string;
  chance: number;
};

export type UnboxingCaseType = {
  id: string;
  name: string;
  price: number;
  image?: string;
  items?: UnboxingCaseItemType[];
};

export type UnboxingWinningType = {
  name: string;
  image: string;
  price: number;
  chance: number;
  id?: string;
  color?: string;
};

export type UnboxingHistoryItemType = {
  user: GameUser;
  unboxing: UnboxingCaseType;
  winning: UnboxingWinningType;
};

export type UnboxingGameItemTickets = {
  min: number;
  max: number;
};

export type UnboxingGameItem = {
  name: string;
  image: string;
  price: number;
  chance: number;
  tickets: UnboxingGameItemTickets;
};

/**
 * Casebattle
 */

export interface CasebattlePlayer {
  user: GameUser;
  position: number;
  creator: number;
  bot: number;
  items: any[];
  total: number;
}

// this is also used for Inventory Item
export interface CaseBattleCase {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface CaseBattleType {
  id: string;
  players: CasebattlePlayer[];
  mode: number;
  cases: CaseBattleCase[];
  amount: number;
  free: number;
  crazy: number;
  time: number;
  data: {
    countdown: number;
    spinner: any;
    winners: number[];
    spinners: any;

    [key: string]: any; // Extendable for other dynamic data
  };
}

export interface CaseBattleBetType {
  status: number;
  casebattle: CaseBattleType;
}

export interface InventoryItemType {
  item: CaseBattleCase;
}

export interface ActiveEmoji {
  position: any;
  emoji: any;
}

export interface SelectedCasesType {
  [key: string]: number;
}

export interface UserGameResultData {
  username: string;
  userId: string;
  avatarUrl: string;
  winAmount: number;
  betAmount: number;
  profitAmount?: number;
}

export type ProfileData = {
  userid: string;
  registrationDate: string;
  email: string;
  availableBalance: number;
  availableWithdraw: number;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  sounds: boolean;
  anonymous: boolean;
  privateMode: boolean;
};
