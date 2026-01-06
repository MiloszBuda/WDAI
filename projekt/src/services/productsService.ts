import products from "../data/products.json";
import type { Product } from "../types/Product";

export const productsService = {
  async getAll(): Promise<Product[]> {
    return products as Product[];
  },

  async getById(id: number): Promise<Product | undefined> {
    return (products as Product[]).find((product) => product.id === id);
  },
};
