import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ORDER_STATUSES } from "../constants/orderStatus.js";
import { ORDER_TRANSITIONS } from "../constants/orderTransitions.js";

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      items: true,
    },
  });

  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  if (!ORDER_STATUSES.includes(newStatus))
    return res.status(400).json({ message: "Invalid status." });

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).json({ message: "Order not found." });

  const allowedNext =
    ORDER_TRANSITIONS[order.status as keyof typeof ORDER_TRANSITIONS];

  if (!allowedNext.includes(newStatus))
    return res.status(400).json({ message: "Invalid status transition." });

  const updated = await prisma.order.update({
    where: { id },
    data: { status: newStatus },
  });

  res.json(updated);
};
