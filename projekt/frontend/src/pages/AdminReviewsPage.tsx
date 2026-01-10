import { useEffect, useState } from "react";
import type { Review } from "../types/Review";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then(setReviews);
  }, []);

  const remove = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setReviews((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <h1>Admin – Opinie</h1>

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
        >
          <div
            style={{ fontSize: "0.9em", color: "#555", marginBottom: "5px" }}
          >
            Produkt: <strong>{r.product?.title}</strong> (ID: {r.productId})
          </div>

          <p style={{ margin: "5px 0" }}>
            <strong>{r.user?.username || "Anonim"}</strong> ({r.rating}/5)
          </p>
          <p style={{ fontStyle: "italic" }}>{r.comment}</p>

          <button onClick={() => remove(r.id)} style={{ color: "red" }}>
            Usuń
          </button>
        </div>
      ))}
    </div>
  );
}
