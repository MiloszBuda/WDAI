import type { CartItem } from "./Cart";

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
}
