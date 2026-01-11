export const reviewService = {
  getByProduct: async (productId: number) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews/product/${productId}`
    );
    return res.json();
  },

  canReview: async (productId: number): Promise<boolean> => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews/can-review/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    return data.canReview;
  },

  add: async (data: { productId: number; rating: number; comment: string }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  edit: async (reviewId: string, data: { rating: number; comment: string }) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews/own/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  },

  delete: async (reviewId: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/reviews/own/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
