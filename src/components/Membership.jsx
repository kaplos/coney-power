'use client';

import { Check, Star } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
const Membership = () => {
  const plans = [
    {
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Access to gym equipment',
        '2 group classes per week',
        'Locker room access',
        'Basic fitness assessment',
      ],
      popular: false,
    },
    {
      name: 'Standard',
      price: 49,
      period: 'month',
      description: 'Most popular choice',
      features: [
        'Everything in Basic',
        'Unlimited group classes',
        'Personal trainer consultation',
        'Nutrition guidance',
        'Guest passes (2 per month)',
      ],
      popular: true,
    },
    {
      name: 'Unlimited',
      price: 79,
      period: 'month',
      description: 'Complete fitness experience',
      features: [
        'Everything in Standard',
        'Unlimited personal training',
        '24/7 gym access',
        'Premium amenities',
        'Meal planning service',
        'Recovery & spa services',
      ],
      popular: false,
    },
  ];
  
const handleCheckout = async () => {
  const res = await fetch(`/api/checkout?item=${item}`, {
    method: 'POST',
  });
  const data = await res.json();
  console.log(data)
  window.location.href = data.url; // redirect to Stripe Checkout
};

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Membership Plans
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Simple pricing, powerful results. Choose the plan that fits your fitness goals.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={16} fill="currentColor" />
                    Most Popular
                  </div>
                </div>
              )}
              <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{plan.description}</p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check size={20} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <CheckoutButton item={plan.name} popular={plan.popular}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
