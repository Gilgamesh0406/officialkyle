'use client';

import { useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DepositForm from './DepositForm';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Load your publishable Stripe key
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PropsComponent = {
  slug: string;
};

export default function DepositRealMoneyContent({ slug }: PropsComponent) {
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
                Deposit with {slug.toUpperCase().replace('_', ' ')}
              </div>

              <div className='font-6 text-gray'>
                You will receive diesel automatically after sending clicking
                Deposit button.
              </div>
            </div>
            <div className='bg-light-transparent text-left rounded-1 b-d2 p-4 width-6 responsive currency-panel'>
              <div className='font-8 text-bold mb-2'>
                {slug.toUpperCase().replace('_', ' ')} to Diesel
              </div>
              <Elements stripe={stripePromise}>
                <DepositForm />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
