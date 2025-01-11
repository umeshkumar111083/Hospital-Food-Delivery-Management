import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const dietCharts = await prisma.diet_charts.findMany();
    return res.json(dietCharts);
  }
  res.status(405).json({ error: "Method Not Allowed" });
}