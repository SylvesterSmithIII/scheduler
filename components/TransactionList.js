"use client";

export default function TransactionList({ transactions, filter, onClickTransaction }) {
  const lowerFilter = filter.toLowerCase();
  const filteredTransactions = transactions.filter(tx => {
    return (
      tx.fileNumber.toLowerCase().includes(lowerFilter) ||
      tx.sellingAgent.toLowerCase().includes(lowerFilter) ||
      tx.listingAgent.toLowerCase().includes(lowerFilter)
    );
  });

  return (
    <div>
      {filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border">File #</th>
                <th className="px-2 py-1 border">Address</th>
                <th className="px-2 py-1 border">Closing Date</th>
                <th className="px-2 py-1 border">Selling Agent</th>
                <th className="px-2 py-1 border">Listing Agent</th>
                <th className="px-2 py-1 border">Actions</th>
                <th className="px-2 py-1 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx._id} onClick={() => onClickTransaction && onClickTransaction(tx._id)} className="cursor-pointer hover:bg-gray-100">
                  <td className="px-2 py-1 border">{tx.fileNumber}</td>
                  <td className="px-2 py-1 border">{tx.address}</td>
                  <td className="px-2 py-1 border">{new Date(tx.closingDate).toLocaleDateString()}</td>
                  <td className="px-2 py-1 border">{tx.sellingAgent}</td>
                  <td className="px-2 py-1 border">{tx.listingAgent}</td>
                  <td className="px-2 py-1 border">
                    {tx.actions.map((a, i) => (
                      <div key={i}>
                        {a.action}: {a.status}
                      </div>
                    ))}
                  </td>
                  <td className="px-2 py-1 border">{tx.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}