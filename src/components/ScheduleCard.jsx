"use client";
import { format, parseISO } from "date-fns";
import CheckoutButton from "./CheckoutButton";
export default function ScheduleCard({ classInfo }) {
  // {
  //     'Class Name': 'Spin Class',
  //     'Class Description': 'An intense cycling workout to improve cardiovascular health.',
  //     'Class Time': '2025-07-21T04:00:00.000Z',
  //     Instructor: [ 'recRkZ7HViQsXy220' ],
  //     Capacity: 20,
  //     Bookings: [ 'recfcTllr5Mhw1reH', 'rec9372iRxjlJwzNZ', 'recFBONqYBWW46jVA' ],
  //     'Class Photo': [ [Object] ],
  //     'Available Spots': 19,
  //     'Instructor Email': [ 'johndoe@example0f94.com' ],
  //     'Instructor Specialization': [ 'Yoga' ],
  //     'Booking Count': 3,
  //     'End Time': '2025-07-21T22:49:00.000Z'
  //   },
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          {classInfo["Class Name"]}
        </h3>
        <hr />
        <div className="flex flex-col text-black">
          <span>Start - End</span>
          <span>
            {format(parseISO(classInfo["Class Time"]), "h")} -{" "}
            {format(parseISO(classInfo["End Time"]), "h")}
          </span>
        </div>

        <span className="text-black">Space Left: {classInfo["Available Spots"]}</span>
        <div className="text-sm text-gray-600">
          {classInfo["Class Description"]}
        </div>
        <div className="text-xs text-gray-500">
          {classInfo["Class Instructor"]}
        </div>
        <div>
          <CheckoutButton
            disabled={classInfo["Available Spots"] <= 0}
            item={classInfo["Class Name"]}
            metaData={classInfo.id || classInfo["Class Name"]}
            popular={false}
          />
        </div>
      </div>
    </div>
  );
}
