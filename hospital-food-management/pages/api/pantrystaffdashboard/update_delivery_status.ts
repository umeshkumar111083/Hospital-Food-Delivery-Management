import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { meal_id, status } = req.body;

    // ✅ Ensure required fields are provided
    if (!meal_id || !status) {
      return res.status(400).json({ error: "Meal ID and Status are required" });
    }

    // ✅ Check if meal exists
    const mealExists = await prisma.deliveries.findFirst({ where: { meal_id: Number(meal_id) } });
    if (!mealExists) {
      return res.status(404).json({ error: "No delivery record found for this meal" });
    }

    // ✅ Update the delivery status
    await prisma.deliveries.updateMany({
      where: { meal_id: Number(meal_id) },
      data: { delivery_status: status },
    });

    return res.status(200).json({ message: "Delivery status updated successfully", status });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}