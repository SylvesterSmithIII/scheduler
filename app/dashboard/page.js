"use client";
// app/dashboard/page.js
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function addTransaction(transaction) {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add transaction");
      }
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  if (status === "loading") return <div>Loading...</div>;

  if (!session)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <p className="text-xl mb-4">Please sign in to access the dashboard.</p>
        <div className="flex flex-col gap-4">
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded text-center">
            Sign In
          </a>
          <a href="/signup" className="bg-green-600 text-white px-4 py-2 rounded text-center">
            Sign Up
          </a>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-2 py-4">
      <div className="w-full mx-2 md:mx-12">
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-4xl font-bold text-center sm:text-left">Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </header>

          <TransactionForm addTransaction={addTransaction} />

          <div>
            <input
              type="text"
              placeholder="Filter by agent or file number"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <TransactionList
            transactions={transactions}
            filter={filter}
            onClickTransaction={(id) => window.location.href = `/dashboard/${id}`}
          />
        </div>
      </div>
    </div>
  );
}