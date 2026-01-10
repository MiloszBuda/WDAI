import { useCart } from "../context/CartContext";
import { orderService } from "../services/ordersService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const order = await orderService.create(orderData.items);
      clearCart();
      alert("Zamówienie zostało złożone pomyślnie!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError("Błąd podczas składania zamówienia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        Koszyk jest pusty.
        <button onClick={() => navigate("/")}>Wróć do sklepu</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Podsumowanie zamówienia</h1>

      {items.map((i) => (
        <p key={i.productId}>
          {i.title} × {i.quantity} - {(i.price * i.quantity).toFixed(2)} zł
        </p>
      ))}
      <h3>Do zapłaty: {total.toFixed(2)} zł</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Przetwarzanie..." : "Zamawiam"}
      </button>
    </div>
  );
}
