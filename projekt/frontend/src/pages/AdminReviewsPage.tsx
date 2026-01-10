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
        <div key={r.id} style={{ borderBottom: "1px solid #ccc" }}>
          <p>
            <strong>{r.user?.username}</strong> ({r.rating}/5)
          </p>
          <p>{r.comment}</p>

          <button onClick={() => remove(r.id)}>Usuń</button>
        </div>
      ))}
    </div>
  );
}
