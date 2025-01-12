import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const dietCharts = await prisma.diet_charts.findMany();
    res.status(200).json(dietCharts);
  } catch {
    res.status(500).json({ error: "Error fetching diet charts" });
  }
}