import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface User {
  email: string;
  name: string;
}

const customSignIn = async (user: User) => {

  try {
    const response = await axios.post(
      'http://localhost:5000/user/o-auth',
      {
        user,
      },
    );

  } catch (error) {
    console.error('Error:', error);
    // Handle the error
  }
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      const user = { name: profile.name, email: profile.email };

      await customSignIn(user);
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
});
