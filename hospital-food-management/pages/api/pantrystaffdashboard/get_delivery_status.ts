import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { meal_id } = req.query;
    
    // ✅ Ensure `meal_id` is present
    if (!meal_id || isNaN(Number(meal_id))) {
      return res.status(400).json({ error: "Meal ID is required and must be a number" });
    }

    // ✅ Find the delivery record
    const delivery = await prisma.deliveries.findFirst({
      where: { meal_id: Number(meal_id) },
      include: {
        delivery_personnel: {
          select: { name: true, id: true, phone: true },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: "No delivery record found for this meal" });
    }

    return res.status(200).json({
      deliveryStatus: delivery.delivery_status,
      deliveryPersonnelName: delivery.delivery_personnel?.name || null,
      deliveryPersonnelId: delivery.delivery_personnel_id || null,
      deliveryPersonnelPhone: delivery.delivery_personnel?.phone || null,
      deliveredAt: delivery.delivered_at || null,
      deliveryNotes: delivery.delivery_notes || null,
    });
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}