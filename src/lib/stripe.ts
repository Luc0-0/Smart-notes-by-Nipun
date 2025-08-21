
'use client';
import { db } from './firebase/config';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe(
    "pk_test_51Pcb3B2M7fGHYiPEgV5lO0A43d07oQe1S2A2F0Z2n3G1b1c3e4F5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5"
);

export const createCheckoutSession = async (uid: string) => {
    const checkoutSessionRef = collection(db, 'customers', uid, 'checkout_sessions');

    const docRef = await addDoc(checkoutSessionRef, {
        price: "price_1Pcb4r2M7fGHYiPEV1a2b3c4", // Pro plan price ID from Stripe
        success_url: window.location.origin + '/app',
        cancel_url: window.location.origin + '/app/pricing',
    });

    onSnapshot(docRef, async (snap) => {
        const { error, sessionId } = snap.data() as { error?: { message: string }; sessionId?: string };
        if (error) {
            alert(`An error occurred: ${error.message}`);
        }
        if (sessionId) {
            const stripe = await stripePromise;
            if (stripe) {
                stripe.redirectToCheckout({ sessionId });
            }
        }
    });
};


export const goToCustomerPortal = async () => {
  const response = await fetch('/api/create-portal-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { url } = await response.json();
  window.location.assign(url);
};
