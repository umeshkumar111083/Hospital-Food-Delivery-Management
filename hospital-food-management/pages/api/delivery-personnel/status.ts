import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const deliveryPersonnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: parseInt(userId as string, 10) },
    });

    res.status(200).json({ detailsFilled: !!deliveryPersonnel });
  } catch (error) {
    console.error("Error fetching delivery personnel status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}