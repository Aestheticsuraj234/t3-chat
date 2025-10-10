import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";




export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", 
    }),
    socialProviders:{
        github:{
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }
    }
});