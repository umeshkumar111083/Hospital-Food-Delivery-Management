import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { delivery_personnel_id } = req.query;

    if (!delivery_personnel_id) {
      return res.status(400).json({ error: "Missing delivery personnel ID" });
    }

    // ✅ Fetch all deliveries assigned to this delivery personnel
    const deliveries = await prisma.deliveries.findMany({
      where: { delivery_personnel_id: Number(delivery_personnel_id) },
      include: {
        meals: {
          include: {
            diet_charts: {
              include: { patients: true },
            },
          },
        },
      },
    });

    // ✅ Format response
    const formattedDeliveries = deliveries.map((delivery) => ({
      id: delivery.id,
      status: delivery.delivery_status,
      notes: delivery.delivery_notes || "No notes provided",
      patientName: delivery.meals?.diet_charts?.patients?.name || "Unknown",
      roomNumber: delivery.meals?.diet_charts?.patients?.room_number || "N/A",
      bedNumber: delivery.meals?.diet_charts?.patients?.bed_number || "N/A",
      dietChart: delivery.meals?.diet_charts?.meal_time || "Not specified",
    }));

    return res.status(200).json(formattedDeliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return res.status(500).json({ error: "Failed to fetch deliveries" });
  }
}