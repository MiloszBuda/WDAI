import type { OrderStatus } from "./orderStatus.js";

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};
