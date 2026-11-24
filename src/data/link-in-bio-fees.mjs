// Link-in-bio fee data for the fee calculator (Step 2).
// VERIFIED 2026-11-24 (USD, monthly billing; prices vary by region and
// change often — re-check on official pricing pages before relying on them):
// - Linktree: Free $0 (cannot sell paid products), Starter $9/mo 9% seller
//   fee, Pro $17/mo 0%, Premium $35/mo 0%. Annual billing: $7/$14/$30.
//   Sources: linktr.ee/s/pricing as read by multiple Nov 2026 checks.
// - Beacons: Free $0 9%, Creator $10/mo 9%, Creator Plus $30/mo 0%,
//   Creator Max $100/mo 0%. Sources: beacons.ai pricing + help center.
// - Stan Store: Creator $29/mo 0%, Creator Pro $99/mo 0%, no free plan,
//   14-day trial. Sources: stan.store pricing + help center.
// Payment processing is a Stripe estimate (2.9% + $0.30/order).
export const VERIFIED_ON = '2026-11-24';

export const STRIPE_ESTIMATE = { pct: 0.029, perOrder: 0.3 };

export const LINK_IN_BIO_FEES = [
  {
    slug: 'linktree',
    name: 'Linktree',
    plans: [
      { name: 'Starter', monthly: 9, feePct: 0.09 },
      { name: 'Pro', monthly: 17, feePct: 0 },
      { name: 'Premium', monthly: 35, feePct: 0 },
    ],
  },
  {
    slug: 'beacons',
    name: 'Beacons',
    plans: [
      { name: 'Free', monthly: 0, feePct: 0.09 },
      { name: 'Creator', monthly: 10, feePct: 0.09 },
      { name: 'Creator Plus', monthly: 30, feePct: 0 },
    ],
  },
  {
    slug: 'stan-store',
    name: 'Stan Store',
    plans: [
      { name: 'Creator', monthly: 29, feePct: 0 },
      { name: 'Creator Pro', monthly: 99, feePct: 0 },
    ],
  },
];
