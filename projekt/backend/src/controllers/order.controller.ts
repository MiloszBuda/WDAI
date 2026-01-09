import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ORDER_STATUSES } from "../constants/orderStatus.js";
import { ORDER_TRANSITIONS } from "../constants/orderTransitions.js";

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { items } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: "Empty order." });

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item: any) => item.productId) } },
  });

  let total = 0;
  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error("Product not found.");

    total += product.price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: orderItems,
      },
    },
    include: { items: true },
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
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

export const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.userId !== userId)
    return res.status(403).json({ message: "Not your order." });

  if (order.status !== "pending")
    return res.status(400).json({ message: "Cannot cancel this order." });

  const cancelled = await prisma.order.update({
    where: { id },
    data: { status: "cancelled" },
  });

  res.json(cancelled);
};

export const getOrderDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const order = await prisma.order.findUnique({
    where: { id, userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) return res.status(404).json({ message: "Order not found." });

  res.json(order);
};
