import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Fetch all deliveries with meal, patient, and delivery personnel details
    const deliveries = await prisma.deliveries.findMany({
      include: {
        meals: {
          include: {
            diet_charts: {
              include: { patients: true },
            },
          },
        },
        delivery_personnel: true,
      },
      orderBy: { delivered_at: "desc" },
    });

    // ✅ Format Data
    const formattedDeliveries = deliveries.map((delivery) => ({
      id: delivery.id,
      mealId: delivery.meal_id,
      deliveryStatus: delivery.delivery_status,
      deliveredAt: delivery.delivered_at,
      deliveryNotes: delivery.delivery_notes,
      deliveryPersonnelName: delivery.delivery_personnel?.name || null,
      patientName: delivery.meals?.diet_charts?.patients?.name || "Unknown",
      roomNumber: delivery.meals?.diet_charts?.patients?.room_number || 0,
      bedNumber: delivery.meals?.diet_charts?.patients?.bed_number || 0,
      mealTime: delivery.meals?.diet_charts?.meal_time || "Unknown",
    }));

    return res.status(200).json(formattedDeliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}