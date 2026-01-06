import type { Order } from "../types/Order";
import type { CartItem } from "../types/Cart";

let orders: Order[] = [];

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
    return newOrder;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return orders.filter((order) => order.userId === userId);
  },
};
