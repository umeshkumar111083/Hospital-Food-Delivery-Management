import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { pantry_staff_id } = req.query;
      if (!pantry_staff_id) return res.status(400).json({ error: "Missing pantry_staff_id" });

      // ✅ Fetch assigned delivery personnel based on meals and deliveries relation
      const assignments = await prisma.deliveries.findMany({
        where: {
          meals: {
            pantry_staff_id: Number(pantry_staff_id),
          },
          delivery_personnel_id: { not: null }, // ✅ Only fetch assigned deliveries
        },
        include: {
          delivery_personnel: true, // ✅ Fetch delivery personnel details
        },
      });

      const formattedAssignments = assignments.map((delivery) => ({
        mealId: delivery.meal_id,
        deliveryPersonnelName: delivery.delivery_personnel?.name || "Not Assigned",
        deliveryPersonnelId: delivery.delivery_personnel_id || null,
      }));

      res.status(200).json(formattedAssignments);
    } catch (error) {
      console.error("Error fetching assigned delivery personnel:", error);
      res.status(500).json({ error: "Failed to fetch assigned delivery personnel" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}