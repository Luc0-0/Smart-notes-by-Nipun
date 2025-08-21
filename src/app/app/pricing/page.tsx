
'use client';

import { useState }p from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth-provider';
import { createCheckoutSession, goToCustomerPortal } from '@/lib/stripe';
import { useSubscription } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    description: 'For individuals starting out.',
    features: [
      'Unlimited notes & notebooks',
      'Basic AI features',
      'Web access',
    ],
    cta: 'Current Plan',
    pro: false,
  },
  {
    name: 'Pro',
    price: '$10',
    frequency: '/month',
    description: 'For power users who want more.',
    features: [
      'Everything in Free, plus:',
      'Advanced AI features',
      'AI Note Starters',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    pro: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(false);
  const isPro = subscription?.role === 'pro';

  const handleSubscriptionAction = async () => {
    if (!user) return;
    setLoading(true);
    if (isPro) {
      await goToCustomerPortal();
    } else {
      await createCheckoutSession(user.uid);
    }
    setLoading(false);
  };

  const getButtonText = () => {
    if (subscriptionLoading) return 'Loading...';
    if (isPro) return 'Manage Subscription';
    return 'Upgrade to Pro';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-center">Pricing Plans</h1>
        <p className="text-muted-foreground text-center mt-2">
          Choose the plan that's right for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <Card 
            key={tier.name}
            className={cn(
                "flex flex-col", 
                tier.pro && "border-primary shadow-2xl relative overflow-hidden",
                isPro && tier.pro && "border-green-500",
                !isPro && !tier.pro && "border-green-500"
            )}
          >
            {tier.pro && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3"/> Recommended
              </div>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div>
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.frequency}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {tier.pro ? (
                <Button 
                    className="w-full" 
                    onClick={handleSubscriptionAction} 
                    disabled={loading || subscriptionLoading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
