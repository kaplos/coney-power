"use client";
import { useState,useEffect } from "react";
import { format, parseISO } from "date-fns";
import CheckoutButton from "./CheckoutButton";
import { formatInTimeZone } from "date-fns-tz";

export default function ScheduleCard({ classInfo,bookedClasses,setBookedClasses }) {
  const [showDescription, setShowDescription] = useState(false);
  const isClassBooked = Array.isArray(bookedClasses) && bookedClasses.some((c) => {
    const cid = c?.fields?.['Class ID'];
    const classIdMatch = Array.isArray(cid) ? String(cid[0]) === String(classInfo.id) : false;
    const bookingIdMatch = String(c.id) === String(classInfo.id);
    return classIdMatch || bookingIdMatch;
  });
  
  


  return (
    <div key={classInfo.id} className="bg-black shadow rounded-lg p-2 mb-2 flex flex-col gap-1 w-full max-w-[170px] mx-auto sm:max-w-[180px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#C5A572] truncate">
          {classInfo["Class Name"]}
        </h3>
        <span className="text-xs text-white">
          {classInfo["Available Spots"] > 0
            ? `${classInfo["Available Spots"]} left`
            : "Full"}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-white">
        <span>{formatInTimeZone(
            classInfo["Class Time"],
            'America/New_York',
            "h:mm a"
          )}</span>
        <span>-</span>
        <span>{formatInTimeZone(
            classInfo["End Time"],

            'America/New_York',
            "h:mm a"
          )}</span>
      </div>
      <button
        className="text-xs text-red-700 font-bold underline text-left"
        onClick={() => setShowDescription((v) => !v)}
        type="button"
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </button>
      {showDescription && (
        <div className="text-xs text-gray-300 mt-1">
          {classInfo["Class Description"]}
        </div>
      )}
      {classInfo["Class Instructor"] && (
        <div className="text-xs text-gray-400 italic truncate">
          {classInfo["Class Instructor"]}
        </div>
      )}
      <CheckoutButton
        disabled={classInfo["Available Spots"] <= 0}
        item={classInfo["Class Name"]}
        metaData={classInfo.id}
        isBooked={isClassBooked}
        popular={false}
        onBooked={(classInfo)=> setBookedClasses( [...bookedClasses,classInfo])}
      />
    </div>
  );
}
