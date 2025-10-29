// api/airtable.js
// import 'dotenv/config';
// import './env'
import Airtable from 'airtable';
import base from '@/lib/airtableBase.js';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {startOfWeek, endOfWeek } from '@/lib/getWeekInfo.js';

// Debugging environment variables
// console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY || 'Not Set');
// console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'Not Set');

// Initialize Airtable base
// export const revalidate = 60*60*12; // Revalidate every 12 hours  
export async function GET(req) {
  const userSession = await getServerSession(authOptions);
  // console.log('User session:', userSession);

  let filterFormula = `AND(IS_AFTER({Class Time}, "${startOfWeek.toISOString()}"), IS_BEFORE({Class Time}, "${endOfWeek.toISOString()}"))`;
  // Use subscriptionType from userSession if available
  const subscriptionTypeId = userSession?.user?.subscriptionType?.[0];
  const classCategory = userSession?.user?.classCategory
  const gender = userSession?.user?.gender

console.log(classCategory,'class category',gender,"Gender")
  // Map your subscriptionType IDs to category
  // const kidsSubscriptionIds = ['recrCAxtf8uzMPXgU']; // Add all Kids subscription IDs here
  // const adultSubscriptionIds = ['recsnVL6w3dnG5nP9', 'rec1qEpy3ruJzF1SK']; // Add all Adult subscription IDs here
  if(classCategory && gender){
    console.log('adding filter for category and gender')
    filterFormula = `AND(${filterFormula}, AND({Class Category} = '${classCategory}',{Gender} = '${gender}'))`;
  }
  // if (subscriptionTypeId) {
  //   if (kidsSubscriptionIds.includes(subscriptionTypeId)) {
  //     filterFormula = `AND(${filterFormula}, {Class Category} = '${classCategory}')`;
  //   } else if (adultSubscriptionIds.includes(subscriptionTypeId)) {
  //     filterFormula = `AND(${filterFormula}, {Class Category} = '${classCategory}')`;
  //   }
  //   // If not in either, do not add category filter
  // }

  // class Category: Mixed_adults Gender: Male 
  // they have access to Mixed Adults or Male adults classes


  try {
    // Fetch records from Airtable
    const records = await base('tblCLBGeluENWFA24')
      .select({ maxRecords: 100, view: 'Grid view' , filterByFormula: filterFormula })
      .firstPage();

    const data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
    console.log('Fetched data:', data.length);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Airtable error while getting classes:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from Airtable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
