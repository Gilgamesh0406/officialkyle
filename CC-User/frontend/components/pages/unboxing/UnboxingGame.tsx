// @ts-nocheck
import { UnboxingWinningType } from '@/lib/client/types';
import { playSound } from '@/lib/client/utils';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = {
  items: UnboxingWinningType[][];
  moving: boolean;
  setMoving: (b: boolean) => void;
};

function UnboxingGame({ items, moving, setMoving }: Props) {
  const [spinners, setSpinners] = useState<number[]>([]);
  const spinnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const animateSpinner = (
    index: number,
    initialDeg: number,
    finalDeg: number,
    duration: number
  ) => {
    const random = Math.floor(Math.random() * 2);

    gsap
      .timeline()
      .fromTo(
        spinnersRef.current[index],
        {
          x: initialDeg,
        },
        {
          // x: random % 2 === 0 ? finalDeg - 60 : finalDeg + 60,
          x: random % 2 === 0 ? finalDeg - Math.floor(Math.random() * 61) : finalDeg + Math.floor(Math.random() * 61),
          duration: duration - 1,
          ease: 'power4.inOut',
        }
      )
      .to(spinnersRef.current[index], {
        duration: 1,
        x: finalDeg,
        onComplete: () => {
          if (index === items.length - 1) {
            setMoving(false);
          }
        },
      });
  };

  const startUnboxing = () => {
    setSpinners(new Array(items.length).fill(0));
    items.forEach((_, index) => {
      const initialDeg = 0;
      const winningItemIndex = items[index].findIndex(
        (it) => it.id !== undefined
      );
      const unboxingCaseElement = document.querySelector('.unboxing-case');
      const reelItem = document.querySelector('.reel-item');
      const containerWidth = unboxingCaseElement?.clientWidth || 0;
      const itemWidth = reelItem?.clientWidth || 0;

      const finalDeg = -(
        itemWidth * winningItemIndex -
        containerWidth / 2 +
        itemWidth / 2
      );
      const duration = 6 + index * 2;

      animateSpinner(index, initialDeg, finalDeg, duration);
    });
  };

  useEffect(() => {
    if (moving) {
      startUnboxing();
      playSound('unboxing_rolling');
    }
  }, [items, moving]);

  return (
    <div className='flex column gap-1' id='unboxing_case_spinner'>
      {items.map((row, idx) => (
        <div
          className='unboxing-case relative mt-2 transition-5'
          data-index={idx}
          key={idx + '_row'}
        >
          <div
            className='unboxing-spinner group-reel flex'
            ref={(el) => (spinnersRef.current[idx] = el)}
            style={{
              transform: `translate3d(${spinners[idx]}px, 0, 0)`,
              // transition: moving ? 'none' : 'transform 0.1s linear',
            }}
          >
            <div className='unboxing-field flex row'>
              {row.map((item, idx) => (
                <div
                  className='reel-item flex justify-center items-center'
                  key={idx}
                  data-id={item.id}
                >
                  <div className='listing-item flex column'>
                    <div
                      className='listing-slot rounded-0'
                      style={{
                        borderBottom: `solid 3px ${item.color} !important`,
                      }}
                    >
                      <div className='item-chance text-right'>
                        {item.chance.toFixed(2)}%
                      </div>
                      <div className='item-image-content flex items-center justify-center p-2'>
                        <img
                          className='item-image transition-5'
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className='item-name-content text-left'>
                        <div className='item-brand ellipsis'>{item.name}</div>
                      </div>
                      <div className='item-price text-left'>
                        <div className='coins mr-1'></div>
                        {item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='shadow shadow-left'></div>
          <div className='shadow shadow-right'></div>
          <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center'>
            <div className='pointer flex items-center'></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UnboxingGame;
