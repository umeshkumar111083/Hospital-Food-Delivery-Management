import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { pantry_staff_id, diet_chart_id, preparation_status } = req.body;

  if (!pantry_staff_id || !diet_chart_id || !preparation_status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ Create meal entry in the database
    const assignedMeal = await prisma.meals.create({
      data: {
        pantry_staff_id,
        diet_chart_id,
        preparation_status,
        prepared_at: new Date(),
      },
    });

    return res.status(201).json({ message: "Meal assigned successfully!", assignedMeal });
  } catch (error) {
    console.error("Error assigning meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}