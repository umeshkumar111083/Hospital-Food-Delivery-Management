import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId parameter" });
  }

  try {
    const personnel = await prisma.delivery_personnel.findUnique({
      where: { user_id: Number(userId) },
    });

    return personnel ? res.status(200).json({ detailsFilled: true }) : res.status(404).json({ detailsFilled: false });
  } catch (error) {
    console.error("Error fetching delivery personnel status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}