import { useEffect, useState } from "react";
import { orderService } from "../services/ordersService";
import type { Order } from "../types/Order";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await orderService.getMy();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p>Ładowanie zamówień...</p>;
  }

  if (orders.length === 0) {
    return <p>Brak zamówień</p>;
  }

  return (
    <div>
      <h1>Historia zamówień</h1>

      <ul>
        {orders.map((order) => (
          <li key={order.id} style={{ marginBottom: "1rem" }}>
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

            <Link to={`/orders/${order.id}`}>Szczegóły</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
