import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { meal_id, status } = req.body;

    if (!meal_id || !status) {
      return res.status(400).json({ error: "Meal ID and status are required" });
    }

    // Ensure the new status is valid
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Update the meal status
    const updatedMeal = await prisma.meals.update({
      where: { id: Number(meal_id) },
      data: { preparation_status: status },
    });

    return res.status(200).json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}