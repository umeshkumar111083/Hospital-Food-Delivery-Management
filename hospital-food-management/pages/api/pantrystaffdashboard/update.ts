import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { id, status } = req.body;

      if (!id || !status) return res.status(400).json({ error: "Missing meal ID or status" });

      const updatedMeal = await prisma.meals.update({
        where: { id: Number(id) },
        data: { preparation_status: status },
      });

      res.status(200).json(updatedMeal);
    } catch (error) {
      console.error("Error updating meal status:", error);
      res.status(500).json({ error: "Failed to update meal status" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}