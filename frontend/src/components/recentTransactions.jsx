import React from "react";

export default function RecentTransactions({ value }) {
  const outletContext = value;

  const [timeFrame, setTimeFrame] = React.useState("monthly");
  const [filteredTransactions, setFilteredTransactions] = React.useState([]);

  React.useEffect(() => {
    setFilteredTransactions(
      outletContext.filteredTransactions(
        outletContext.transactions,
        timeFrame
      )
    );
  }, [timeFrame, outletContext.transactions]);

  return (
    <div
      className="bg-white/70 backdrop-blur-xl rounded-3xl 
      shadow-md border border-gray-200 p-6 mt-6 
      hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 tracking-wide">
          Recent Transactions
        </h2>

        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="px-4 py-2 rounded-xl bg-orange-100 text-sm font-medium 
          focus:outline-none focus:ring-2 focus:ring-orange-400 
          hover:bg-orange-200 transition cursor-pointer shadow-sm"
        >
          <option>All</option>
          <option>daily</option>
          <option>weekly</option>
          <option>monthly</option>
          <option>yearly</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Transaction</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Category</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filteredTransactions.map((t, index) => (
              <tr
                key={index}
                className="group border-b border-gray-100 
                hover:bg-orange-50/40 transition-all duration-200"
              >
                {/* TYPE */}
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      t.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>

                {/* DATE */}
                <td className="text-gray-500 text-sm">
                  {new Date(t.date).toLocaleDateString("en-IN")}
                </td>

                {/* AMOUNT */}
                <td
                  className={`font-bold text-sm tracking-wide ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  ₹
                  {typeof t.amount === "number"
                    ? t.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : t.amount}
                </td>

                {/* NOTE */}
                <td className="text-gray-500 text-sm">
                  {t.description || "-"}
                </td>

                {/* CATEGORY */}
                <td>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium 
                    bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition"
                  >
                    {t.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}