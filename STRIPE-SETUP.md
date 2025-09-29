# 🚀 Stripe Payment Gateway Setup Guide

## Overview
Your payment system is now fully implemented! This guide will help you set up Stripe to start accepting payments for your Pro ($5/month) and Elite ($10/month) plans.

## What's Already Implemented

### ✅ **Complete Payment System**
- **Pricing Page**: `/pricing` with beautiful plan comparison
- **Subscription Management**: Full user dashboard with billing portal
- **Stripe Integration**: Checkout, webhooks, and portal sessions
- **Database Schema**: Users, subscriptions, and payments tracking
- **API Endpoints**: All payment and subscription management APIs

### ✅ **Features Included**
- 7-day free trial for Pro plan
- Automatic subscription management
- Stripe Customer Portal for self-service
- Failed payment handling
- Subscription cancellation and reactivation
- Usage tracking and credit management

## Step-by-Step Stripe Setup

### 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete your business verification
3. Navigate to the Dashboard

### 2. Get Your API Keys
1. In Stripe Dashboard, go to **Developers → API keys**
2. Copy your keys and update `.env.local`:

```bash
# Replace with your actual Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
```

### 3. Create Products and Prices
1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**

#### Create Pro Plan:
- **Name**: AI Prompt Generator Pro
- **Description**: For serious creators and professionals
- **Pricing**: $5.00 USD, Recurring monthly
- **Trial period**: 7 days
- Copy the **Price ID** (starts with `price_`)

#### Create Elite Plan:
- **Name**: AI Prompt Generator Elite  
- **Description**: For teams and power users
- **Pricing**: $10.00 USD, Recurring monthly
- Copy the **Price ID** (starts with `price_`)

### 4. Update Price IDs
Update `.env.local` with your actual price IDs:

```bash
STRIPE_PRO_PRICE_ID=price_1234567890abcdef
STRIPE_ELITE_PRICE_ID=price_0987654321fedcba
```

### 5. Set Up Webhooks
1. Go to **Developers → Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/payments/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Copy the **Webhook signing secret** and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 6. Configure Customer Portal
1. Go to **Settings → Billing → Customer portal**
2. Enable the portal and configure:
   - ✅ Update payment methods
   - ✅ Update billing information
   - ✅ View invoice history
   - ✅ Cancel subscriptions
   - ✅ Switch between plans

## Testing Your Setup

### 1. Test Mode
Use Stripe's test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002760003184`

### 2. Test Flow
1. Visit `/pricing` 
2. Click "Start Pro Trial"
3. Complete checkout with test card
4. Verify user gets Pro features
5. Test subscription management in dashboard

### 3. Webhook Testing
1. Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/payments/webhook`
2. Trigger events and verify webhook handling

## Production Deployment

### 1. Update Environment Variables
In your production environment (Vercel, etc.), add:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key  
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
STRIPE_PRO_PRICE_ID=price_live_pro_plan
STRIPE_ELITE_PRICE_ID=price_live_elite_plan
```

### 2. Update Webhook URL
Update your webhook endpoint to production URL:
`https://your-production-domain.com/api/payments/webhook`

### 3. Go Live
1. Complete Stripe account verification
2. Switch to live mode in Stripe Dashboard
3. Create live products and prices
4. Update environment variables

## Features Available

### For Users
- **Free Plan**: 70 credits/month
- **Pro Plan**: Unlimited generations, premium features, 7-day trial
- **Elite Plan**: Everything + API access, team features
- **Self-Service Portal**: Cancel, upgrade, update billing
- **Trial Management**: Automatic conversion after trial

### For You (Admin)
- **Revenue Tracking**: All payments logged in database
- **Subscription Analytics**: User plan distribution
- **Failed Payment Alerts**: Automatic downgrade handling
- **Customer Support**: Stripe Customer Portal reduces support tickets

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Pricing Page | ✅ Ready | Beautiful responsive design |
| Stripe Integration | ✅ Ready | Complete payment flow |
| Webhook Handler | ✅ Ready | All subscription events |
| User Dashboard | ✅ Ready | Subscription management |
| Database Schema | ✅ Ready | Tracks all payment data |
| API Endpoints | ✅ Ready | Full payment API |

## Support & Troubleshooting

### Common Issues
1. **Webhook 401 Error**: Check `STRIPE_WEBHOOK_SECRET`
2. **Checkout 500 Error**: Verify `STRIPE_SECRET_KEY` and price IDs
3. **Portal Not Loading**: Check customer has `stripeCustomerId`

### Testing Checklist
- [ ] Stripe keys configured
- [ ] Price IDs created and set
- [ ] Webhook endpoint configured  
- [ ] Test checkout flow works
- [ ] Subscription updates correctly
- [ ] Portal access works
- [ ] Trial period functions
- [ ] Failed payment handling

Your payment system is production-ready! Just add your Stripe keys and start accepting payments. 🎉