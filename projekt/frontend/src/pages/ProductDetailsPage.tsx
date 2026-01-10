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
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // --- STANY WIDOKU ---
  const [showReviews, setShowReviews] = useState(true); // Czy pokazywać listę?
  const [showForm, setShowForm] = useState(false); // Czy pokazywać formularz?

  const [canReview, setCanReview] = useState(false);

  // Formularz
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edycja
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    productsService
      .getById(Number(id))
      .then(setProduct)
      .finally(() => {
        setLoading(false);
      });

    reviewService.getByProduct(Number(id)).then((data: any) => {
      setReviews(data.reviews);
    });

    if (isAuthenticated) {
      reviewService.canReview(Number(id)).then(setCanReview);
    }
  }, [id, isAuthenticated]);

  const handleAddReview = async () => {
    if (!comment) return alert("Wpisz treść opinii");

    setIsSubmitting(true);
    try {
      const review = await reviewService.add({
        productId: product?.id!,
        rating,
        comment,
      });

      setReviews((r) => [...r, review]);
      setCanReview(false); // Blokujemy możliwość dodania kolejnej
      setShowForm(false); // Zwijamy formularz (choć i tak zniknie przez canReview)

      setComment("");
      setRating(5);
      setShowReviews(true); // Pokazujemy listę, żeby user widział swoją opinię
    } catch (error) {
      alert("Błąd podczas dodawania opinii");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = async (reviewId: string) => {
    try {
      const updated = await reviewService.edit(reviewId, {
        rating: editRating,
        comment: editComment,
      });

      setReviews((r) =>
        r.map((rev) => (rev.id === reviewId ? { ...rev, ...updated } : rev))
      );
      setEditingId(null);
    } catch (err) {
      alert("Nie udało się edytować opinii");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć opinię?")) return;
    try {
      await reviewService.delete(reviewId);
      setReviews((r) => r.filter((rev) => rev.id !== reviewId));
    } catch (err) {
      alert("Nie udało się usunąć opinii");
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!product) return <p>Produkt nie znaleziony</p>;

  const avg =
    reviews.length === 0
      ? 0
      : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <h1>{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        style={{ maxWidth: "200px" }}
      />
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

      <hr />

      <div style={{ marginTop: "20px" }}>
        {/* NAGŁÓWEK I PRZYCISKI STERUJĄCE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <h3>
            Opinie ⭐ {avg} ({reviews.length})
          </h3>

          {/* Przycisk Pokaż/Ukryj LISTĘ opinii */}
          <button
            onClick={() => setShowReviews(!showReviews)}
            style={{
              fontSize: "0.8em",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {showReviews ? "Ukryj opinie" : "Pokaż opinie"}
          </button>

          {/* Przycisk Pokaż/Ukryj FORMULARZ (tylko jeśli canReview) */}
          {canReview && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                fontSize: "0.8em",
                padding: "5px 10px",
                cursor: "pointer",
                backgroundColor: showForm ? "#ddd" : "#4CAF50", // Szary jak otwarty, zielony jak zachęta
                color: showForm ? "black" : "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {showForm ? "Anuluj dodawanie" : "Napisz opinię"}
            </button>
          )}
        </div>

        {/* 1. FORMULARZ DODAWANIA (Widoczny tylko gdy canReview + showForm) */}
        {canReview && showForm && (
          <div
            style={{
              border: "1px solid #4b4b4b",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "5px",
              //backgroundColor: "#f0fff4",
            }}
          >
            <h4 style={{ marginTop: 0 }}>Twoja opinia</h4>
            <div style={{ marginBottom: "10px" }}>
              <label>Ocena: </label>
              <select
                value={rating}
                onChange={(e) => setRating(+e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
              placeholder="Napisz co myślisz o produkcie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleAddReview} disabled={isSubmitting}>
                {isSubmitting ? "Wysyłanie..." : "Wyślij opinię"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "transparent", border: "1px solid #ccc" }}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* 2. LISTA OPINII */}
        {showReviews && (
          <div className="reviews-list">
            {reviews.length === 0 && (
              <p style={{ color: "#777" }}>Brak opinii.</p>
            )}

            {reviews.map((r) => (
              <div
                key={r.id}
                style={{ borderBottom: "1px solid #414141", padding: "10px 0" }}
              >
                {editingId === r.id ? (
                  // EDYCJA
                  <div
                    className="edit-form"
                    style={{ padding: "10px", background: "#f9f9f9" }}
                  >
                    <label>Edytuj ocenę: </label>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      style={{
                        display: "block",
                        width: "100%",
                        margin: "10px 0",
                      }}
                    />
                    <button onClick={() => saveEdit(r.id)}>
                      Zapisz zmiany
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{ marginLeft: "10px" }}
                    >
                      Anuluj
                    </button>
                  </div>
                ) : (
                  // WYŚWIETLANIE POJEDYNCZEJ OPINII
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>{r.user?.username || "Użytkownik"}</strong>
                      <span style={{ color: "#f39c12", fontWeight: "bold" }}>
                        {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p style={{ margin: "5px 0", color: "#ffffff" }}>
                      {r.comment}
                    </p>

                    {user && r.userId === user.id && (
                      <div
                        style={{
                          gap: "10px",
                          display: "flex",
                          fontSize: "0.85em",
                          marginTop: "5px",
                        }}
                      >
                        <button onClick={() => startEditing(r)}>Edytuj</button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          style={{
                            color: "red",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        >
                          Usuń
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
