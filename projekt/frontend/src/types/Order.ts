export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: number;
  quantity: number;
  price: number;

  product: {
    title: string;
    image: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;

  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: string;
}
