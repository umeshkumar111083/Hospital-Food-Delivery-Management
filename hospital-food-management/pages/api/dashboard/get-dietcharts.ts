import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const dietCharts = await prisma.diet_charts.findMany({
      select: {
        id: true,
        meal_time: true,
        ingredients: true,
        instructions: true,
      },
    });

    return res.status(200).json({ dietCharts });
  } catch (error) {
    console.error("Error fetching diet charts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}