import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const pantryStaff = await prisma.pantry_staff.findMany();
    return res.json(pantryStaff);
  }
  res.status(405).json({ error: "Method Not Allowed" });
}