import React, { useEffect, useMemo } from "react";
import Axios from "axios";
import { backendUrl } from "../main.jsx";

/* -------- Orange Palette -------- */
function generateColors(count) {
  return Array.from({ length: count }, (_, i) => {
    const hue = 20 + (i * 25) % 40;
    const saturation = 75 + (i % 2) * 10;
    const lightness = 55 + (i % 3) * 8;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
}

/* -------- Category Icons -------- */
const categoryIcons = {
  food: "🍔",
  rent: "🏠",
  shopping: "🛍️",
  salary: "💰",
  travel: "✈️",
  bills: "📄",
  other: "📦",
};

const SpendByCategory = () => {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await Axios.get(`${backendUrl}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const spendByCategory =
          res?.data?.data?.spendByCategory || {};

        const datas = Object.keys(spendByCategory).map((key) => ({
          id: key,
          category: key,
          amount: Number(spendByCategory[key]) || 0,
        }));

        setData(datas);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  /* -------- Colors -------- */
  const spendData = useMemo(() => {
    const colors = generateColors(data.length);
    return data.map((item, index) => ({
      ...item,
      color: colors[index],
    }));
  }, [data]);

  /* -------- Total -------- */
  const totalSpend = useMemo(
    () => spendData.reduce((acc, curr) => acc + curr.amount, 0),
    [spendData]
  );

  /* -------- Hide if no data -------- */
  if (!spendData.length || totalSpend === 0) return null;

  return (
    <div
      className="bg-white/70 backdrop-blur-xl border border-gray-200 
      rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 
      p-6 mt-6"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Spend by Category
      </h3>

      <div className="space-y-2">

        {spendData.map((item) => {
          const icon =
            categoryIcons[item.category.toLowerCase()] || "📦";

          return (
            <div
              key={item.id}
              className="flex justify-between items-center 
              px-3 py-2 rounded-xl transition-all duration-200
              hover:bg-orange-50/40 group"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* Icon */}
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-sm"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  {icon}
                </div>

                {/* Category */}
                <span className="text-gray-600 font-medium text-sm capitalize">
                  {item.category}
                </span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* Color Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>

                {/* Amount */}
                <span className="font-semibold text-gray-800 text-sm">
                  ₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 mt-3 border-t border-gray-200">
          <span className="text-gray-500 font-medium text-sm">
            Total
          </span>
          <span className="text-gray-900 font-bold text-lg">
            ₹{totalSpend.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpendByCategory;