import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { pantry_staff_id } = req.query;
      if (!pantry_staff_id) return res.status(400).json({ error: "Missing pantry_staff_id" });

      const tasks = await prisma.meals.findMany({
        where: { pantry_staff_id: Number(pantry_staff_id) },
        include: {
          diet_charts: { include: { patients: true } },
        },
        orderBy: { preparation_status: "asc" },
      });

      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        preparationStatus: task.preparation_status, // ✅ Correctly map the database field
        patientName: task.diet_charts?.patients?.name || "Unknown",
        roomNumber: task.diet_charts?.patients?.room_number || "N/A",
        bedNumber: task.diet_charts?.patients?.bed_number || "N/A",
        dietChart: task.diet_charts?.meal_time || "Not specified",
      }));
      
      res.status(200).json(formattedTasks); // ✅ Send updated key

    } catch (error) {
      console.error("Error fetching meal preparation tasks:", error);
      res.status(500).json({ error: "Failed to fetch meal preparation tasks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}