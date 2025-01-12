import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const mealsPerDay = await prisma.deliveries.groupBy({
      by: ["delivered_at"],
      _count: { id: true }, // Count number of meals delivered
      where: {
        delivery_status: "Delivered", // Filter only delivered meals
        delivered_at: { not: null },
      },
      orderBy: {
        delivered_at: "desc",
      },
    });

    return res.status(200).json(mealsPerDay);
  } catch (error) {
    console.error("Error fetching meal analytics:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}