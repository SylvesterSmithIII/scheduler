"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DashboardTransactionDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchTransaction();
    }
  }, [id]);

  async function fetchTransaction() {
    try {
      const res = await fetch(`/api/transactions/${id}`);
      if (!res.ok) throw new Error('Failed to fetch transaction');
      const data = await res.json();
      setTransaction(data.transaction);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddAction(e) {
    e.preventDefault();
    try {
      const newAction = { action, status };
      const res = await fetch(`/api/transactions/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAction)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to add action: ' + errorText);
      }
      await fetchTransaction();
      setAction('');
      setStatus('');
    } catch (err) {
      setToastMessage(err.message);
      setTimeout(() => setToastMessage(''), 3000);
    }
  }
  

  async function advanceActionStatus(actionId, currentStatus) {
    const statusMap = {
      Unstarted: "Started",
      Started: "Completed",
      Completed: "Completed"
    };
    const nextStatus = statusMap[currentStatus];
    try {
      const res = await fetch(`/api/transactions/${id}/actions/${actionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error("Failed to update action");
      await fetchTransaction();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteAction(actionId) {
    try {
      const res = await fetch(`/api/transactions/${id}/actions/${actionId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete action');
      await fetchTransaction();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateActionNotes(actionId) {
    try {
      const res = await fetch(`/api/transactions/${id}/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: actionNotes })
      });
      if (!res.ok) throw new Error('Failed to update notes');
      await fetchTransaction();
      setToastMessage('Notes updated successfully!');
      setTimeout(() => setToastMessage(''), 3000);
      closeNotesModal();
    } catch (err) {
      setError(err.message);
    }
  }

  function openNotesModal(actionItem) {
    setActiveAction(actionItem);
    setActionNotes(actionItem.notes || '');
  }

  function closeNotesModal() {
    setActiveAction(null);
    setActionNotes('');
  }

  async function deleteTransaction() {
    if (!confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      // Redirect to the dashboard list after deletion
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8 font-sans relative">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.back()} 
            className="text-white bg-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-200"
          >
            &larr; Back
          </button>
          <h1 className="mt-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Transaction Detail
          </h1>
        </div>
        <button 
          onClick={deleteTransaction}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
        >
          Delete Transaction
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold text-gray-700">File Number:</span> {transaction.fileNumber}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Address:</span> {transaction.address}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Closing Date:</span> {new Date(transaction.closingDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Selling Agent:</span> {transaction.sellingAgent}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Listing Agent:</span> {transaction.listingAgent}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Actions</h2>
        {transaction.actions && transaction.actions.length > 0 ? (
          <div className="space-y-4">
            {transaction.actions.map((act) => (
              <div key={act._id} className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-lg">
                    <span className="font-semibold text-gray-700">Action:</span> {act.action}
                  </p>
                  <p className="text-lg flex items-center">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <button
                      onClick={() => advanceActionStatus(act._id, act.status)}
                      className={
                        act.status === "Unstarted"
                          ? "text-blue-600 hover:underline"
                          : act.status === "Started"
                          ? "text-yellow-600 hover:underline"
                          : "text-green-600 cursor-default"
                      }
                      disabled={act.status === "Completed"}
                    >
                      {act.status}
                    </button>
                    <button
                      onClick={() => openNotesModal(act)}
                      title="Edit Notes"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {/* Pencil icon for editing notes */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2a2.5 2.5 0 00-3.536-3.536L4 17.536V21h3.464L20.768 8.232z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteAction(act._id)}
                      title="Delete Action"
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v0a2 2 0 01-2 2H9a2 2 0 01-2-2v0a2 2 0 012-2z" />
                      </svg>
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No actions recorded.</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Add New Action</h2>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleAddAction} className="space-y-6">
          <div>
            <label htmlFor="action" className="block text-lg font-semibold text-gray-700 mb-2">
              Action Description
            </label>
            <input
              id="action"
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
              placeholder="Describe the action..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-lg font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select status</option>
              <option value="Unstarted">Unstarted</option>
              <option value="Started">Started</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xl font-bold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
          >
            Add Action
          </button>
        </form>
      </div>

      {/* Modal for editing notes */}
      {activeAction && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Edit Notes</h3>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Enter notes..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => updateActionNotes(activeAction._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={closeNotesModal}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}