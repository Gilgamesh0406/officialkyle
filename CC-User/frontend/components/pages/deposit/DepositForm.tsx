'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';

export default function DepositForm() {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const clientSocket = useSocketIoClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the Payment Intent API route
      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
      });

      if (!res.ok) {
        throw new Error('Failed to create PaymentIntent');
      }

      const { clientSecret } = await res.json();

      if (!stripe || !elements) {
        throw new Error('Stripe.js has not loaded.');
      }

      // Confirm the payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card Element is not loaded.');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        console.error(result.error.message);
        toast.error(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === 'succeeded') {
        const userTransactionRes = await fetch('/api/transactions/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: Cookies.get('userid'), // Replace with actual user ID from your context/session
            service: 'credit_card_deposit',
            amount: amount,
            time: Date.now(),
          }),
        });

        if (userTransactionRes.ok) {

          toast.success('Payment successful and transaction recorded!');

          clientSocket?.sendBalanceRequest();
        } else {
          toast.error('Failed to record the transaction.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while processing the payment.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementStyles = {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#e54242',
      iconColor: '#e54242',
    },
    complete: {
      color: '#00e676',
    },
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
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
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />

              <div className='field_label transition-5 active'>
                <div className='input_coins coins mr-1'></div>Diesel Amount
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
      </label>

      <div
        className='input_field bet_input_field transition-5 p-2'
        data-border='#de4c41'
        style={{
          border: '2px solid var(--site-color-bg-dark)',
          color: 'unset',
        }}
      >
        <div className='field_container'>
          <div className='field_content'>
            <CardElement options={{ style: cardElementStyles }} />
          </div>
        </div>
      </div>
      <button
        type='submit'
        className='site-button purple mt-2'
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Deposit'}
      </button>
    </form>
  );
}
