export interface Review {
  id: string;
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    username: string;
  };
  product?: {
    id: number;
    title: string;
  };
}
