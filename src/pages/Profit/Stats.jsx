import React, { useEffect, useState } from "react";
// Импортируем компоненты графика
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Stats = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://market-analyzer-r1yg.onrender.com./api/stats")
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Загрузка аналитики...</div>;

  return (
    <div>
      <h1>📈 Статистика рентабельности</h1>
      <p>Динамика доходов за полгода (млн. руб).</p>

      <div className="card" style={{ height: 400, marginTop: 20 }}>
        {/* Адаптивный контейнер для графика */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: 10,
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.highlight ? "#b22222" : "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
