"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");  
  const [username, setUsername] = useState("");
  const [count, setCount] = useState(0);
  const [editId, setEditId] = useState(null);

  // טעינה
  const load = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  // הוספה / עריכה
  const save = async () => {
    if (!title.trim()) return; // לא לשמור טקסט ריק
    if (!content.trim()) return; // לא לשמור טקסט ריק
    if (!username.trim()) return; // לא לשמור שם משתמש ריק
    if (count < 0) return; // לא לקבל ספירה שלילית

    const payload = {
      title,
      content,
      username,
      count,
      Like: 0,
    };

    if (editId) {
      await fetch("/api/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    } else {
      await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setTitle("");
    setContent("");
    setUsername("");
    setCount(0);
    setEditId(null);
    load();
  };

  // מחיקה
  const remove = async (id) => {
    await fetch("/api/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>MY STOCKS</h2>

      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <input
          style={{ flex: "1 1 48%", padding: 8, boxSizing: "border-box" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="הכנס טקסט"
        />
        <input
          style={{ flex: "1 1 48%", padding: 8, boxSizing: "border-box" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="הכנס תוכן"
        />
        <input
          style={{ flex: "1 1 48%", padding: 8, boxSizing: "border-box" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="הכנס שם משתמש"
        />
        <input
          type="number"
          min={0}
          style={{ flex: "1 1 48%", padding: 8, boxSizing: "border-box" }}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="הכנס ספירה"
        />
      </div>

      <button
        onClick={save}
        style={{
          width: "100%",
          padding: "10px 0",
          backgroundColor: editId ? "#4caf50" : "#2196f3",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 20,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {editId ? "עדכן" : "הוסף"}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {items.map((item) => (
          <div
            key={item._id}
            style={{
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <p style={{ margin: "5px 0", color: "#555" }}>{item.content}</p>
            <p style={{ margin: 0 }}>
              <b>Username:</b> {item.username || "-"} | <b>Count:</b> {item.count || 0}
            </p>
            <p style={{ margin: 0, fontWeight: "bold" }}>Likes: {item.Like || 0}</p>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setTitle(item.title);
                  setContent(item.content);
                  setUsername(item.username || "");
                  setCount(item.count || 0);
                  setEditId(item._id);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#ffeb3b",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: "8px 0",
                }}
                title="ערוך"
              >
                ✏️ ערוך
              </button>
              <button
                onClick={() => remove(item._id)}
                style={{
                  flex: 1,
                  backgroundColor: "#f44336",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: "8px 0",
                  color: "white",
                }}
                title="מחק"
              >
                🗑️ מחק
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
