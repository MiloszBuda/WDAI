import type { Order } from "../types/Order";
import type { CartItem } from "../types/Cart";

let orders: Order[] = (() => {
  const stored = localStorage.getItem("orders");
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Order[];
  } catch {
    return [];
  }
})();

export const ordersService = {
  async createOrder(
    userId: string,
    items: CartItem[],
    totalAmount: number
  ): Promise<Order> {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      userId,
      date: new Date().toISOString(),
      items,
      totalAmount,
      status: "pending",
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    return newOrder;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return orders.filter((order) => order.userId === userId);
  },
};
