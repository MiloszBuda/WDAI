export interface CartItem {
  id: number;
  price: number;
  quantity: number;
  productId: number;
  product: {
    title: string;
    image?: string;
  };
}
