import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { patientId, mealTime, ingredients, instructions } = req.body;

    if (!patientId || !mealTime || !ingredients) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validMealTimes = ["Morning", "Evening", "Night"];
    if (!validMealTimes.includes(mealTime)) {
      return res.status(400).json({ error: "Invalid mealTime. Allowed: Morning, Evening, Night" });
    }

    try {
      const newDietChart = await prisma.diet_charts.create({
        data: { patient_id: patientId, meal_time: mealTime, ingredients, instructions: instructions || "" },
      });

      return res.status(201).json({ message: "Diet Chart Created", dietChart: newDietChart });
    } catch (error) {
      console.error("Error saving diet chart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ✅ Add GET request handling to fetch diet charts
  else if (req.method === "GET") {
    try {
      const dietCharts = await prisma.diet_charts.findMany({
        select: { id: true, meal_time: true, ingredients: true },
      });

      return res.status(200).json({ dietCharts });
    } catch (error) {
      console.error("Error fetching diet charts:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}