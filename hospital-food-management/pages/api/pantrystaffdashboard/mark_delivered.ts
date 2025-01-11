import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { delivery_id, notes } = req.body;

  if (!delivery_id) {
    return res.status(400).json({ message: "Missing delivery ID" });
  }

  try {
    const updatedDelivery = await prisma.deliveries.update({
      where: { id: delivery_id },
      data: {
        delivery_status: "Delivered",
        delivery_notes: notes || "No additional notes provided",
        delivered_at: new Date(),
      },
    });

    return res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Error marking delivery as done:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}