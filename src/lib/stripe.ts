import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY!

export const STRIPE_PRICE_IDS = {
    premium:  "price_1SieMODuDFAFM6tL2GVbxDp5",
    pro:     "price_1SieMuDuDFAFM6tLRBnqSs8p",
} as const 

export type StripePriceId = keyof typeof STRIPE_PRICE_IDS

