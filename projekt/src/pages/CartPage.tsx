import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div>
        <h2>Twój koszyk jest pusty</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Twój koszyk</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            <img
              src={item.image}
              alt={item.title}
              width={80}
              style={{ display: "block" }}
            />

            <strong>{item.title}</strong>
            <p>Cena: {item.price} zł</p>

            <label>
              Ilość:
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) =>
                  updateQuantity(item.productId, Number(e.target.value))
                }
              />
            </label>

            <p>Suma: {item.price * item.quantity} zł</p>

            <button onClick={() => removeItem(item.productId)}>Usuń</button>
          </li>
        ))}
      </ul>

      <hr />
      <h2>Razem: {totalPrice} zł</h2>
      <button onClick={clearCart}>Wyczyść koszyk</button>
    </div>
  );
}
