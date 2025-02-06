'use client';

import {
  faArrowLeft,
  faRedo,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';

const cryptoNames = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  ltc: 'Litecoin',
  bch: 'Bitcoin Cash',
  usdc: 'USD Coin',
  usdt: 'Tether',
  doge: 'Dogecoin',
  xrp: 'Ripple',
};

type PropsComponent = {
  slug: string;
};

// Interface for cached cryptocurrency rate data
interface CryptoCache {
  rate: number;
  timestamp: number;
}

const DepositCryptoContent = ({ slug }: PropsComponent) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(1);
  const [amount, setAmount] = useState<number>(120);
  const [transactions, setTransactions] = useState<Array<any>>([]);
  const clientSocket = useSocketIoClient();

  const handleCreateInvoice = async () => {
    try {
      setIsCreatingInvoice(true);
      const params = new URLSearchParams({
        source_currency: 'USD',
        source_amount: `${amount / 1.2}`,
        order_number: `${Date.now()}`,
        allowed_psys_cids: `${slug.toUpperCase()}`,
        order_name: `${Cookies.get('userid')}`,
      });

      const url = '/api/invoices?' + params.toString();
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setIsCreatingInvoice(false);
        setError(data.error);
      } else {
        setIsCreatingInvoice(false);
        setInvoice(data);
        fetchTransactions();
      }
    } catch (err: any) {
      setIsCreatingInvoice(false);
      setError(err.message);
    }
  };

  const getCryptoFullName = (symbol: string) => {
    return (
      cryptoNames[symbol as keyof typeof cryptoNames] ||
      'Unknown Cryptocurrency'
    );
  };

  useEffect(() => {
    async function getCryptoRate(cryptoId: string): Promise<void> {
      const cacheKey = `crypto_${cryptoId}`;
      const now = Date.now();
      const cacheExpiry = 600000; // Cache expiry time in milliseconds (1 minute)

      // Check if cached data exists and is not expired
      const cachedData: CryptoCache | null = JSON.parse(
        localStorage.getItem(cacheKey) || 'null'
      );

      if (cachedData && now - cachedData.timestamp < cacheExpiry) {
        setRate(cachedData.rate);
      } else {
        try {
          const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency rate');
          }

          const data = await response.json();
          const rate = data[cryptoId]?.usd;

          if (rate !== undefined) {
            // Save new data to local storage with a timestamp
            const cacheData: CryptoCache = {
              rate,
              timestamp: now,
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            setRate(rate);
          }
        } catch (error) {
          console.error(`API call failed for ${cryptoId}`, error);
        }
      }
    }
    getCryptoRate(getCryptoFullName(slug).toLowerCase().replace(' ', '-'));
  }, [slug]);

  async function fetchTransactions() {
    try {
      const response = await fetch(
        `/api/crypto-transactions?userid=${Cookies.get('userid')}&currency=${slug.toUpperCase()}`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  const reloadStatus = async (id: any) => {
    try {
      const response: any = await fetch(
        `/api/crypto-transactions/get-updated?id=${id}`
      );
      const data = await response.json();

      if (data.data.status === 'completed') {
        clientSocket?.sendBalanceRequest();
        toast.success('Funds have been added to your account.');
      }

      setTransactions((prevTransactions) =>
        prevTransactions.map(
          (transaction) =>
            transaction.address === id
              ? { ...transaction, type: data.data.status } // Update status
              : transaction // Leave others unchanged
        )
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [slug]);

  return (
    <div className='flex column height-full width-full'>
      <div className='wrapper-page flex row'>
        <div className='flex column height-full width-full p-2'>
          <div className='flex justify-start'>
            <Link href='/deposit'>
              <button className='site-button black flex gap-1'>
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Options
              </button>
            </Link>
          </div>

          <div className='flex column items-center gap-2 mt-4 overflow-a'>
            <div className='width-6 responsive text-left'>
              <div className='font-10 text-bold mb-2'>
                Deposit with {getCryptoFullName(slug)}
              </div>

              <div className='font-6 text-gray'>
                You will receive diesel automatically after sending{' '}
                {slug.toUpperCase()} to the address displayed below.
              </div>
            </div>

            <div className='bg-light-transparent text-left rounded-1 b-d2 p-4 width-6 responsive currency-panel'>
              <div className='font-8 text-bold mb-2'>
                {getCryptoFullName(slug)} wallet address
              </div>

              <div className='table-container width-12 responsive'>
                <div className='table-header'>
                  <div className='table-row'>
                    <div className='table-column text-left'>Url</div>
                    <div className='table-column text-left'>Amount</div>
                    <div className='table-column text-left'>Action</div>
                    <div className='table-column text-left'>State</div>
                  </div>
                </div>

                <div className='table-body'>
                  {transactions
                    ? transactions.map((transaction, idx) => {
                        return (
                          <div className='table-row' key={'table_row_' + idx}>
                            <div className='table-column text-left'>
                              {transaction.address}
                            </div>
                            <div className='table-column text-left'>
                              {transaction.amount} = {transaction.amount * 1.2}{' '}
                              Diesel
                            </div>
                            <div className='table-column text-left'>
                              <a
                                href={
                                  'https://plisio.net/invoice/' +
                                  transaction.address
                                }
                                target='_blank'
                                className='!underline'
                              >
                                Pay now
                              </a>
                            </div>
                            <div className='table-column text-left'>
                              <div className='flex justify-between items-center'>
                                {transaction.type.toUpperCase()}
                                <div>
                                  <button
                                    onClick={() =>
                                      reloadStatus(transaction.address)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faRedo} />
                                  </button>
                                  {/* <button className='ml-2'>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ''}
                </div>
              </div>
              <div
                className='flex column items-center gap-2 font-10'
                id='panel_currency_bottom'
              >
                {isCreatingInvoice && <span>Creating invoice url</span>}
                <button
                  type='button'
                  className='site-button purple mt-2'
                  onClick={handleCreateInvoice}
                >
                  CREATE A NEW INVOICE URL
                </button>
              </div>
            </div>

            <div className='bg-light-transparent text-left rounded-1 b-d2 p-4 width-6 responsive currency-panel'>
              <div className='font-8 text-bold mb-2'>
                {getCryptoFullName(slug)} to Diesel rate calculator
              </div>

              <div className='flex responsive'>
                <div
                  className='input_field bet_input_field transition-5'
                  data-border='#de4c41'
                  style={{
                    border: '2px solid var(--site-color-bg-dark)',
                    color: 'unset',
                  }}
                >
                  <div className='field_container'>
                    <div className='field_content'>
                      <input
                        type='text'
                        className='field_element_input'
                        id='currency_coin_from'
                        data-currency='ltc'
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                      />

                      <div className='field_label transition-5 active'>
                        <div className='input_coins coins mr-1'></div>Diesel
                      </div>
                    </div>

                    <div className='field_extra'></div>
                  </div>

                  <div className='field_bottom'>
                    <div className='field_error' data-error='number'>
                      This field must be a number
                    </div>
                    <div className='field_error' data-error='greater'>
                      You must enter a greater value
                    </div>
                  </div>
                </div>

                <div className='flex justify-center items-center pr-2 pl-2 font-10'>
                  =
                </div>

                <div
                  className='input_field bet_input_field transition-5'
                  data-border='#de4c41'
                  style={{
                    border: '2px solid var(--site-color-bg-dark)',
                    color: 'unset',
                  }}
                >
                  <div className='field_container'>
                    <div className='field_content'>
                      <input
                        type='text'
                        className='field_element_input'
                        id='currency_coin_to'
                        data-currency='ltc'
                        value={rate ? amount / rate / 1.2 : 0}
                      />

                      <div className='field_label transition-5 active'>
                        <div className={`input_coins ${slug}-coins mr-1`}></div>{' '}
                        {getCryptoFullName(slug)}
                      </div>
                    </div>

                    <div className='field_extra'></div>
                  </div>

                  <div className='field_bottom'>
                    <div className='field_error' data-error='number'>
                      This field must be a number
                    </div>
                  </div>
                </div>
              </div>

              <div className='font-6 text-gray'>
                The exchange rate shown above is an estimate. The final rate is
                determined by the time of the transaction.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositCryptoContent;
