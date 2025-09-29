'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Settings, Zap, AlertTriangle } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

interface SubscriptionInfo {
  plan: string;
  credits: number;
  subscriptionStatus?: string;
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  hasActiveSubscription: boolean;
  subscription?: {
    id: string;
    planId: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEnd?: string;
  };
}

export function SubscriptionManager() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading('manage');
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'manage' }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to open customer portal:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!subscriptionInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Subscription Error
          </CardTitle>
          <CardDescription>
            Failed to load subscription information. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscriptionInfo.plan);
  const isTrialing = subscriptionInfo.subscription?.status === 'trialing';
  const isPastDue = subscriptionInfo.subscription?.status === 'past_due';
  const willCancel = subscriptionInfo.subscription?.cancelAtPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Current Plan: {currentPlan?.name || 'Unknown'}
            </div>
            {isTrialing && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Trial
              </Badge>
            )}
            {isPastDue && (
              <Badge variant="destructive">
                Payment Failed
              </Badge>
            )}
            {willCancel && (
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                Canceling
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {currentPlan?.description || 'Manage your subscription and billing'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plan Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Price</div>
              <div className="text-2xl font-bold">
                ${currentPlan?.price || 0}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Credits Remaining</div>
              <div className="text-2xl font-bold">
                {subscriptionInfo.credits === 999999 ? '∞' : subscriptionInfo.credits.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          {subscriptionInfo.hasActiveSubscription && subscriptionInfo.subscription && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Billing Information
              </h4>
              <div className="space-y-2 text-sm">
                {isTrialing && subscriptionInfo.subscription.trialEnd && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Trial ends:</span>{' '}
                    {new Date(subscriptionInfo.subscription.trialEnd).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Next billing:</span>{' '}
                  {new Date(subscriptionInfo.subscription.currentPeriodEnd).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>{' '}
                  <span className="capitalize">{subscriptionInfo.subscription.status}</span>
                </div>
                {willCancel && (
                  <div className="text-orange-700 dark:text-orange-400">
                    ⚠️ Your subscription will cancel at the end of the current billing period.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {subscriptionInfo.hasActiveSubscription ? (
              <Button 
                onClick={handleManageSubscription}
                disabled={actionLoading === 'manage'}
                className="flex-1"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {actionLoading === 'manage' ? 'Loading...' : 'Manage Billing'}
              </Button>
            ) : (
              <Button 
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
            
            {subscriptionInfo.plan === 'free' && (
              <Button 
                variant="outline" 
                onClick={handleUpgrade}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                View All Plans
              </Button>
            )}
          </div>

          {/* Help Text */}
          {isPastDue && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200">Payment Required</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Your payment failed. Please update your payment method to continue using premium features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            What's included in your {currentPlan?.name || 'current'} plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {currentPlan?.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}