import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { status, notes } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing task ID" });
      }

      // Update the delivery status and notes
      const updatedTask = await prisma.deliveries.update({
        where: { id: Number(id) },
        data: {
          delivery_status: status,
          delivery_notes: notes,
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating delivery task:", error);
      res.status(500).json({ error: "Failed to update delivery task" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}