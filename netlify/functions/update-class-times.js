const Airtable = require('airtable');
const fetch = require('node-fetch'); // npm i node-fetch@2

exports.handler = async function (event, context) {
  console.log('update-class-times triggered');

  // OPTIONAL: simple secret protection — set SCHEDULE_SECRET in Netlify env
  const secret = process.env.SCHEDULE_SECRET;
  if (secret && (event.headers || {})['x-schedule-secret'] !== secret) {
    console.warn('Unauthorized call to scheduled function');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

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

    // const updates = records
    //   .map((record) => {
    //     const raw = record.fields['Class Time'];
    //     if (!raw) return null;

    //     const currentValue = Array.isArray(raw) ? raw[0] : raw;
    //     const parsed = new Date(currentValue);
    //     if (Number.isNaN(parsed.getTime())) {
    //       console.warn(`Skipping record ${record.id} - invalid date:`, currentValue);
    //       return null;
    //     }

    //     const nextWeek = new Date(parsed.getTime());
    //     nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);

    //     return {
    //       id: record.id,
    //       fields: { 'Class Time': nextWeek.toISOString() },
    //     };
    //   })
    //   .filter(Boolean);

    // if (updates.length === 0) {
    //   console.log('No valid updates prepared.');
    //   return {
    //     statusCode: 200,
    //     body: JSON.stringify({ updated: 0, message: 'No valid class times to update' }),
    //     headers: { 'Content-Type': 'application/json' },
    //   };
    // }

    // let totalUpdated = 0;
    // for (let i = 0; i < updates.length; i += 10) {
    //   const batch = updates.slice(i, i + 10);
    //   try {
    //     const res = await base('tblCLBGeluENWFA24').update(batch);
    //     totalUpdated += Array.isArray(res) ? res.length : 1;
    //     console.log(`Batch updated ${Array.isArray(res) ? res.length : 1} records`);
    //   } catch (batchErr) {
    //     console.error('Error updating batch:', batchErr);
    //   }
    // }

    // Successful response
    const response = {
      statusCode: 200,
      // body: JSON.stringify({ updated: totalUpdated }),
      headers: { 'Content-Type': 'application/json' },
    };

    // OPTIONAL SELF-INVOKE: re-trigger the same function once (guarded)
    // To enable, set SELF_INVOKE=true and SITE_URL (https://yoursite.netlify.app) in Netlify env.
    // The function will only self-invoke once per original call (prevents infinite loop).
    // try {
    //   const selfInvokeEnabled = process.env.SELF_INVOKE === 'true';
    //   if (selfInvokeEnabled) {
    //     const currentCount = parseInt((event.headers || {})['x-self-call'] || '0', 10);
    //     const MAX_SELF_CALLS = 1; // allow at most one extra chained call
    //     if (currentCount < MAX_SELF_CALLS) {
    //       const site = process.env.SITE_URL;
    //       if (!site) {
    //         console.warn('SELF_INVOKE enabled but SITE_URL not set; skipping self-invoke');
    //       } else {
    //         const invokeUrl = `${site.replace(/\/$/, '')}/.netlify/functions/update-class-times`;
    //         console.log('Attempting self-invoke to', invokeUrl);
    //         // send secret and increment count to avoid loops
    //         fetch(invokeUrl, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //             'x-schedule-secret': secret || '',
    //             'x-self-call': String(currentCount + 1),
    //           },
    //           body: JSON.stringify({ triggeredBy: 'self-invoke' }),
    //           // short timeout not supported directly in node-fetch v2 without AbortController; keep simple
    //         })
    //           .then((r) => console.log('self-invoke status', r.status))
    //           .catch((err) => console.error('self-invoke failed', err));
    //       }
    //     } else {
    //       console.log('Max self-invoke count reached; not invoking again.');
    //     }
    //   }
    // } catch (e) {
    //   console.error('Error during optional self-invoke logic', e);
    // }

    return response;
  } catch (error) {
    console.error('update-class-times error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error.message || error) }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};