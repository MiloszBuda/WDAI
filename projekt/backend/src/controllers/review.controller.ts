import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId, rating, comment } = req.body;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated." });

    if (rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
        },
      },
    });

    if (!purchased)
      return res
        .status(403)
        .json({ message: "You must purchase the product to review it" });

    const exists = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to add review." });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { username: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avg =
      reviews.length === 0
        ? 0
        : reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length;

    res.json({
      averageRating: Math.round(avg * 10) / 10,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reviews." });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await prisma.review.delete({
      where: { id },
    });

    res.status(204).send({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review." });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { username: true } },
        product: { select: { title: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reviews." });
  }
};

export const editOwnReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) return res.status(404).json({ message: "Review not found." });
    if (review.userId !== userId)
      return res.status(403).json({ message: "Not your review." });

    const updated = await prisma.review.update({
      where: { id },
      data: { rating, comment },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit review." });
  }
};

export const deleteOwnReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) return res.status(404).json({ message: "Review not found." });
    if (review.userId !== userId)
      return res.status(403).json({ message: "Not your review." });

    await prisma.review.delete({ where: { id } });

    res.status(204).send({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review." });
  }
};

export const canReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.id);

    if (!userId) {
      console.log("No userId found in token");
      return res.json({ canReview: false });
    }

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        order: {
          userId: userId,
        },
      },
      include: {
        order: true,
      },
    });

    if (!orderItem) {
      return res.json({ canReview: false });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingReview) {
      return res.json({ canReview: false });
    }

    res.json({ canReview: true });
  } catch (error) {
    res.status(500).json({ message: "Error checking review status." });
  }
};
