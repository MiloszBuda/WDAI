import { useCart } from "../context/CartContext";
import { checkoutService } from "../services/checkoutService";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const order = await checkoutService.checkout(items);
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

      <h3>Suma: {totalPrice} zł</h3>

      <button onClick={handleCheckout}>Zamawiam</button>
    </div>
  );
}
