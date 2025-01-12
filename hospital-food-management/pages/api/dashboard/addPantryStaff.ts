import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, phone, location } = req.body;

    // ✅ Validate Required Fields
    if (!name || !phone || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Insert into `pantry_staff` table
    const newPantryStaff = await prisma.pantry_staff.create({
      data: {
        name,
        phone,
        location,
      },
    });

    return res.status(201).json({ message: "Pantry staff added successfully", pantryStaff: newPantryStaff });
  } catch (error) {
    console.error("Error adding pantry staff:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}