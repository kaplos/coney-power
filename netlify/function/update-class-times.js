const Airtable = require('airtable');

exports.handler = async function(event, context) {
  // Airtable setup
  console.log('starting function')
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  try {
    // Fetch all classes
    const records = await base('tblCLBGeluENWFA24').select({ maxRecords: 100 }).firstPage();

    // Prepare updates: move each class 7 days forward
    const updates = records.map(record => {
  const currentTime = record.fields['Class Time'];
  if (!currentTime) return null;
  const nextWeek = new Date(currentTime);
  nextWeek.setDate(nextWeek.getDate() + 7); // Adds 7 days
  return {
    id: record.id,
    fields: { 'Class Time': nextWeek.toISOString() }
  };
}).filter(Boolean);

    // Batch update (Airtable allows up to 10 per request)
    for (let i = 0; i < updates.length; i += 10) {
      await base('tblCLBGeluENWFA24').update(updates.slice(i, i + 10));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ updated: updates.length })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};