import type { Review } from "../types/Review";

let reviews: Review[] = (() => {
  const stored = localStorage.getItem("reviews");
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Review[];
  } catch {
    return [];
  }
})();

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
    localStorage.setItem("reviews", JSON.stringify(reviews));
    return newReview;
  },
};
