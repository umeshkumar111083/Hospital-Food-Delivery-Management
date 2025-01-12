import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || "default_secret"; // Secure this in production

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  try {
    // ✅ Fetch user by email
    const user = await prisma.users.findUnique({ where: { email } });
  
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  
    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );
  
    // ✅ Set JWT in HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      serialize("id_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      })
    );
  
    res.status(200).json({ message: "Login successful", token });
  } catch {
    // Removed 'error' since it is not used
    res.status(500).json({ error: "Internal Server Error" });
  }
}