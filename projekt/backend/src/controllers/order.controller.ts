import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated." });

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Empty order." });

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item: any) => item.productId) } },
    });

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found. ` });
      }
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order." });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user?.id;

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

export const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

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
  const userId = req.user?.id;

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
