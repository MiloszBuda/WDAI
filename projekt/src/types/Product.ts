import type { Review } from "./Review";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;

  features: string[];
  stock: number;
  reviews?: Review[];
}
