import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Total meals prepared
    const totalMeals = await prisma.meals.count();

    // Meals delivered
    const mealsDelivered = await prisma.deliveries.count({
      where: { delivery_status: "Delivered" },
    });

    // Meals assigned to delivery personnel
    const assignedMeals = await prisma.deliveries.count({
      where: { delivery_personnel_id: { not: null } },
    });

    // Meals pending assignment
    const unassignedMeals = totalMeals - assignedMeals;

    return res.status(200).json({
      totalMeals,
      mealsDelivered,
      assignedMeals,
      unassignedMeals,
    });
  } catch (error) {
    console.error("Error fetching meal analytics:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}