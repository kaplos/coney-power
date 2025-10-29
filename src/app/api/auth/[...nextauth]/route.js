import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

import base from "@/lib/airtableBase.js";



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 15 * 60, // How long email links are valid for (default 24h)
  }),
CredentialsProvider({
  name: "Email and Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    try {
      if (!credentials?.email || !credentials?.password) return null;

      const records = await base('Members').select({
        filterByFormula: `{Email} = '${credentials.email}'`,
        maxRecords: 1,
      }).firstPage();
      if (records.length === 0) return null;

      const user = records[0].fields;
      if (!user.HashedPassword) return null;

      const isValid = await bcrypt.compare(credentials.password, user.HashedPassword);
      console.log('Password is valid:', isValid);
      if (!isValid) return null;

      // Ensure id is always a string
      return {
        id: String(user['Member ID'] || user['Email']),
        email: user['Email'],
        name: user['Name'] || '',
      };
    } catch (err) {
      console.error('Authorize error:', err);
      return null;
    }
  }
    }),
    
  ],
  adapter: undefined,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
   async signIn({ user, account, email }) {
    try {
      console.log('signIn callback', account?.provider, user?.email || email);

      // Google provider: create member if not exists, then allow
      if (account?.provider === 'google') {
        const userEmail = user?.email || email;
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${userEmail}'`,
          maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
          await base('Members').create([{
            fields: {
              Email: userEmail,
              Name: user?.name || '',
              ['Membership Type']: "none",
              ['Subscription Status']: ["Not Active"],
            },
          }]);
        }
        return true; // allow sign in
      }

      // Credentials provider uses 'credentials' as provider id
      if (account?.provider === 'credentials') {
        const userEmail = user?.email || email;
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${userEmail}'`,
          maxRecords: 1,
        }).firstPage();
        if (records.length === 0) {
          console.warn('signIn: credentials user not in Members:', userEmail);
          return false;
        }
        return true;
      }

      return true;
    } catch (err) {
      console.error('signIn callback error:', err);
      return false;
    }
  

    },
    async session({ session }) {
      console.log('Session callback for:', session?.user?.email);
      try {
        const email = session.user.email;
        const records = await base('Members').select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        }).firstPage();

        if (records.length > 0) {
          const userFields = records[0].fields;
          // console.log('User fields from Airtable:', userFields);
          // Attach subscription info to the session
          session.user.subscriptionType = userFields['Membership Type'] || null;
          session.user.waiver = userFields['Waiver Signed']==='Signed' || false;
          session.user.subscriptionStatus = userFields['Subscription Status'] || null;
          session.user.adultClassCredit = userFields['AdultClassCredit'] || 0;
          session.user.kidsClassCredit = userFields['KidsClassCredit'] || 0;
          session.user.membershipName = userFields['Name (from Membership Type)'] ? userFields['Name (from Membership Type)'][0] : 'Not Subscribed';
          session.user.id = userFields['Member ID'] || 0;
          session.user.classCategory = userFields['Class Category'];
          session.user.gender = userFields['Gender'];
        }
      } catch (err) {
        console.error('Airtable error (session):', err);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    if (url.startsWith(baseUrl)) return url;
    return baseUrl;
  }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };