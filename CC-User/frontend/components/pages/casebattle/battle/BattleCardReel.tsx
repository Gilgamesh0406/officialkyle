import React, { useEffect, useRef, useState } from 'react';
import { CaseBattleType } from '@/lib/client/types';
import { playSound } from '@/lib/client/utils';
import gsap from 'gsap';

type Props = {
  casebattle: CaseBattleType;
  position: number;
  round: number | null;
};

const BattleCardReel: React.FC<Props> = ({ casebattle, position, round }) => {
  if (
    !casebattle.data ||
    !casebattle.data.spinners ||
    !casebattle.data.spinners[position.toString()]
  )
    return;

  const spinnerData = casebattle.data.spinners[position.toString()];
  const reelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [winningPrice, setWinningPrice] = useState<number>(0);
  const [moving, setMoving] = useState(false);

  const startSpinner = (partSpinnerHeight: number) => {
    const distance = partSpinnerHeight * 101; // Adjust the distance for a visible effect
    const endOffset = -(distance + 50.5); //11760 =  (partSpinnerHeight(116) * 101 = 11716 + 44)
    gsap
      .timeline()
      .fromTo(
        reelRef.current,
        {
          y: 0,
        },
        {
          // y: position % 2 === 0 ? endOffset - 40 : endOffset + 40,
          y: position % 2 === 0 ? endOffset - Math.floor(Math.random() * 41) : endOffset + Math.floor(Math.random() * 41),
          duration: 5,
          ease: 'power4.inOut',
          onComplete: () => {
            setMoving(false);
            console.log('Animation Complete for ' + round);
          },
        }
      )
      .to(reelRef.current, {
        y: endOffset,
        duration: 1,
        ease: 'none',
      })
      .to(resultRef.current, {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      })
      .to(resultRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
  };

  const handleCaseBattleOpen = () => {
    if (!reelRef.current) {
      return;
    }
    const partSpinnerHeight = reelRef.current.firstChild
      ? (reelRef.current.firstChild as HTMLDivElement).clientHeight
      : 0;

    startSpinner(partSpinnerHeight);
    playSound('casebattle_rolling');
  };

  useEffect(() => {
    if (moving || round === null) {
      return;
    }
    if (round < casebattle.cases.length) {
      const price = spinnerData.find(
        (item: any) => item.price !== undefined
      ).price;
      setMoving(true);
      setWinningPrice(price);
      handleCaseBattleOpen();
    }
  }, [round]);

  return (
    <>
      <div
        className='casebattle-reel flex column height-full'
        id={'reelElement-' + position}
        ref={reelRef}
      >
        {spinnerData &&
          spinnerData.map((item: any, index: number) => (
            <div
              className='casebattle-icon rounded-0 reel flex justify-center items-center pl-2 pr-2 listing-slot'
              data-id={index === 99 && position + '_result_winning'}
              key={index}
            >
              <img src={item?.image} alt={`icon-${index}`} />
            </div>
          ))}
      </div>
      <div
        className='reel-result-container absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-5xl text-green-700 font-extrabold text-shadow-yellow font-sans opacity-0'
        ref={resultRef}
      >
        ${winningPrice.toFixed(2)}
      </div>
    </>
  );
};

export default BattleCardReel;
