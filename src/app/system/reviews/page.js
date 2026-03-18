"use client";
import { DM_Sans } from "next/font/google";
import { useState, useEffect } from "react";
export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [content, setContent] = useState("");
  

  const load = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    load();
  }, []);

  const addReview = async () => {
    if (!name.trim() || !city.trim() || !content.trim()) return;
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city, content }),
    });
     setName("");
     setCity(""); 
     setContent("");
    load();
  };

  const removeReview = async (id) => {
    await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const updateLikes = async (id, delta) => {
    await fetch("/api/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, delta }),
    });
    load();
  };

  const best = reviews.reduce((max,r) => (r.likes > (max.likes || 0) ? r : max), {});
  const worst = reviews.reduce((min,r) => (r.likes < (min.likes ?? Infinity) ? r : min), {});

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Reviews</h2>
      <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Business Name" style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Review Content" style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        <button onClick={addReview} style={{ padding: "8px 15px", background: "blue", color: "#fff", border: "none", cursor: "pointer" }}>Add Review</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      {reviews.map((r) => (
          <div key={r._id} style={{ padding: 15, border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <p><b>{r.name}</b> ({r.city})</p>
            <p>{r.content}</p>
            <p>Likes: {r.likes}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => updateLikes(r._id, 1)}>Like</button>
              <button onClick={() => updateLikes(r._id, -1)}>Dislike</button>
              <button onClick={() => removeReview(r._id)} style={{ color: "red" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {best?._id && <p>Best Business: {best.name} ({best.likes} likes)</p>}
        {worst?._id && <p>Worst Business: {worst.name} ({worst.likes} likes)</p>}
      </div>
    </div>
  );
}