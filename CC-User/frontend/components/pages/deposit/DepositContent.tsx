'use client';
import Input from '@/components/ui/Input';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import TradeUrlDlg from './TradeUrlDlg';
import { toast } from 'react-toastify';
import { SocketResponseData } from '@/lib/client/types';
import onMessageSocket from '@/lib/client/socket-message-handler';

type Item = {
  assetid: string;
  name: string;
  icon_url: string;
  price: string;
};

const DepositSteamContent = () => {
  const [searchVal, setsearchVal] = useState('');
  const [activeOrderByVal, setactiveOrderByVal] = useState('Price descending');
  const [inventory, setInventory] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tradeUrlDlg, setTradeUrlDlg] = useState(false);
  const [tradeUrl, setTradeUrl] = useState('');
  const [totalAmount, setTotalAmount] = useState('0');
  const clientSocket = useSocketIoClient();

  useEffect(() => {
    const loadTradeUrl = async () => {
      const response = await fetch('/api/users/trade-url');
      const data = await response.json();
      if (data.tradelink) {
        setTradeUrl(data.tradelink);
        setTradeUrlDlg(false);
      } else {
        setTradeUrlDlg(true);
      }
    };
    loadTradeUrl();
  }, []);

  const onConfirmTradeUrl = async () => {
    const response = await fetch('/api/users/trade-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tradelink: tradeUrl,
      }),
    });
    const data = await response.json();
    toast.success('Trade Url is saved to your account');
    setTradeUrlDlg(false);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'search') setsearchVal(value);
  };

  const onSelect = (value: string) => {
    setactiveOrderByVal(value);
  };

  const sortInventory = (items: Item[]) => {
    switch (activeOrderByVal) {
      case 'Price descending':
        return items.sort(
          (a, b) =>
            parseFloat(b.price.replace('$', '')) -
            parseFloat(a.price.replace('$', ''))
        );
      case 'Price ascending':
        return items.sort(
          (a, b) =>
            parseFloat(a.price.replace('$', '')) -
            parseFloat(b.price.replace('$', ''))
        );
      case 'Name A-Z':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'Name Z-A':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return items;
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    try {
      const inventoryUrl = `https://www.steamwebapi.com/steam/api/inventory?key=Q57B3200PEOB3CE4&steam_id=${Cookies.get('email')}&game=rust&no_cache=no_cache`;
      const response = await axios.get(inventoryUrl);
      const blockedSkins = await axios.get('/api/steam/blockedskins');
      let maxPrice = 0;
      let blockingSkinItems: string[] = [];
      blockedSkins.data.blockedSkins.forEach(
        (skin: {
          id: number;
          blockMethod: 'value' | 'name';
          blockValue: string;
        }) => {
          if (
            skin.blockMethod === 'value' &&
            parseFloat(skin.blockValue) > maxPrice
          )
            maxPrice = parseFloat(skin.blockValue);
          if (skin.blockMethod === 'name')
            blockingSkinItems.push(skin.blockValue);
        }
      );

      const data = response.data;

      if (data.length > 0) {
        const items = data.map((asset: any) => {
          return {
            assetid: asset.assetid,
            classid: asset.classid,
            name: asset.markethashname,
            icon_url: asset.image,
            tradable: asset.tradable,
            price: '$' + asset.pricelatest.toFixed(2),
          };
        });
        const sortedInventory = sortInventory(
          items.filter(
            (item: any) =>
              parseFloat(item.price.replace('$', '')) > maxPrice &&
              blockingSkinItems.findIndex((v: string) => v === item.name) === -1
          )
        );
        setInventory(sortedInventory);
      } else {
        setInventory([]);
      }
      clientSocket?.sendBalanceRequest();
      setSelectedItems([]);
    } catch (error) {
      setInventory([]);
      setSelectedItems([]);
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    // Re-sort inventory when order changes
    setInventory((prevInventory) => sortInventory([...prevInventory]));
  }, [activeOrderByVal]);

  const toggleSelectItem = (assetid: string) => {
    setSelectedItems((prev) =>
      prev.includes(assetid)
        ? prev.filter((id) => id !== assetid)
        : [...prev, assetid]
    );
  };

  useEffect(() => {
    let total = 0;
    inventory
      .filter((v) => selectedItems.indexOf(v.assetid) !== -1)
      .forEach((v) => {
        total += parseFloat(v.price.replace('$', ''));
      });
    setTotalAmount(total.toFixed(2));
  }, [selectedItems]);

  const handleDeposit = () => {
    clientSocket?.sendDepositRequest({
      steamID: tradeUrl,
      userid: Cookies.get('userid'),
      items: selectedItems,
      itemDescriptions: inventory.filter(
        (v: Item) => selectedItems.indexOf(v.assetid) !== -1
      ),
    });
  };

  // useEffect(() => {
  //   if (!clientSocket) {
  //     return;
  //   }
  //   const receiveMessageHandler = (receivedMessage: any) => {
  //     console.log(receivedMessage);
  //     const { error, data }: SocketResponseData =
  //       onMessageSocket(receivedMessage);
  //     console.log(error, data);
  //     if (error) {
  //       return;
  //     }
  //     if (data.type === 'first') {
  //     }
  //   };

  //   clientSocket.subscribe('message', receiveMessageHandler);

  //   return () => {
  //     clientSocket.removeAllListeners();
  //   };
  // }, [clientSocket]);

  return (
    <>
      <div className='flex column height-full width-full'>
        <div className='wrapper-page flex row'>
          <div className='flex column height-full width-full content-spliter p-2 min-h-[300px]'>
            <div className='flex justify-between'>
              <Link href='/deposit'>
                {' '}
                <button className='site-button black flex gap-1'>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back to Options
                </button>
              </Link>
              <div>
                <div
                  className={
                    'site-button purple mr-6' +
                    (selectedItems.length === 0 ? ' disabled' : '')
                  }
                >
                  <div className='coins'></div>
                  {totalAmount}
                </div>
                <button
                  className={
                    'site-button purple mr-6' +
                    (selectedItems.length === 0 ? ' disabled' : '')
                  }
                  onClick={handleDeposit}
                  disabled={selectedItems.length === 0}
                >
                  Deposit
                </button>
                <button
                  className='site-button purple mr-6'
                  onClick={loadInventory}
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className='flex gap-1'>
              <div
                className='input_field bet_input_field transition-5'
                data-border='#de4c41'
              >
                <Input
                  label='Search Item'
                  name='search'
                  value={searchVal}
                  onInput={onInput}
                />
                <div className='field_extra'></div>
                <div className='field_bottom'></div>
              </div>
              <div className='dropdown_field transition-5 overflow-visible'>
                <Input
                  label='Order by'
                  name='order-by'
                  dropdownData={[
                    { value: 'Price descending' },
                    { value: 'Price ascending' },
                    { value: 'Name A-Z' },
                    { value: 'Name Z-A' },
                  ]}
                  activeVal={activeOrderByVal}
                  onSelect={onSelect}
                  value=''
                />
                <div className='field_bottom'></div>
              </div>
            </div>

            {loading && <ClipLoader color='#000' loading={loading} size={50} />}
            <div className='height-full' id='list_items'>
              {inventory ? (
                inventory.map(
                  (item) =>
                    item.name.toLowerCase().indexOf(searchVal.toLowerCase()) !==
                      -1 && (
                      <div
                        key={item.assetid}
                        className={`item ${selectedItems.includes(item.assetid) ? 'selected' : ''}`}
                        onClick={() => toggleSelectItem(item.assetid)}
                      >
                        <img src={`${item.icon_url}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>
                          <span className='coins' />
                          {item.price.replace('$', '')}
                        </p>
                      </div>
                    )
                )
              ) : (
                <div className='in-grid font-8 history_message'>
                  Session expired or you are not logged in. Please refresh the
                  page and try again.
                </div>
              )}
            </div>
          </div>
        </div>
        <TradeUrlDlg
          open={tradeUrlDlg}
          setOpen={setTradeUrlDlg}
          tradeUrl={tradeUrl}
          setTradeUrl={setTradeUrl}
          onConfirm={onConfirmTradeUrl}
        />
      </div>
    </>
  );
};

export default DepositSteamContent;
