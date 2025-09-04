'use client';
import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
const Membership = () => {
  const [classType, setClassType] = useState('mens');
  const plans = {
    ladies: [
    // {
    //   name: 'Basic',
    //   price: 29,
    //   period: 'month',
    //   description: 'Perfect for getting started',
    //   features: [
    //     'Access to gym equipment',
    //     '2 group classes per week',
    //     'Locker room access',
    //     'Basic fitness assessment',
    //   ],
    //   popular: false,
    // },
   
    {
      name: 'Standard',
      price: 150,
      period: 'month',
      description: 'Budget friendly option',
      features: [
        'Limited to 6 Classes Per Month'
      ],
      popular: false,
    },
    {
      name: 'Unlimited',
      price: 200,
      period: 'month',
      description: 'Complete fitness experience',
      features: [
        'Unlimited access to classes'
      ],
      popular: true,
    },
     {
      name: 'Single Class',
      price: 45 ,
      period: 'One-time',
      description: 'Perfect for getting started',
      features: [
        'Access to one class',
      ],
      popular: false,
    }  ],
    mens: [
    // {
    //   name: 'Basic',
    //   price: 29,
    //   period: 'month',
    //   description: 'Perfect for getting started',
    //   features: [
    //     'Access to gym equipment',
    //     '2 group classes per week',
    //     'Locker room access',
    //     'Basic fitness assessment',
    //   ],
    //   popular: false,
    // },
   
    {
      name: 'Standard',
      price: 150,
      period: 'month',
      description: 'Budget friendly option',
      features: [
        'Limited to 6 Classes Per Month'
      ],
      popular: false,
    },
    {
      name: 'Unlimited',
      price: 200,
      period: 'month',
      description: 'Complete fitness experience',
      features: [
        'Unlimited access to classes'
      ],
      popular: true,
    },
     {
      name: 'Single Class',
      price: 45 ,
      period: 'One-time',
      description: 'Perfect for getting started',
      features: [
        'Access to one class',
      ],
      popular: false,
    }  ]
    ,
    '13-17': [
      {
      name: 'Unlimited',
      price: 180,
      period: 'month',
      description: 'Complete fitness experience',
      features: [
        'Unlimited access to kids classes'
      ],
      popular: true,
    },
      {
      name: 'Single Kids Class',
      price: 30,
      period: 'One-time',
      description: 'Single kid class',
      features: [
        'Access to one kid class'
      ],
      popular: false
    },
    ],
    '6-12': [
      {
      name: 'Unlimited',
      price: 180,
      period: 'month',
      description: 'Complete fitness experience',
      features: [
        'Unlimited access to kids classes'
      ],
      popular: true,
    },
      {
      name: 'Single Kids Class',
      price: 30,
      period: 'One-time',
      description: 'Single kid class',
      features: [
        'Access to one kid class'
      ],
      popular: false
    },
    ]
  }

  
 
  
// const handleCheckout = async () => {
//   const res = await fetch(`/api/checkout?item=${item}&metaData=${}`, {
//     method: 'POST',
//   });
//   const data = await res.json();
//   console.log(data)
//   window.location.href = data.url; // redirect to Stripe Checkout
// };

  return (
    <section className="bg-black" id='membership'>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-red-700">
            Membership Plans
          </h2>
          <p className="mb-5 font-light text-white sm:text-xl ">
            Simple pricing, powerful results. Choose the plan that fits your fitness goals.
          </p>
        </div>
        <div className="flex justify-center mb-8">
  <div className="inline-flex rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
    <button
      className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
        classType === 'mens'
          ? 'bg-[#C5A572] text-white'
          : 'bg-black text-white'
      }`}
      onClick={() => setClassType('mens')}
      type="button"
    >
      Men
    </button>
    <button
      className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
        classType === 'ladies'
          ? 'bg-[#C5A572] text-white'
          : 'bg-black text-white'
      }`}
      onClick={() => setClassType('ladies')}
      type="button"
    >
      Ladies
    </button>
    <button
      className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
        classType === '6-12'
          ? 'bg-[#C5A572] text-white'
          : 'bg-black text-white'
      }`}
      onClick={() => setClassType('6-12')}
      type="button"
    >
      Kids (6-12)
    </button>
    <button
      className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
        classType === '13-17'
          ? 'bg-[#C5A572] text-white'
          : 'bg-black text-white'
      }`}
      onClick={() => setClassType('13-17')}
      type="button"
    >
      Teens (13-17)
    </button>
  </div>
</div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {plans[classType].map((plan) => (
            <div
              key={plan.name}
              className={`bg-black flex flex-col p-6 mx-auto max-w-lg text-center  rounded-lg border border-gray-100 shadow text-white ${
                plan.popular ? 'ring-2 ring-[#C5A572]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={16} fill="currentColor" />
                    Most Popular
                  </div>
                </div>
              )}

              <h3 className="mb-4 text-2xl text-white font-semibold">{plan.name}</h3>
              <p className="font-light text-white sm:text-lg ">{plan.description}</p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold text-white">${plan.price}</span>
                <span className="text-white ">/{plan.period}</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check size={20} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <CheckoutButton item={plan.name} metaData={plan.id||plan.name} popular={plan.popular} type={'membership'}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
