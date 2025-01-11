import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // ✅ Fetch the delivery personnel entry linked to this user
    const deliveryPersonnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: Number(userId) },
      select: { id: true },
    });

    if (!deliveryPersonnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    return res.status(200).json(deliveryPersonnel);
  } catch (error) {
    console.error("Error fetching delivery personnel ID:", error);
    return res.status(500).json({ error: "Failed to fetch delivery personnel ID" });
  }
}