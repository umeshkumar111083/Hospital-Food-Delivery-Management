import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { meal_id, delivery_personnel_id } = req.body;

  if (!meal_id || !delivery_personnel_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const assignedDelivery = await prisma.deliveries.create({
      data: {
        meal_id,
        delivery_personnel_id,
        delivery_status: "Pending",
      },
    });

    return res.status(200).json(assignedDelivery);
  } catch (error) {
    console.error("Error assigning meal:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}