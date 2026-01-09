import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsService } from "../services/productsService";
import { reviewService } from "../services/reviewsService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/Product";
import type { Review } from "../types/Review";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    productsService
      .getById(Number(id))
      .then(setProduct)
      .finally(() => {
        setLoading(false);
      });
    reviewService.getByProduct(Number(id)).then(setReviews);

    if (isAuthenticated) {
      reviewService.canReview(Number(id)).then(setCanReview);
    }
  }, [id, isAuthenticated]);

  if (loading) return <p>Ładowanie...</p>;
  if (!product) return <p>Produkt nie znaleziony</p>;

  const handleAddReview = async () => {
    const review = await reviewService.add({
      productId: product.id,
      rating,
      comment,
    });
    setReviews((r) => [...r, review]);
    setComment("");
    setRating(5);
  };

  const avg =
    reviews.length === 0
      ? 0
      : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Cena: {product.price} zł</p>

      <h3>Opinie ⭐ {avg}</h3>

      {reviews.map((r) => (
        <p key={r.id}>
          {r.rating}/5 – {r.comment}
        </p>
      ))}

      {canReview && (
        <>
          <select value={rating} onChange={(e) => setRating(+e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={handleAddReview}>Dodaj opinię</button>
        </>
      )}

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
