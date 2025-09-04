"use client";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import CheckoutButton from "./CheckoutButton";
export default function ScheduleCard({ classInfo }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="bg-black shadow rounded-lg p-2 mb-2 flex flex-col gap-1 w-full max-w-[170px] mx-auto sm:max-w-[180px]">
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
        <span>{format(parseISO(classInfo["Class Time"]), "h:mm a")}</span>
        <span>-</span>
        <span>{format(parseISO(classInfo["End Time"]), "h:mm a")}</span>
      </div>
      <button
        className="text-xs text-red-700 underline text-left"
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
        metaData={classInfo.id || classInfo["Class Name"]}
        popular={false}
      />
    </div>
  );
}
