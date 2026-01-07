import type { CartItem } from "./Cart";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
}
