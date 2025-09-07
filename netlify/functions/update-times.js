const Airtable = require('airtable')

async function updateTimes(){
  console.log('update-class-times triggered');
  const base = new Airtable({ apiKey:'pat5zX0sdbWiBK2iW.ef84a5a7db30f479f60769bf79980dd45cd33a590d55db0bd1a5b4e2b345db7e' }).base('appXvlowCAnautAT2');

  try {
    const records = await base('tblCLBGeluENWFA24').select({ maxRecords: 100 }).firstPage();
    if (!records || records.length === 0) {
      console.log('No records found.');
      return {
        statusCode: 200,
        body: JSON.stringify({ updated: 0, message: 'No records' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const updates = records
      .map((record) => {
        const raw = record.fields['Class Time'];
        if (!raw) return null;

        // Airtable date fields might be strings or arrays — handle both
        const currentValue = Array.isArray(raw) ? raw[0] : raw;
        const parsed = new Date(currentValue);
        if (Number.isNaN(parsed.getTime())) {
          console.warn(`Skipping record ${record.id} - invalid date:`, currentValue);
          return null;
        }

        // Use UTC arithmetic to add 7 days (preserves UTC timestamp)
        const nextWeek = new Date(parsed.getTime());
        nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);

        return {
          id: record.id,
          fields: { 'Class Time': nextWeek.toISOString() },
        };
      })
      .filter(Boolean);

    if (updates.length === 0) {
      console.log('No valid updates prepared.');
      return {
        statusCode: 200,
        body: JSON.stringify({ updated: 0, message: 'No valid class times to update' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    let totalUpdated = 0;
    // Airtable batch update limit is 10
    for (let i = 0; i < updates.length; i += 10) {
      const batch = updates.slice(i, i + 10);
      try {
        const res = await base('tblCLBGeluENWFA24').update(batch);
        totalUpdated += Array.isArray(res) ? res.length : 1;
        console.log(`Batch updated ${Array.isArray(res) ? res.length : 1} records`);
      } catch (batchErr) {
        console.error('Error updating batch:', batchErr);
        // continue with next batches
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ updated: totalUpdated }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('update-class-times error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error.message || error) }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

updateTimes()