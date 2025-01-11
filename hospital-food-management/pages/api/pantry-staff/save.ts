import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, phone, location, userId } = req.body;

  if (!name || !phone || !location || !userId) {
    return res.status(400).json({ error: "Name, phone, location, and user ID are required" });
  }

  try {
    const existingPantryStaff = await prisma.pantry_staff.findUnique({
      where: { user_id: userId },
    });

    if (existingPantryStaff) {
      return res.status(400).json({ error: "Pantry staff details already exist" });
    }

    await prisma.pantry_staff.create({
      data: {
        name,
        phone,
        location,
        user_id: userId,
      },
    });

    res.status(201).json({ message: "Details saved successfully" });
  } catch (error) {
    console.error("Error saving pantry staff details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}