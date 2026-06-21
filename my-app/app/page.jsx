"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [form, setForm] = useState({
    category: "",
    price: ""
  });

  const load = async () => {
    const res = await fetch(
      `/api/expenses?category=${category}&sort=${sort}`
    );
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
  }, [category, sort]);

  const addExpense = async () => {
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ category: "", price: "" });
    load();
  };

  const remove = async (id) => {
    await fetch(`/api/expenses/${id}`, {
      method: "DELETE"
    });

    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Expense Dashboard
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button
          onClick={addExpense}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* FILTER + SORT */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="filter category"
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={() => setSort("asc")}
          className="bg-green-500 text-white px-4 rounded"
        >
          ASC
        </button>

        <button
          onClick={() => setSort("desc")}
          className="bg-red-500 text-white px-4 rounded"
        >
          DESC
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-3">
        {data.map((e) => (
          <div
            key={e.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {e.category}
              </p>
              <p className="text-gray-500">
                ${e.price} • {e.createdAt}
              </p>
            </div>

            <button
              onClick={() => remove(e.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}