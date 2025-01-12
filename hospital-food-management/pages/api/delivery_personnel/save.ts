import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, phone, userId } = req.body; // ❌ Removed location (Not in DB)

  if (!name || !phone || !userId) {
    return res.status(400).json({ error: "Name, phone, and user ID are required" });
  }

  try {
    // ✅ Check if delivery personnel already exists
    const existingPersonnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: Number(userId) },
    });

    if (existingPersonnel) {
      return res.status(400).json({ error: "Delivery personnel details already exist" });
    }

    // ✅ Save delivery personnel details
    const newPersonnel = await prisma.delivery_personnel.create({
      data: {
        name,
        phone,
        user_id: Number(userId),
      },
    });

    return res.status(201).json({ message: "Details saved successfully", personnel: newPersonnel });
  } catch (error) {
    console.error("Error saving delivery personnel details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}