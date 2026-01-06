import type { Review } from "../types/Review";

let reviews: Review[] = [];

export const reviewsService = {
  async getByProduct(productId: number): Promise<Review[]> {
    return reviews.filter((review) => review.productId === productId);
  },

  async addReview(review: Omit<Review, "id" | "date">): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    reviews.push(newReview);
    return newReview;
  },
};
