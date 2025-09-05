const Airtable = require('airtable')

async function updateTimes(){
    // Airtable setup
      console.log('starting function')
      const base = new Airtable({ apiKey:'pat5zX0sdbWiBK2iW.ef84a5a7db30f479f60769bf79980dd45cd33a590d55db0bd1a5b4e2b345db7e' }).base('appXvlowCAnautAT2');
    
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
}

updateTimes()