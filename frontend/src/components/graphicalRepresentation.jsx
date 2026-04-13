import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* -------- Custom Tooltip -------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-3 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>

        <p className="text-green-600 text-sm font-medium">
          Income: ${payload[0]?.value}
        </p>
        <p className="text-red-500 text-sm font-medium">
          Expense: ${payload[1]?.value}
        </p>
      </div>
    );
  }
  return null;
};

/* -------- Component -------- */
export default function GraphicalRepresentation({value}) {
  const outletContext = value;

  const [view, setView] = useState("monthly");
  const [data, setData] = useState([]);

  const filteredTransactions = outletContext.filteredTransactions(
    outletContext.transactions,
    view
  );

  useEffect(() => {
    const grouped = {};
    const now = new Date();

    // ================= WEEKLY =================
    if (view === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      days.forEach((d) => {
        grouped[d] = { income: 0, expense: 0 };
      });

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredTransactions.forEach((t) => {
        const date = new Date(t.date);

        if (date >= startOfWeek && date <= endOfWeek) {
          const day = date.toLocaleString("default", {
            weekday: "short",
          });

          if (t.type.toLowerCase() === "income") {
            grouped[day].income += Number(t.amount);
          } else {
            grouped[day].expense += Number(t.amount);
          }
        }
      });

      setData(days.map((d) => ({ name: d, ...grouped[d] })));
    }

    // ================= MONTHLY =================
    else if (view === "monthly") {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      const currentYear = now.getFullYear();

      months.forEach((m) => {
        grouped[m] = { income: 0, expense: 0 };
      });

      filteredTransactions.forEach((t) => {
        const date = new Date(t.date);

        if (date.getFullYear() === currentYear) {
          const month = date.toLocaleString("default", {
            month: "short",
          });

          if (t.type.toLowerCase() === "income") {
            grouped[month].income += Number(t.amount);
          } else {
            grouped[month].expense += Number(t.amount);
          }
        }
      });

      setData(months.map((m) => ({ name: m, ...grouped[m] })));
    }

    // ================= YEARLY =================
    else if (view === "yearly") {
      const currentYear = now.getFullYear();
      const years = [];

      for (let i = 9; i >= 0; i--) {
        years.push((currentYear - i).toString());
      }

      years.forEach((y) => {
        grouped[y] = { income: 0, expense: 0 };
      });

      filteredTransactions.forEach((t) => {
        const year = new Date(t.date).getFullYear().toString();

        if (grouped[year]) {
          if (t.type.toLowerCase() === "income") {
            grouped[year].income += Number(t.amount);
          } else {
            grouped[year].expense += Number(t.amount);
          }
        }
      });

      setData(years.map((y) => ({ name: y, ...grouped[y] })));
    }

    // ================= DAILY =================
    else if (view === "daily") {
      const hours = [];
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      for (let i = 0; i <24; i++) {
        const label = new Date(0, 0, 0, i).toLocaleString("en-IN", {
          hour: "numeric",
        });
        hours.push(label);
        grouped[label] = { income: 0, expense: 0 };
      }

      filteredTransactions.forEach((t) => {
        const date = new Date(t.date);

        const check = new Date(date);
        check.setHours(0, 0, 0, 0);

        if (check.getTime() === today.getTime()) {
          const hour = date.toLocaleString("en-IN", {
            hour: "numeric",
          });

          if (t.type.toLowerCase() === "income") {
            grouped[hour].income += Number(t.amount);
          } else {
            grouped[hour].expense += Number(t.amount);
          }
        }
      });

      setData(hours.map((h) => ({ name: h, ...grouped[h] })));
    }
  }, [outletContext.filteredTransactions, view]);

  return (
    <div
      className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl 
      border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 tracking-wide">
          Cashflow
        </h2>

        {/* TOGGLE */}
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          {["monthly", "yearly", "weekly", "daily"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  view === v
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          barGap={6}
          barCategoryGap={25}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          {/* Axes */}
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Bars */}
          <Bar
            dataKey="income"
            fill="#16a34a" // GREEN
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />

          <Bar
            dataKey="expense"
            fill="#ef4444" // RED
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          <span className="text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-600">Expense</span>
        </div>
      </div>
    </div>
  );
}






