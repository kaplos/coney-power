const Airtable = require('airtable');
const { utcToZonedTime, zonedTimeToUtc, formatInTimeZone } = require('date-fns-tz');
const { addDays } = require('date-fns');

exports.handler = async function(event, context) {
  // Airtable setup
  console.log('starting function')
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  try {
    // Fetch all classes
    const records = await base('tblCLBGeluENWFA24').select({ maxRecords: 100 }).firstPage();

    const TZ = 'America/New_York';

    // Prepare updates: move each class 7 days forward and write both UTC field and NY field
    const updates = records
      .map(record => {
        const raw = record.fields['Class Time'];
        if (!raw) return null;

        // parse stored UTC timestamp
        const utcDate = new Date(raw);

        // convert to local NY time, add 7 days in NY (preserve wall-clock)
        const local = utcToZonedTime(utcDate, TZ);
        const nextLocal = addDays(local, 7);

        // convert back to UTC for storage in 'Class Time'
        const nextUtc = zonedTimeToUtc(nextLocal, TZ);

        // formatted NY string for 'Class Time NY' — adjust format as you prefer
        const classTimeNY = formatInTimeZone(nextUtc, TZ, "yyyy-MM-dd HH:mm 'ET'");

        return {
          id: record.id,
          fields: {
            // 'Class Time': nextUtc.toISOString(),   // keeps UTC ISO for your main field
            'Class Time NY': classTimeNY           // human/local representation
          },
        };
      })
      .filter(Boolean);

    // Batch update (Airtable allows up to 10 per request)
    let totalUpdated = 0;
    for (let i = 0; i < updates.length; i += 10) {
      const batch = updates.slice(i, i + 10);
      const res = await base('tblCLBGeluENWFA24').update(batch);
      totalUpdated += Array.isArray(res) ? res.length : 1;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ updated: totalUpdated })
    };
  } catch (error) {
    console.error('update error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
