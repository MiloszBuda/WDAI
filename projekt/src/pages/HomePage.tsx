import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";
import type { Product } from "../types/Product";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productsService.getAll().then(setProducts);
  }, []);

  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Sklep</h1>
      <input
        placeholder="Szukaj produktów..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filtered.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {/*{product.image && <img src={product.image} alt={product.title} />}*/}
              {product.title} - {product.price} zł
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
