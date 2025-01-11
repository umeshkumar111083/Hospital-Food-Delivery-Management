import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const completedMeals = await prisma.meals.findMany({
        where: { preparation_status: "Completed" },
        include: {
          diet_charts: { include: { patients: true } },
        },
      });

      const formattedMeals = completedMeals.map((meal) => ({
        id: meal.id,
        patientName: meal.diet_charts?.patients?.name || "Unknown",
        roomNumber: meal.diet_charts?.patients?.room_number || "N/A",
        bedNumber: meal.diet_charts?.patients?.bed_number || "N/A",
        dietChart: meal.diet_charts?.meal_time || "Not specified",
      }));

      res.status(200).json(formattedMeals);
    } catch (error) {
      console.error("Error fetching available meals:", error);
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}