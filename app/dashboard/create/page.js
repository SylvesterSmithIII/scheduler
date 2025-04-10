"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultActions } from "@/lib/actionTemplates";


export default function CreateTransaction() {
  const router = useRouter();
  const [fileNumber, setFileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [sellingAgent, setSellingAgent] = useState("");
  const [listingAgent, setListingAgent] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedActionNames, setSelectedActionNames] = useState([]);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [customActionText, setCustomActionText] = useState("");
  const [customActions, setCustomActions] = useState([]);

  useEffect(() => {
    const allDefaults = defaultActions.map((a) => a.action);
    setSelectedActionNames(allDefaults);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const actions = selectedActionNames.map((name) => ({
      action: name,
      status: "Unstarted",
    }));

    const transaction = {
      fileNumber,
      address,
      closingDate,
      sellingAgent,
      listingAgent,
      notes,
      actions,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create transaction");
      }
      setToastMessage("Transaction created successfully!");
      setTimeout(() => setToastMessage(""), 3000);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleAction(actionName) {
    setSelectedActionNames((prev) =>
      prev.includes(actionName)
        ? prev.filter((a) => a !== actionName)
        : [...prev, actionName]
    );
  }

  function handleAddCustomAction() {
    const trimmed = customActionText.trim();
    if (trimmed && !customActions.some((act) => act.action === trimmed)) {
      setCustomActions([...customActions, { action: trimmed, status: "Unstarted" }]);
      setSelectedActionNames((prev) => [...prev, trimmed]);
      setCustomActionText("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl max-w-3xl w-full p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Create New Transaction</h1>
        {toastMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">
            {toastMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              File Number
            </label>
            <input
              type="text"
              value={fileNumber}
              onChange={(e) => setFileNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Closing Date
            </label>
            <input
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Selling Agent
            </label>
            <input
              type="text"
              value={sellingAgent}
              onChange={(e) => setSellingAgent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Listing Agent
            </label>
            <input
              type="text"
              value={listingAgent}
              onChange={(e) => setListingAgent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Optional notes about this transaction..."
            />
          </div>

          <div className="relative w-full flex flex-col rounded-xl bg-white shadow">
            <nav className="flex flex-wrap gap-1 p-2">
              {[...defaultActions, ...customActions].map((a, index) => (
                <div
                  key={`action-${index}`}
                  role="button"
                  className="flex items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                  <label
                    htmlFor={`action-${index}`}
                    className="flex cursor-pointer items-center px-3 py-2"
                  >
                    <div className="inline-flex items-center">
                      <label
                        className="flex items-center cursor-pointer relative"
                        htmlFor={`action-${index}`}
                      >
                        <input
                          type="checkbox"
                          id={`action-${index}`}
                          checked={selectedActionNames.includes(a.action)}
                          onChange={() => toggleAction(a.action)}
                          className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                        />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>
                      <label
                        className="cursor-pointer ml-2 text-slate-600 text-sm whitespace-nowrap"
                        htmlFor={`action-${index}`}
                      >
                        {a.action}
                      </label>
                    </div>
                  </label>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={customActionText}
              onChange={(e) => setCustomActionText(e.target.value)}
              placeholder="Custom action"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomAction}
              className="bg-green-700 text-white p-2 rounded-full transition-colors hover:bg-green-800 flex items-center justify-center"
              title="Add Action"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition-colors"
          >
            Finish Creating Transaction
          </button>
        </form>
      </div>
    </div>
  );
}