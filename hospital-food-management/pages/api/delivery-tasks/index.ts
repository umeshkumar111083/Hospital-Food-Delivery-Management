import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Assume `deliveryPersonnelId` is passed via query params
      const { deliveryPersonnelId } = req.query;

      if (!deliveryPersonnelId) {
        return res.status(400).json({ error: "Missing deliveryPersonnelId" });
      }

      // Fetch assigned meal boxes
      const tasks = await prisma.deliveries.findMany({
        where: { delivery_personnel_id: Number(deliveryPersonnelId) },
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

      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        status: task.delivery_status,
        notes: task.delivery_notes || "No notes provided",
        patientName: task.meals?.diet_charts?.patients?.name || "Unknown",
        roomNumber: task.meals?.diet_charts?.patients?.room_number || "N/A",
        bedNumber: task.meals?.diet_charts?.patients?.bed_number || "N/A",
        dietChart: task.meals?.diet_charts?.meal_time || "Not specified",
      }));

      res.status(200).json(formattedTasks);
    } catch (error) {
      console.error("Error fetching delivery tasks:", error);
      res.status(500).json({ error: "Failed to fetch delivery tasks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}