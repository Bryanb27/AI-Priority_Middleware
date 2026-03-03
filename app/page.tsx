"use client";

import { useState } from "react";

type TaskResult = {
  title: string;
  score: number;
  reasoning: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TaskResult[]>([]);

  const getColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 5) return "bg-yellow-400";
    return "bg-green-500";
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    setHistory([
      {
        title,
        score: data.score,
        reasoning: data.reasoning,
      },
      ...history,
    ]);

    setTitle("");
    setDescription("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">
          AI-Priority Middleware
        </h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 w-full rounded"
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Analyzing..." : "Analyze Priority"}
          </button>
        </div>

        <div className="space-y-4">
          {history.map((task, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow space-y-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{task.title}</h2>
                <span
                  className={`text-white px-3 py-1 rounded-full ${getColor(
                    task.score
                  )}`}
                >
                  {task.score}
                </span>
              </div>

              <p className="text-sm text-gray-600">{task.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}