import type { Order } from "../types/Order";

export const orderService = {
  getMy: async (): Promise<Order[]> => {
    const res = await fetch("http://localhost:3000/orders/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  getDetails: async (id: string) => {
    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },
};
