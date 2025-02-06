import React, { createContext, useState, ReactNode, ChangeEvent } from 'react';

interface FormData {
  searchCase: string;
  players: string;
  orderBy: string;
}

interface Stats {
  active: number;
  total: number;
}

interface CaseBattleContextProps {
  formData: FormData;
  stats: Stats;
  setStats: (p: Stats) => void;
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelect: (value: string, name?: string) => void;
  onCreateSameBattle: () => void;
  setCreateBattleData: (a: any) => void;
  createBattleData: any;
  create: boolean;
  cost: number;
  setCost: (p: number) => void;
  setCreate: (b: boolean) => void;
}

export const CaseBattleContext = createContext<
  CaseBattleContextProps | undefined
>(undefined);

export const CaseBattleProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    searchCase: '',
    players: 'All',
    orderBy: 'Latest',
  });
  const [create, setCreate] = useState(false);

  const [stats, setStats] = useState<Stats>({
    active: 0,
    total: 0,
  });

  const [cost, setCost] = useState(0);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSelect = (value: string, name?: string) => {
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onCreateSameBattle = () => {
    setCreate(true);
  };
  const [createBattleData, setCreateBattleData] = useState<any>();

  return (
    <CaseBattleContext.Provider
      value={{
        formData,
        stats,
        onInput,
        onSelect,
        setStats,
        onCreateSameBattle,
        setCreateBattleData,
        createBattleData,
        create,
        cost,
        setCost,
        setCreate,
      }}
    >
      {children}
    </CaseBattleContext.Provider>
  );
};
