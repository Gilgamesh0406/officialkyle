'use client';
import Input from '@/components/ui/Input';
import { ChangeEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import FairnessExplanation from '@/components/pages/fair/FairnessExplanation';
import FairnessInfo from '@/components/pages/fair/FairnessInfo';
import CoinFlipFairness from '@/components/pages/fair/CoinFlipFairness';
import UnboxingFairness from '@/components/pages/fair/UnboxingFairness';
import CaseBattleFairness from '@/components/pages/fair/CaseBattleFairness';
import PlinkoFairness from '@/components/pages/fair/PlinkoFairness';
const page = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSeedVal, setclientSeedVal] = useState('');
  const [serverSeedVal, setserverSeedVal] = useState('');

  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    undefined | number
  >(0);
  const userid = Cookies.get('userid');
  useEffect(() => {
    if (!userid) {
      return;
    }
    fetch('/api/fair?userid=' + userid)
      .then((response) => response.json())
      .then((data) => {
        setData(JSON.parse(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'clientSeed') setclientSeedVal(value);
    if (name === 'serverSeed') setserverSeedVal(value);
  };

  const handleAccordion = (index: number) => {
    if (index === activeAccordionIndex) {
      setActiveAccordionIndex(undefined);
      return;
    }
    setActiveAccordionIndex(index);
  };

  return (
    <div className='flex column responsive items-center p-2'>
      <div className='title-page flex items-center justify-center text-center'>
        Provably Fair
      </div>

      <div className='width-9 responsive text-left'>
        <FairnessExplanation />

        <div className='fair-grid width-full rounded-1 overflow-h mt-2'>
          <FairnessInfo
            activeAccordionIndex={activeAccordionIndex}
            clientSeedVal={clientSeedVal}
            handleAccordion={handleAccordion}
            onInput={onInput}
            serverSeedVal={serverSeedVal}
          />
          <CoinFlipFairness
            activeAccordionIndex={activeAccordionIndex}
            handleAccordion={handleAccordion}
            history={data.fair && data.fair.coinflip}
          />
          <UnboxingFairness
            activeAccordionIndex={activeAccordionIndex}
            handleAccordion={handleAccordion}
            history={data.fair && data.fair.histories.unboxing}
          />
          <CaseBattleFairness
            activeAccordionIndex={activeAccordionIndex}
            handleAccordion={handleAccordion}
            history={data.fair && data.fair.casebattle}
          />
          <PlinkoFairness
            activeAccordionIndex={activeAccordionIndex}
            handleAccordion={handleAccordion}
            history={data.fair && data.fair.histories.plinko}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
