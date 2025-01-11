import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.NEXTAUTH_SECRET || "default_secret"; // Secure this in production

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  // ✅ Retrieve the cookie
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // ✅ Decode the JWT
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}