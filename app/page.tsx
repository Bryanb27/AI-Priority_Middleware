"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState<string | null>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();
    setScore(data.score);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 gap-4">
      <h1 className="text-3xl font-bold">AI Priority Middleware</h1>

      <input
        className="border p-2 w-96"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-96"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Score Task
      </button>

      {score && (
        <div className="text-xl mt-4">
          Priority Score: <strong>{score}</strong>
        </div>
      )}
    </main>
  );
}