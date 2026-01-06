import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  return (
    <nav style={{ display: "flex", padding: "1rem", gap: "1rem" }}>
      <Link to="/">Home</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        <Link to="/cart">Koszyk ({items.length})</Link>

        {!isAuthenticated ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <span>Zalogowany jako: {user?.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
