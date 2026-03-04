"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const getGroupedPriorityData = () => {
    const groups = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    history.forEach((task) => {
      if (task.score >= 8) groups.High += 1;
      else if (task.score >= 5) groups.Medium += 1;
      else groups.Low += 1;
    });

    return [
      { name: "High (8-10)", value: groups.High, color: "#ef4444" },
      { name: "Medium (5-7)", value: groups.Medium, color: "#facc15" },
      { name: "Low (1-4)", value: groups.Low, color: "#22c55e" },
    ].filter((item) => item.value > 0);
  };

  const [logs, setLogs] = useState<any[]>([]);
  const fetchLogs = async () => {
    const res = await fetch("/api/logs");
    const data = await res.json();
    setLogs(data);
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

        <div
          className={`space-y-4 ${
            history.length > 3 ? "max-h-96 overflow-y-auto pr-2" : ""
          }`}
        >
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

        {/* Dashboard Analytics */}
        {history.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mt-8">
            <h2 className="text-2xl font-semibold mb-6">Priority Distribution</h2>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Pie Chart */}
              <div className="w-full md:w-1/2 h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getGroupedPriorityData()}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {getGroupedPriorityData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Priority List */}
              <div className="w-full md:w-1/2 space-y-2">
                {getGroupedPriorityData().map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Logs Section */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">AI Logs</h2>
            <button
              onClick={fetchLogs}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Refresh Logs
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-4 text-sm">
            {logs.map((log) => (
              <div key={log.id} className="border p-3 rounded space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{log.model}</span>
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div>
                  <strong>Score:</strong> {log.parsedScore}
                </div>

                <div>
                  <strong>Reasoning:</strong> {log.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}