export const checkoutService = {
  checkout: async (items: any[]) => {
    const res = await fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) throw new Error("Checkout failed");

    return res.json();
  },
};
