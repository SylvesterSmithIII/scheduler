// components/TransactionForm.js
"use client";
import { useState } from "react";

export default function TransactionForm({ addTransaction }) {
  const [formData, setFormData] = useState({
    fileNumber: "",
    closingDate: "",
    sellingAgent: "",
    listingAgent: "",
    address: "",
    notes: "",
    actions: [{ action: "Created", status: "Pending" }],
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    addTransaction(formData);
    setFormData({
      fileNumber: "",
      closingDate: "",
      sellingAgent: "",
      listingAgent: "",
      address: "",
      notes: "",
      actions: [{ action: "Created", status: "Pending" }],
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          name="fileNumber" 
          value={formData.fileNumber} 
          onChange={handleChange} 
          placeholder="File Number" 
          className="border p-2 rounded"
          required
        />
        <input 
          type="date" 
          name="closingDate" 
          value={formData.closingDate} 
          onChange={handleChange} 
          placeholder="Closing Date" 
          className="border p-2 rounded"
          required
        />
        <input 
          type="text" 
          name="sellingAgent" 
          value={formData.sellingAgent} 
          onChange={handleChange} 
          placeholder="Selling Agent" 
          className="border p-2 rounded"
          required
        />
        <input 
          type="text" 
          name="listingAgent" 
          value={formData.listingAgent} 
          onChange={handleChange} 
          placeholder="Listing Agent" 
          className="border p-2 rounded"
          required
        />
        <input 
          type="text" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder="Address" 
          className="border p-2 rounded"
          required
        />
      </div>
      <textarea 
        name="notes" 
        value={formData.notes} 
        onChange={handleChange} 
        placeholder="Notes" 
        className="border p-2 rounded w-full mt-4"
      />
      <div className="mt-4">
        <button type="submit" className="bg-[#158348] text-white px-4 py-2 rounded">
          Add Transaction
        </button>
      </div>
    </form>
  );
}