export const reviewService = {
  getByProduct: async (productId: number) => {
    const res = await fetch(
      `http://localhost:3000/reviews/product/${productId}`
    );
    return res.json();
  },

  add: async (data: { productId: number; rating: number; comment: string }) => {
    const res = await fetch("http://localhost:3000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};
