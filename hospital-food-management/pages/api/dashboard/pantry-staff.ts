import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const pantryStaff = await prisma.pantry_staff.findMany();
    res.status(200).json(pantryStaff);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pantry staff" });
  }
}