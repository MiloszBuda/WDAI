export const productsService = {
  getAll: async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return res.json();
  },
};
