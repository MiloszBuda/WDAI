import { useCart } from "../context/CartContext";
import { orderService } from "../services/ordersService";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const order = await orderService.create(
      items.map((item) => ({
        productId: Number(item.productId),
        quantity: item.quantity,
      }))
    );
    clearCart();
    navigate(`/orders/${order.id}`);
  };

  return (
    <div>
      <h1>Checkout</h1>

      {items.map((i) => (
        <p key={i.productId}>
          {i.title} × {i.quantity}
        </p>
      ))}

      <button onClick={handleCheckout}>Zamawiam</button>
    </div>
  );
}
