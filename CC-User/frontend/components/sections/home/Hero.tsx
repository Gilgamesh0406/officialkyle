'use client';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    // Start scrolling every 6 seconds
    const intervalId = setInterval(scrollNext, 6000);

    // Cleanup function to stop scrolling when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [scrollNext]);
  return (
    <div className='flex column justify-center gap-2'>
      <div className='carousel large rounded-1'>
        <div className='carousel-content flex row justify-between items-center'>
          <div
            className='absolute carousel-button flex justify-center items-center'
            data-type='left'
            onClick={scrollPrev}
          >
            <FontAwesomeIcon icon={faAngleLeft} className='w-[16px]' />
          </div>

          <div className='embla w-full h-full' ref={emblaRef}>
            <div className='embla__container flex h-full'>
              <div
                className={`embla__slide flex flex-none items-center px-24 h-full relative w-full max-w-full bg-red-500`}
                data-index={0}
                data-page={`crypto`}
              >
                <div className='overlay left-0 w-full'></div>
                <div className='flex z-40 column gap-6 items-start justify-between text-left'>
                  <div className='flex column items-start gap-2'>
                    <div className='title text-bold font-20 text-blue'>
                      TRUE CRYPTO CASINO
                    </div>
                    <div className='description'>
                      Enjoy <span className='text-blue'>blazing fast</span>{' '}
                      transactions with{' '}
                      <span className='text-blue'>most popular</span>{' '}
                      cryptocurrencies exclusive on Crazycargo.gg
                    </div>
                  </div>

                  <a href='/deposit'>
                    <button className='site-button large blue'>
                      Start Playing
                    </button>
                  </a>
                </div>
              </div>
              <div
                className={`embla__slide flex flex-none items-center px-24 h-full relative w-full max-w-full bg-red-500`}
                data-index={0}
                data-page={`affiliates`}
              >
                <div className='overlay left-0 w-full'></div>
                <div className='flex z-40 column gap-6 items-start justify-between text-left'>
                  <div className='flex column items-start gap-2'>
                    <div className='title text-bold font-20 text-orange'>
                      BIG AFFILIATES REWARDS
                    </div>
                    <div className='description'>
                      We give up to{' '}
                      <span className='text-orange'>0.00% commission</span> of
                      your friends bets and up to{' '}
                      <span className='text-orange'>4.50% commission</span> of
                      your friends deposits!
                    </div>
                  </div>

                  <a href='/deposit'>
                    <button className='site-button large orange'>
                      Start Playing
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className='absolute  right-0 carousel-button flex justify-center items-center'
            data-type='right'
            onClick={scrollNext}
          >
            <FontAwesomeIcon icon={faAngleRight} className='w-[16px]' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
