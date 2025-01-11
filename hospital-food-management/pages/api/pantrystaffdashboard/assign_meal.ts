import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { meal_id, delivery_personnel_id } = req.body;
      if (!meal_id || !delivery_personnel_id) return res.status(400).json({ error: "Missing fields" });

      const assignedMeal = await prisma.deliveries.create({
        data: { meal_id, delivery_personnel_id, delivery_status: "Pending" },
      });

      res.status(200).json(assignedMeal);
    } catch (error) {
      console.error("Error assigning meal:", error);
      res.status(500).json({ error: "Failed to assign meal" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}