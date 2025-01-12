import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const pantryStaff = await prisma.pantry_staff.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        location: true,
      },
    });

    return res.status(200).json({ pantryStaff });
  } catch (error) {
    console.error("Error fetching pantry staff:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}