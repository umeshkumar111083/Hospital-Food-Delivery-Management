import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { id, status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing task ID" });
    }

    if (!status) {
      return res.status(400).json({ error: "Missing status value" });
    }

    // ✅ Update delivery status and notes
    const updatedDelivery = await prisma.deliveries.update({
      where: { id: Number(id) },
      data: {
        delivery_status: status,
        delivery_notes: notes || "No additional notes provided",
        delivered_at: status === "Delivered" ? new Date() : null,
      },
    });

    return res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Error updating delivery:", error);
    return res.status(500).json({ error: "Failed to update delivery status" });
  }
}