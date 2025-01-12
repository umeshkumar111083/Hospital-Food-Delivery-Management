import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { pantry_staff_id, diet_chart_id, preparation_status } = req.body;

  // ✅ Validate required fields
  if (!pantry_staff_id || !diet_chart_id || !preparation_status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ✅ Ensure `preparation_status` is valid
  const validStatuses = ["Pending", "In Progress", "Completed"];
  if (!validStatuses.includes(preparation_status)) {
    return res.status(400).json({ error: "Invalid preparation_status value" });
  }

  try {
    // ✅ Check if pantry staff exists
    const staffExists = await prisma.pantry_staff.findUnique({
      where: { id: Number(pantry_staff_id) },
    });

    if (!staffExists) {
      return res.status(404).json({ error: "Pantry staff not found" });
    }

    // ✅ Check if diet chart exists
    const chartExists = await prisma.diet_charts.findUnique({
      where: { id: Number(diet_chart_id) },
    });

    if (!chartExists) {
      return res.status(404).json({ error: "Diet chart not found" });
    }

    // ✅ Assign meal to pantry staff
    const assignedMeal = await prisma.meals.create({
      data: {
        pantry_staff_id: Number(pantry_staff_id),
        diet_chart_id: Number(diet_chart_id),
        preparation_status,
        prepared_at: new Date(),
      },
    });

    return res.status(201).json({ message: "Meal assigned successfully", assignedMeal });
  } catch (error) {
    console.error("Error assigning meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}