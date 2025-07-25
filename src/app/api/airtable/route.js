// api/airtable.js
// import 'dotenv/config';
// import './env'
import Airtable from 'airtable';

// Debugging environment variables
// console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY || 'Not Set');
// console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'Not Set');

// Initialize Airtable base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export async function GET(req) {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // next Sunday
  
  const filterFormula = `AND(IS_AFTER({Class Time}, "${startOfWeek.toISOString()}"), IS_BEFORE({Class Time}, "${endOfWeek.toISOString()}"))`;
  
  try {
    // Fetch records from Airtable
    const records = await base('tblCLBGeluENWFA24')
      .select({ maxRecords: 100, view: 'Grid view', filterByFormula: filterFormula 
      })
      
      .firstPage();

      // const data = records.map((record) => record.fields);
      const data = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
      console.log('Fetched data:', data);


    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Airtable error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from Airtable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
