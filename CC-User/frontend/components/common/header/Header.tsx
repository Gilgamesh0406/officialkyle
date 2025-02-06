'use client';
import HeaderMax from './HeaderMax';
import HeaderMin from './HeaderMin';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { navigations } from '@/lib/client/navigation';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import onMessageSocket from '@/lib/client/socket-message-handler';
import {
  CaseBattleCase,
  DailyCaseType,
  InventoryItemType,
  SiteSetting,
  SocketResponseData,
  UserData,
} from '@/lib/client/types';
import SettingsModal from '@/components/modals/SettingsModal';
import DailyCasesModal from '@/components/modals/DailyCasesModal';
import InventoryModal from '@/components/modals/InventoryModal';

const Header = () => {
  const clientSocket = useSocketIoClient();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [SettingsModalIsOpen, setsetSettingsModalIsOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItemType[]>();
  const [userData, setUserData] = useState<UserData>({
    userid: '',
    name: '',
    rank: 0,
    balance: '0.00',
    level: {
      level: 0,
      next: 500,
      have: 0,
      start: 0,
    },
    siteSettings: [],
  });

  useEffect(() => {
    if (!clientSocket) {
      return;
    }
    const receiveMessageHandler = (receivedMessage: any) => {
      const { error, data }: SocketResponseData =
        onMessageSocket(receivedMessage);
      if (error) {
        return;
      }

      if (data.type === 'first') {
        //get first data from socket
        if (data.user) {
          setUserData({
            userid: data.user.userid,
            name: data.user.name,
            rank: data.user.rank,
            balance: data.user.balance,
            level: data.user.level,
            siteSettings: data.user.siteSettings,
          });
          localStorage.setItem(
            'siteSettings',
            JSON.stringify(data.user.siteSettings)
          );
        }
        return;
      } else if (data.type === 'level') {
        setUserData((prev) => ({
          ...prev,
          level: data.level,
        }));
        return;
      } else if (data.type === 'balance') {
        setUserData((prev) => ({
          ...prev,
          balance: data.balance,
        }));
        return;
      } else if (data.type === 'dailycases') {
        setDailyCases(data.cases);
      } else if (
        data.type === 'pagination' &&
        data.command === 'inventory_items'
      ) {
        setInventoryItems(data.list);
        setInventoryPages(data.pages);
        data.inventory && setInventoryValue(data.inventory.value);
      } else if (data.type === 'inventory' && data.command === 'sell_item') {
        setInventoryValue(data.inventory.value);
        setInventoryItems((prev) =>
          prev?.filter((it) => it.item.id !== data.id)
        );
      } else if (data.type === 'inventory' && data.command === 'sell_items') {
        data.inventory && setInventoryValue(data.inventory.value);
        setInventoryItems((prev) =>
          prev?.filter((it) => !data.ids.includes(it.item.id))
        );
      }
    };

    clientSocket.subscribe('message', receiveMessageHandler);

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket]);

  // const filteredRoutes = navTopController.filter((route) =>
  //   user ? !route.role || route.role === user.role : route
  // );
  const filteredRoutes = navigations.filter((route) => route);

  /**
   * Daily Cases handlers
   */
  const [dailyCaseOpen, setDailyCaseOpen] = useState(false);
  const [dailyCases, setDailyCases] = useState<DailyCaseType[]>([]);
  useEffect(() => {
    if (dailyCaseOpen) {
      clientSocket?.sendRequest({
        type: 'dailycases',
        command: 'cases',
      });
    }
  }, [dailyCaseOpen]);

  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryPages, setInventoryPages] = useState(1);
  const [inventoryValue, setInventoryValue] = useState(0);
  useEffect(() => {
    if (inventoryOpen) {
      // send request
      clientSocket?.sendRequest({
        type: 'pagination',
        command: 'inventory_items',
        page: inventoryPage,
      });
    }
  }, [inventoryOpen, inventoryPage]);
  const sellItem = (id: string) => {
    clientSocket?.sendRequest({
      type: 'inventory',
      command: 'sell_item',
      id: id,
    });
  };

  const sellAllItems = () => {
    clientSocket?.sendRequest({
      type: 'inventory',
      command: 'sell_all',
    });
  };

  return (
    <>
      <HeaderMax
        filteredRoutes={filteredRoutes}
        modalIsOpen={modalIsOpen}
        pathname={pathname}
        session={session}
        userData={userData}
        setsetSettingsModalIsOpen={setsetSettingsModalIsOpen}
        setDailyCaseOpen={setDailyCaseOpen}
        setInventoryOpen={setInventoryOpen}
      />
      <HeaderMin
        filteredRoutes={filteredRoutes}
        modalIsOpen={modalIsOpen}
        pathname={pathname}
        session={session}
        userData={userData}
        setsetSettingsModalIsOpen={setsetSettingsModalIsOpen}
        setDailyCaseOpen={setDailyCaseOpen}
        setInventoryOpen={setInventoryOpen}
      />
      <SettingsModal
        isOpen={SettingsModalIsOpen}
        setIsOpen={(val: boolean) => setsetSettingsModalIsOpen(val)}
      />
      <DailyCasesModal
        open={dailyCaseOpen}
        setOpen={setDailyCaseOpen}
        dailyCases={dailyCases}
      />
      <InventoryModal
        open={inventoryOpen}
        setOpen={setInventoryOpen}
        items={inventoryItems ? inventoryItems : []}
        page={inventoryPage}
        setPage={setInventoryPage}
        pages={inventoryPages}
        total={inventoryValue}
        sellItem={sellItem}
        sellAllItems={sellAllItems}
      />
    </>
  );
};

export default Header;
