import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const personnel = await prisma.delivery_personnel.findMany();
      res.status(200).json(personnel);
    } catch (error) {
      console.error("Error fetching delivery personnel:", error);
      res.status(500).json({ error: "Failed to fetch personnel" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, phone, user_id } = req.body;
      if (!name || !phone || !user_id) return res.status(400).json({ error: "Missing fields" });

      const newPersonnel = await prisma.delivery_personnel.create({
        data: { name, phone, user_id },
      });

      res.status(201).json(newPersonnel);
    } catch (error) {
      console.error("Error adding delivery personnel:", error);
      res.status(500).json({ error: "Failed to add personnel" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}