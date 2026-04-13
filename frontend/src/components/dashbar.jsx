import { useOutletContext } from "react-router-dom";

import React from "react";

/* ---------------- Trend Badge ---------------- */
const TrendBadge = ({ value, positive, type }) => {
  if (type) {
    return (
      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
        {value}
      </span>
    );
  }

  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit
        ${positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
    >
      <span className="text-[10px]">{positive ? "▲" : "▼"}</span>
      {positive ? `+${value}%` : `-${value}%`}
    </span>
  );
};

/* ---------------- Stat Card ---------------- */
const StatCard = ({ icon, label, amount, trend, positive, type }) => {
  const iconBg =
    label === "Total Income"
      ? "bg-green-100 text-green-600"
      : label === "Total Expense"
      ? "bg-red-100 text-red-500"
      : label === "Total Savings"
      ? "bg-blue-100 text-blue-600"
      : "bg-purple-100 text-purple-600";

  return (
    <div
      className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 
      shadow-md border border-gray-200 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-orange-100 via-transparent to-orange-100 blur-xl"></div>

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${iconBg}`}
          >
            {icon}
          </div>
          <span className="text-gray-300 hover:text-gray-500 cursor-pointer">
            ⋮
          </span>
        </div>

        <TrendBadge value={trend} positive={positive} type={type} />

        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {label === "Savings Rate"
              ? `${amount}%`
              : `₹${Number(amount).toLocaleString("en-IN")}`}
          </p>
          <p className="text-sm text-gray-400 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
export default function Dashbar({ value }) {
  const { states, getSavingsRating, outletContext } = value;
  const { user } = outletContext;

  return (
    <div className="min-h-full bg-white p-5 font-sans rounded-3xl">
      <div className="max-w-7xl mx-auto">

        {/* GRID (equal width cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Credit Card */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between text-white 
            hover:scale-[1.02] transition-all duration-300 shadow-xl cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, #f97316 0%, #ea580c 40%, #9a3412 100%)",
            }}
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>

            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-xl" />

            {/* Top */}
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-white/90" />
                <div className="w-4 h-4 rounded-full bg-white/50 -ml-2" />
              </div>
              <span className="text-white/80 text-sm">)))</span>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-4">
              <p className="text-base font-semibold tracking-wide">
                {user.name || "User"}
              </p>

              <p className="text-xs text-white/70 mt-3">Balance</p>
              <p className="text-2xl font-extrabold tracking-tight">
                ₹{states.allTimeSavings.toLocaleString("en-IN")}
              </p>

              <div className="flex justify-between mt-4 text-xs text-white/80">
                <div>
                  <p className="opacity-70">EXP</p>
                  <p className="font-semibold">
                    {new Date(
                      new Date().setFullYear(
                        new Date().getFullYear() + 5
                      )
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="opacity-70">CVV</p>
                  <p className="font-semibold">{user.cvv || "123"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <StatCard
            icon="💰"
            label="Total Income"
            amount={states.last30DaysIncome}
            trend={178}
            positive={true}
          />

          <StatCard
            icon="💸"
            label="Total Expense"
            amount={states.last30DaysExpense}
            trend={176}
            positive={false}
          />

          <StatCard
            icon="🏦"
            label="Total Savings"
            amount={states.last30DaysSavings}
            trend={124}
            positive={true}
          />

          <StatCard
            icon="📈"
            label="Savings Rate"
            amount={states.last30DaysSavingsRate.toFixed(2)}
            trend={getSavingsRating(states.last30DaysSavingsRate)}
            positive={true}
            type="1"
          />
        </div>
      </div>
    </div>
  );
}