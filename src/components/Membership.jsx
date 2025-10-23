"use client";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import CheckoutButton from "./CheckoutButton";
const Membership = () => {


    const [classType, setClassType] = useState("Adults");
    const [genderType, setGenderType] = useState("");

    const category = [ "Adults", "Teens", "Kids",'after_School_Program'];
    const genderOptions = ["Male", "Female"];
    const afterClasses = ["AfterSchool#1", "AfterSchool#2", "AfterSchool#3"];
    const displayNames = {
        Mixed_Adults: "Mixed Adults",
        Adults: "Adults",
        Kids: "Kids (6-12)",
        Teens: "Teens (13-17)",
        'AfterSchool#1': 'Ages 7-9',
        'AfterSchool#2': 'Ages 10-12',
        'AfterSchool#3': 'Ages 13-17',
        'after_School_Program': 'After School Program'
        // Add more if you add more categories
    };
    const availabelOptions = [
      'Adults',
      'Teens',
      'Kids',
      "after_School_Program"
    ]

    
    const plans = {
        Adults: [
            {
                price_id:"",
                name: "Unlimited",
                price: 195,
                period: "month",
                description: "Complete fitness experience",
                features: ["Classes 4 days a week"],
                popular: true,
            },

            {
                name: "Standard",
                price: 180,
                period: "month",
                description: "Budget friendly option",
                features: ["Classes 3 days a week"],
                popular: false,
            },
            {
                name: "Basic",
                price: 160,
                period: "month",
                description: "Perfect for getting started",
                features: ["Sundays Only ( 2 back to back sessions )"],
                popular: false,
            },

            {
                name: "Single Class",
                price: 35,
                period: "One-time",
                description: "Perfect for getting started",
                features: ["Access to one class"],
                popular: false,
            },
        ],
        Mixed_Adults: [
            {
                name: "Unlimited",
                price: 195,
                period: "month",
                description: "Complete fitness experience",
                features: ["Classes 4 days a week"],
                popular: true,
            },

            {
                name: "Standard",
                price: 180,
                period: "month",
                description: "Budget friendly option",
                features: ["Classes 3 days a week"],
                popular: false,
            },
            {
                name: "Basic",
                price: 160,
                period: "month",
                description: "Perfect for getting started",
                features: ["Sundays Only ( 2 back to back sessions )"],
                popular: false,
            },

            {
                name: "Single Class",
                price: 35,
                period: "One-time",
                description: "Perfect for getting started",
                features: ["Access to one class"],
                popular: false,
            },
        ],
        Teens: [
            {
                name: "Unlimited",
                price: 195,
                period: "month",
                description: "Complete fitness experience",
                features: ["Classes 4 days a week"],
                popular: true,
            },

            {
                name: "Standard",
                price: 180,
                period: "month",
                description: "Budget friendly option",
                features: ["Classes 3 days a week"],
                popular: false,
            },
            {
                name: "Basic",
                price: 160,
                period: "month",
                description: "Perfect for getting started",
                features: ["Sundays Only ( 2 back to back sessions )"],
                popular: false,
            },

            {
                name: "Single Class",
                price: 35,
                period: "One-time",
                description: "Perfect for getting started",
                features: ["Access to one class"],
                popular: false,
            },
        ],
        Kids: [
            {
                name: "Unlimited",
                price: 195,
                period: "month",
                description: "Complete fitness experience",
                features: ["Classes 4 days a week"],
                popular: true,
            },

            {
                name: "Standard",
                price: 180,
                period: "month",
                description: "Budget friendly option",
                features: ["Classes 3 days a week"],
                popular: false,
            },
            {
                name: "Basic",
                price: 160,
                period: "month",
                description: "Perfect for getting started",
                features: ["Sundays Only ( 2 back to back sessions )"],
                popular: false,
            },

            {
                name: "Single Class",
                price: 35,
                period: "One-time",
                description: "Perfect for getting started",
                features: ["Access to one class"],
                popular: false,
            },
        ],
        after_School_Program: [
            {
                name: "After School Program",
                price: 195,
                period: "month",
                description: "After School Fitness Program",
                features: ["Classes 4 Days a week"],
                popular: false,
            },
        ],
    };

    

    return (
        <section className="bg-black" id="membership">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-red-700">
                        Membership Plans
                    </h2>
                    <p className="mb-5 font-light text-white sm:text-xl ">
                        Simple pricing, powerful results. Choose the plan that
                        fits your fitness goals.
                    </p>
                </div>
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col gap-4 ">
                        <div className="inline-flex rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            {category.map((cat, index) => (
                                <button
                                    key={index}
                                    className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
                                        classType === cat
                                            ? "bg-[#C5a572] text-white"
                                            : "bg-black text-white"
                                    }`}
                                    onClick={() => {  setClassType(cat) ; setGenderType("")}}
                                    type="button"
                                >
                                    {displayNames[cat]}
                                </button>
                            ))}
                        </div>
                        {genderType === "" && (
                            <h3 className="mv-2 text-xl self-center text-red-600 font-semibold">
                                Please Choose an option
                            </h3>
                        )}

                        <div className="self-center  rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            {(classType=== "after_School_Program" ? afterClasses : genderOptions).map((gender, index) => (
                                <button
                                    key={index}
                                    className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
                                        genderType === gender
                                            ? "bg-[#C5a572] text-white"
                                            : "bg-black text-white"
                                    }`}
                                    onClick={() => setGenderType(gender)}
                                    type="button"
                                >
                                    {displayNames[gender]||gender}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-4 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {genderType !== "" &&
                        plans[classType].map((plan) => (
                            <div
                                key={plan.name}
                                className={`bg-black flex flex-col p-6 mx-auto max-w-lg text-center  rounded-lg border border-gray-100 shadow text-white ${
                                    plan.popular ? "ring-2 ring-[#C5a572]" : ""
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                                            <Star
                                                size={16}
                                                fill="currentColor"
                                            />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <h3 className="mb-4 text-2xl text-white font-semibold">
                                    {plan.name}
                                </h3>
                                <p className="font-light text-white sm:text-lg ">
                                    {plan.description}
                                </p>
                                <div className="flex justify-center items-baseline my-8">
                                    <span className="mr-2 text-5xl font-extrabold text-white">
                                        ${plan.price}
                                    </span>
                                    <span className="text-white ">
                                        /{plan.period}
                                    </span>
                                </div>
                                <ul
                                    role="list"
                                    className="mb-8 space-y-4 text-left"
                                >
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center space-x-3"
                                        >
                                            <Check
                                                size={20}
                                                className="text-green-500 dark:text-green-400 flex-shrink-0"
                                            />
                                            <span className="text-white">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <CheckoutButton
                                    item={plan.name}
                                    category={classType}
                                    gender={genderType}
                                    metaData={plan.id || plan.name}
                                    popular={plan.popular}
                                    type={"membership"}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default Membership;
// FIXME Complete 195 , 4 days a week classes
// FIXME Budget, 4 days a week classes

// FIXME possible to change the memebership to have the categories then gender
// FIXME integrate stripe to allow change the membership plans price
// FIXME get emailss if a user signs up for a class.
