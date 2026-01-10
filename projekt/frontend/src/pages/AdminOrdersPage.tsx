import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types/Order";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    setOrders((orders) =>
      orders.map((o) =>
        o.id === id ? { ...o, status: status as OrderStatus } : o
      )
    );
  };

  return (
    <div>
      <h1>Admin – Zamówienia</h1>

      {orders.map((o) => (
        <div key={o.id}>
          <p>{o.id}</p>

          <select
            value={o.status}
            onChange={(e) => updateStatus(o.id, e.target.value)}
          >
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
