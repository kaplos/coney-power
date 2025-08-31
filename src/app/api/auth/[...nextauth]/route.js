import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import airtable from "@/lib/airtableBase.js";
// You can add more providers like Email, GitHub, etc.
const base = airtable;
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
    try {
      console.log('User signing in:', user);
      const email = user.email;
      // Make sure your table is named exactly "Users"
      console.log('Checking if user exists in Airtable with email:', email);
      const records = await base('Users').select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1,
      }).firstPage();
      console.log('Airtable records found:', records.length);

      if (records.length === 0) {
        const created = await base('Users').create([
          {
            fields: {
              Email: user.email,
              Name: user.name,
            },
          },
        ]);
        console.log('Created user in Airtable:', created);
      
      } else {
        console.log('User already exists in Airtable:', records[0].id);
      }
      return true;
    } catch (err) {
      console.error('Airtable error:', err);
      return false;
    }
  },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };