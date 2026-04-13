import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import Axios from "axios";
import { backendUrl } from "../main.jsx";

/* -------- Dynamic Colors -------- */
const generateColors = (count) => {
 return Array.from({ length: count }, (_, i) => {
    const lightness = 75 - i * (40 / count); 
    return `hsl(24, 90%, ${lightness}%)`;
  });
};

/* -------- Custom Tooltip -------- */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white shadow-lg rounded-xl p-3 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          {item.name}
        </p>
        <p className="text-sm text-gray-500">
          ₹{item.value.toLocaleString("en-IN")}
        </p>
       
      </div>
    );
  }
  return null;
};

/* -------- Active Slice (Hover Animation) -------- */
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // 🔥 expand effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function ExpenseDistribution() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* -------- Fetch -------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await Axios.get(`${backendUrl}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const expenseDistribution =
          res?.data?.data?.expenseDistribution || [];

        const formatted = expenseDistribution.map((item) => ({
          name: item.category,
          value: item.amount,
        }));

        setData(formatted);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  /* -------- Process Data -------- */
  const processedData = useMemo(() => {
    if (data.length <= 6) return data;

    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 5);
    const others = sorted.slice(5);

    const othersTotal = others.reduce((sum, d) => sum + d.value, 0);

    return [...top, { name: "Others", value: othersTotal }];
  }, [data]);

  /* -------- Total -------- */
  const total = useMemo(
    () => processedData.reduce((sum, d) => sum + d.value, 0),
    [processedData]
  );

  /* -------- Colors -------- */
  const COLORS = useMemo(
    () => generateColors(processedData.length),
    [processedData.length]
  );

  /* -------- Top Category -------- */
  const topCategory = useMemo(() => {
    if (!processedData.length) return null;
    return [...processedData].sort((a, b) => b.value - a.value)[0];
  }, [processedData]);

  /* -------- Hide -------- */
  if (!processedData.length || total === 0) return null;

  return (
    <div
      className="bg-white/70 backdrop-blur-xl border border-gray-200 
      rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
    >
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        Expense Distribution
      </h2>

      <div className="flex flex-col items-center gap-6">

        {/* Chart */}
        <div className="relative w-[320px] h-[320px]">

          {/* Center Dynamic Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-400">
              {processedData[activeIndex]?.name || "Top"}
            </p>

            <p className="text-xl font-bold text-gray-800">
              ₹{processedData[activeIndex]?.value?.toLocaleString("en-IN")}
            </p>

            <p className="text-xs text-gray-400">
              of ₹{total.toLocaleString("en-IN")}
            </p>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={processedData}
                dataKey="value"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={4}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {processedData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {processedData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition
              ${
                activeIndex === index
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}