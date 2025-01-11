import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { preparationStatus } = req.body;

      // Validate the ID
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      // Update the preparation status in the database
      const updatedTask = await prisma.meals.update({
        where: { id: parseInt(id, 10) },
        data: { preparation_status: preparationStatus },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}