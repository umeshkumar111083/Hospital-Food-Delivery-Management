import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, phone, userId } = req.body;

  if (!name || !phone || !userId) {
    return res.status(400).json({ error: "Name, phone, and user ID are required" });
  }

  try {
    const existingPersonnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: userId },
    });

    if (existingPersonnel) {
      return res.status(400).json({ error: "Delivery personnel details already exist" });
    }

    await prisma.delivery_personnel.create({
      data: {
        name,
        phone,
        user_id: userId,
      },
    });

    res.status(201).json({ message: "Details saved successfully" });
  } catch (error) {
    console.error("Error saving delivery personnel details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}