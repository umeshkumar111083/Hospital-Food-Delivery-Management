import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || "default_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded: any = verify(token, SECRET);
    const user = await prisma.users.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const detailsFilled = !!(await prisma.delivery_personnel.findUnique({
      where: { user_id: user.id },
    }));

    res.status(200).json({ ...user, detailsFilled });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}