import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderService } from "../services/ordersService";
import type { Order } from "../types/Order";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getMy().then((orders) => {
        const foundOrder = orders.find((o: Order) => o.id === id);
        setOrder(foundOrder || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <p>Ładowanie zamówienia...</p>;
  if (!order) return <Navigate to="/orders" />;

  return (
    <div>
      <h1>Zamówienie {order.id}</h1>
      <p>
        <strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Suma:</strong> {order.total} zł
      </p>

      <h2>Produkty:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.product.title} - {item.quantity} x {item.price} zł
          </li>
        ))}
      </ul>
      {order.status === "pending" && (
        <button onClick={() => orderService.cancel(order.id)}>
          Anuluj zamówienie
        </button>
      )}
    </div>
  );
}
