export const orderService = {
  create: async (items: { productId: number; quantity: number }[]) => {
    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) throw new Error("Order failed");
    return res.json();
  },

  getMy: async () => {
    const res = await fetch("http://localhost:3000/orders/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },

  cancel: async (id: string) => {
    await fetch(`http://localhost:3000/orders/${id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
