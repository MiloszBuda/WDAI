import type { CartItem } from "./Cart";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}
