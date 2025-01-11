import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const pantryStaff = await prisma.pantry_staff.findUnique({
      where: { user_id: parseInt(userId as string, 10) },
    });

    res.status(200).json({ detailsFilled: !!pantryStaff });
  } catch (error) {
    console.error("Error fetching pantry staff status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}