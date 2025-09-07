import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import base from '@/lib/airtableBase';

export async function POST(request) {
  const userSession = await getServerSession(authOptions);
  const payload = await request.json();

  if (!userSession) {
    return new Response('Unauthorized', { status: 401 });
  }
  const res = await base('Members').update([{
    "id": userSession.user.id,
    "fields": {
      "Waiver Signed": 'Signed',
      "Waiver Signed Date": payload.signed ? new Date().toISOString() : null
    }
  }]);
  console.log('Airtable update response:', res);

  // Here you would typically handle the payload and update the user's waiver status
  // For example:
  // await updateUserWaiverStatus(userSession.user.id, payload.signed);

  return new Response('Waiver signed', { status: 200 });
}