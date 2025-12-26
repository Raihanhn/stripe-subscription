import { promisify } from "util"

import crypto from "crypto"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { db } from "./db"

export async function signUp(email: string, password: string) {
   try {
     const existingUser = await db.user.findUnique({ where: { email } })
     if (existingUser) {
       return { success: false, error: "User already exists" }
     }

        const { salt, hash } = await hashPassword(password)

        const userCount = await db.user.count()

        const role = userCount === 0 ? "admin" : "user"

        const user = await db.user.create({
            data: {
                email,
                password: hash,
                salt,
                role
            }
        })
        return { success: true, user }

   } catch (error) {
     console.error("Sign up error:", error)
     return { success: false, error: "Failed to create user" }
   }
}

const scryptAsync = promisify(crypto.scrypt)
const KEY_LENGTH = 64;

export async function hashPassword(password: string){
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH) as Buffer;
    return {salt, hash: derivedKey.toString("hex")};
}

export type SessionData  = {
    userId?: string
    email?: string
    role?: string
    isLoggedin: boolean
}


export const sessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "auth-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days 
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    
    if (!session.isLoggedin) {
        session.isLoggedin = false
    }
    return session
}