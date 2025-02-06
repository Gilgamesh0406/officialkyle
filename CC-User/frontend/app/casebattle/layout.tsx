'use client';
import CaseBattleFairModal from '@/components/modals/CaseBattleFairModal';
import BattleCaseSearch from '@/components/pages/casebattle/nav/BattleCaseSearch';
import BattleStats from '@/components/pages/casebattle/nav/BattleStats';
import CaseBattleCreate from '@/components/pages/casebattle/nav/CaseBattleCreate';
import CaseBattleNav from '@/components/pages/casebattle/nav/CaseBattleNav';
import {
  CaseBattleContext,
  CaseBattleProvider,
} from '@/providers/CaseBattleContext';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';

const Layout = ({ children }: any) => {
  const pathname = usePathname();
  const context = useContext(CaseBattleContext);

  if (!context) {
    throw new Error(
      'CaseBattleContext must be used within a CaseBattleProvider'
    );
  }
  const {
    formData,
    stats,
    onInput,
    onSelect,
    onCreateSameBattle,
    createBattleData,
    cost,
  } = context;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex column gap-2 before:content-[''] before:absolute before:w-[calc(100%+30px)] before:h-[calc(100%+16px)] before:bg-[#27273180] before:border before:border-black border-transparent before:-left-6 before:-top-6 relative bb-d2 p-2 ">
        <CaseBattleNav />
        <div
          className={`relative z-10 flex row items-center responsive gap-2 pr-2 pl-2 justify-between py-2`}
        >
          <BattleStats
            activeCount={stats.active}
            activeImageSrc='/imgs/swords1.png'
            totalCount={stats.total}
            totalImageSrc='/imgs/swords2.png'
          />
          <CaseBattleCreate
            onCreateSameBattle={onCreateSameBattle}
            createBattleData={createBattleData}
            setModalOpen={setModalOpen}
            cost={cost}
          />
        </div>
        {pathname.includes('/casebattle/list') && (
          <BattleCaseSearch
            formData={formData}
            onInput={onInput}
            onSelect={onSelect}
          />
        )}
      </div>

      {children}
      <CaseBattleFairModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        modalData={createBattleData}
      />
    </>
  );
};

export default function CaseBattleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CaseBattleProvider>
      <Layout>{children}</Layout>
    </CaseBattleProvider>
  );
}
