import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsService } from "../services/productsService";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/Product";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      productsService.getById(Number(id)).then((p) => {
        if (p) setProduct(p);
      });
    }
  }, [id]);

  if (!product) return <p>Ładowanie...</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} width={150} />
      <p>{product.description}</p>
      <p>Cena: {product.price} zł</p>

      <button
        onClick={() =>
          addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          })
        }
      >
        Dodaj do koszyka
      </button>
    </div>
  );
}
