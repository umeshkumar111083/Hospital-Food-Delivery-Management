import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing user ID" });

    const personnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: Number(id) }, // Fetching delivery_personnel_id based on user_id
      select: { id: true },
    });

    if (!personnel) return res.status(404).json({ error: "Delivery personnel not found" });

    res.status(200).json(personnel);
  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    res.status(500).json({ error: "Failed to fetch delivery personnel" });
  }
}