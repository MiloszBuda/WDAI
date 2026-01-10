import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return <h2>Twój koszyk jest pusty</h2>;
  }

  return (
    <div>
      <h2>Twój koszyk</h2>

      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            <strong>{item.product.title}</strong>
            <p>Cena: {item.price} zł</p>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value))
              }
            />

            <button onClick={() => removeItem(item.productId)}>Usuń</button>
          </li>
        ))}
      </ul>

      <h3>Razem: {totalPrice} zł</h3>

      <button onClick={() => navigate("/checkout")}>Przejdź do checkout</button>
    </div>
  );
}
