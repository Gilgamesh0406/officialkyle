'use client';
import CaseBattleCreateMode from '@/components/modals/CaseBattleCreateMode';
import CreateBattleModal from '@/components/modals/CreateBattleModal';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import onMessageSocket from '@/lib/client/socket-message-handler';
import {
  CaseBattleCase,
  SelectedCasesType,
  SocketResponseData,
} from '@/lib/client/types';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {
  ChangeEvent,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { CaseBattleContext } from '@/providers/CaseBattleContext';
import CaseItem from '@/components/pages/casebattle/create/CaseItem';

const CreateCaseBattle = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    crazy: false,
    privacy: false,
    mode: 0,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cases, setCases] = useState<CaseBattleCase[]>([]);
  const [selectedCases, setSelectedCases] = useState<SelectedCasesType>({});

  const context = useContext(CaseBattleContext);
  if (!context) {
    throw new Error(
      'CaseBattleContext must be used within a CaseBattleProvider'
    );
  }
  const { setStats, setCost, cost, create, setCreate } = context;

  const clientSocket = useSocketIoClient();

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      setErrorMessage('');
    }
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage('');
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (!clientSocket) return;

    const messageHandler = (received: any) => {
      const { data, error, message }: SocketResponseData =
        onMessageSocket(received);
      if (error) {
        setErrorMessage(message);
        setCreate(false);
        return;
      }
      if (data.type === 'casebattle' && data.command === 'cases') {
        setCases(data.cases);
      } else if (data.type === 'success') {
        data.success && setSuccessMessage(data.success);
      } else if (data.type === 'first') {
        setStats(data.casebattle.stats);
        clientSocket.sendRequest({
          type: 'casebattle',
          command: 'cases',
        });
      } else if (data.type === 'casebattle' && data.command === 'redirect') {
        if (data.action === 'join') {
          window.location.href = `/casebattle/${data.id}`;
          return;
        }
        window.location.href = '/casebattle/list/active';
      }
    };

    clientSocket.subscribe('message', messageHandler);
    const session = Cookies.get('session');
    clientSocket.send('join', {
      session,
      paths: ['casebattle', 'create'],
      channel: getProfileSettingValue('channel') || 'en',
    });

    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket, setStats]);

  const handleAddCase = () => {
    setModalIsOpen(true);
  };

  const handleCountChange = (id: string, value: number) => {
    const cs = cases.find((c) => c.id === id);
    if (!cs) return;
    setSelectedCases((prevState) => {
      const currentCount = prevState[cs.id] || 0;
      const newCount = currentCount + value;
      return {
        ...prevState,
        [cs.id]: Math.max(newCount, 0), // Prevent negative counts
      };
    });
  };

  const calculateTotal = useCallback(() => {
    return cases.reduce((acc, cur) => {
      return (
        acc + (selectedCases[cur.id] ? cur.price * selectedCases[cur.id] : 0)
      );
    }, 0);
  }, [cases, selectedCases]);

  useEffect(() => {
    const tmp = calculateTotal();
    setCost(tmp);
  }, [selectedCases]);

  useEffect(() => {
    if (create) {
      let tmp = [];
      for (const key in selectedCases) {
        let count = selectedCases[key];
        while (count > 0) {
          tmp.push(key);
          count--;
        }
      }
      if (tmp.length > 0) {
        clientSocket?.sendRequest({
          type: 'casebattle',
          command: 'create',
          cases: tmp,
          mode: formData.mode,
          privacy: formData.privacy ? 1 : 0,
          crazy: formData.crazy ? 1 : 0,
          free: 0,
        });
      } else {
        setErrorMessage('You have to select minimum 1 cases!');
        setCreate(false);
      }
    }
  }, [create]);

  return (
    <>
      <div className='flex column gap-2 m-2'>
        <div className='width-full pb-2 bb-l2' id='casebattle_create_list'>
          {cases &&
            cases.map((cs: CaseBattleCase) => {
              const selected = selectedCases[cs.id] || 0;
              if (selected > 0) {
                return (
                  <CaseItem
                    count={selected}
                    key={cs.id}
                    id={cs.id}
                    image={cs.image}
                    name={cs.name}
                    price={cs.price}
                    onCountChange={(n: number) => handleCountChange(cs.id, n)}
                    active={false}
                  />
                );
              }
            })}
          <div className='case-item flex column gap-1'>
            <div className='case-slot rounded-0'>
              <div className='flex justify-center items-center height-full width-full'>
                <button
                  onClick={handleAddCase}
                  className='site-button purple casebattle-add'
                >
                  Add Cases
                </button>
              </div>
            </div>
          </div>
        </div>
        <CaseBattleCreateMode
          formData={formData}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { name, checked } = e.target;
            setFormData((prevData) => ({ ...prevData, [name]: checked }));
          }}
          setFormData={setFormData}
        />
      </div>
      <CreateBattleModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        cases={cases}
        selectedCases={selectedCases}
        onCountChange={handleCountChange}
        total={cost}
      />
    </>
  );
};

export default CreateCaseBattle;
