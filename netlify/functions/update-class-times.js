const Airtable = require('airtable');
const { utcToZonedTime, formatInTimeZone } = require('date-fns-tz');
const { addDays } = require('date-fns');

exports.handler = async function(event, context) {
  // Airtable setup
  console.log('starting function');
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  try {
    // Fetch all classes
    const records = await base('tblCLBGeluENWFA24').select({ maxRecords: 100 }).firstPage();

    const TZ = 'America/New_York';

    // Prepare updates: move each class 7 days forward based on 'Class Time NY'
    const updates = records
      .map(record => {
        const raw = record.fields['Class Time NY'];
        if (!raw) return null;

        // Parse stored NY timestamp
        const nyDate = new Date(raw);

        // Add 7 days in NY time
        const nextNyDate = addDays(nyDate, 7);

        // Format the EST string for 'Class Time NY'
        const nextClassTimeNY = formatInTimeZone(nextNyDate, TZ, "yyyy-MM-dd HH:mm 'ET'");

        return {
          id: record.id,
          fields: {
            'Class Time NY': nextClassTimeNY // Updated NY time representation
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