import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
      <h1>Panel administratora</h1>

      <ul>
        <li>
          <Link to="/admin/orders">Zamówienia</Link>
        </li>
        <li>
          <Link to="/admin/reviews">Opinie</Link>
        </li>
      </ul>
    </div>
  );
}
