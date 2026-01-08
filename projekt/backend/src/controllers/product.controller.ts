import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products" });
  }
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product" });
  }
}

export async function createProduct(req: Request, res: Response) {
  const { title, price, description, image } = req.body;
  if (!title || !price || !description || !image)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const newProduct = await prisma.product.create({
      data: { title, price, description, image },
    });

    res.status(201).json(newProduct);
  } catch {
    res.status(500).json({ message: "Failed to create product" });
  }
}
