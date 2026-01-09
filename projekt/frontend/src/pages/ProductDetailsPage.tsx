import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsService } from "../services/productsService";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/Product";
import { reviewService } from "../services/reviewsService";
import type { Review } from "../types/Review";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [showReviews, setShowReviews] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) {
      productsService.getById(Number(id)).then((p) => {
        if (p) setProduct(p);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!product) return;

    reviewService.getByProduct(product.id).then(setReviews);
  }, [product]);

  if (!product) return <p>Ładowanie...</p>;

  const handleAddReview = async () => {
    if (!user || !product) return;

    const newReview = await reviewService.add({
      productId: product.id,
      rating,
      comment,
    });

    setReviews((prev) => [...prev, newReview]);
    setComment("");
    setRating(5);
  };

  const averageRating =
    reviews.length === 0
      ? 0
      : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} width={150} />
      <p>{product.description}</p>
      <p>Cena: {product.price} zł</p>

      <h2>
        Opinie ⭐ {averageRating} ({reviews.length})
      </h2>

      <button onClick={() => setShowReviews((v) => !v)}>
        {showReviews ? "Ukryj opinie" : "Pokaż opinie"}
      </button>

      {showReviews && (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.userEmail}</strong> (
              {new Date(review.date).toLocaleDateString()}
              ): {review.rating}/5
              <br />
              {review.comment}
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated && (
        <>
          <button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Anuluj" : "Dodaj opinię"}
          </button>

          {showForm && (
            <>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button onClick={handleAddReview}>Potwierdź</button>
            </>
          )}
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
