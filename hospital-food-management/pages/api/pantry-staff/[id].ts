import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (!id) {
        return res.status(400).json({ error: "Missing pantry staff ID" });
      }

      const pantryStaff = await prisma.pantry_staff.findUnique({
        where: { id: Number(id) },
      });

      if (!pantryStaff) {
        return res.status(404).json({ error: "Pantry staff not found" });
      }

      res.status(200).json(pantryStaff);
    } catch (error) {
      console.error("Error fetching pantry staff details:", error);
      res.status(500).json({ error: "Failed to fetch pantry staff details" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}