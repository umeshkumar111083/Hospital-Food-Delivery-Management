import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Fetch pantry tasks with related meal and patient details
      const tasks = await prisma.meals.findMany({
        include: {
          diet_charts: {
            include: {
              patients: true, // Include patient details
            },
          },
        },
      });

      // Transform the response to match the expected format
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        mealId: task.diet_chart_id,
        preparationStatus: task.preparation_status,
        mealDetails: {
          patientName: task.diet_charts?.patients?.name || "Unknown",
          roomNumber: task.diet_charts?.patients?.room_number || 0,
          bedNumber: task.diet_charts?.patients?.bed_number || 0,
          dietChart: task.diet_charts?.meal_time || "Not Specified",
        },
      }));

      res.status(200).json(formattedTasks);
    } catch (error) {
      console.error("Error fetching pantry tasks:", error);
      res.status(500).json({ error: "Failed to fetch pantry tasks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}