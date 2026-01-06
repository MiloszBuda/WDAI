import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ordersService } from "../services/ordersService";
import type { Order } from "../types/Order";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    ordersService.getOrdersByUser(user.id).then((orders) => {
      const found = orders.find((o) => o.id === id);
      setOrder(found ?? null);
      setLoading(false);
    });
  }, [user, id]);

  if (loading) return <p>Ładowanie zamówienia...</p>;
  if (!order) return <Navigate to="/orders" />;

  return (
    <div>
      <h1>Szczegóły zamówienia</h1>

      <p>
        <strong>ID:</strong> {order.id}
      </p>
      <p>
        <strong>Data:</strong> {new Date(order.date).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Suma:</strong> {order.totalAmount} zł
      </p>

      <h2>Produkty:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.title} - {item.quantity} x {item.price} zł
          </li>
        ))}
      </ul>
    </div>
  );
}
