import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const checkout = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { items } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item: any) => item.productId) } },
  });

  let total = 0;

  const orderItems = items.map((item: any) => {
    try {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found`);

      total += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    } catch {
      return res.status(500).json({ message: "Failed to process order." });
    }
  });

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "pending",
      items: {
        create: orderItems,
      },
    },
    include: { items: true },
  });

  res.status(201).json({ order });
};
