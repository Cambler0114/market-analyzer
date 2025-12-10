import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [chartData, setChartData] = useState([]);

  // 1. Имитация данных для разных периодов
  // В реальном проекте это был бы запрос к API с параметром ?period=week
  const generateData = (range) => {
    const data = [];
    const count = range === "week" ? 7 : range === "month" ? 30 : 12;
    const labelPrefix =
      range === "week" ? "День" : range === "month" ? "Дек" : "Мес";

    for (let i = 1; i <= count; i++) {
      data.push({
        name: `${labelPrefix} ${i}`,
        income: Math.floor(Math.random() * 50000) + 20000, // Случайная выручка
        competitors: Math.floor(Math.random() * 40000) + 15000,
      });
    }
    return data;
  };

  // Данные для Радарной диаграммы (Паутинки)
  const radarData = [
    { subject: "Цена", A: 120, B: 110, fullMark: 150 },
    { subject: "Ассортимент", A: 98, B: 130, fullMark: 150 },
    { subject: "Качество", A: 86, B: 130, fullMark: 150 },
    { subject: "Доставка", A: 99, B: 100, fullMark: 150 },
    { subject: "Лояльность", A: 85, B: 90, fullMark: 150 },
    { subject: "Маркетинг", A: 65, B: 85, fullMark: 150 },
  ];

  // Обновляем график при смене фильтра
  useEffect(() => {
    setChartData(generateData(timeRange));
  }, [timeRange]);

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>📊 Панель управления</h1>
          <p style={{ color: "#666", margin: 0 }}>
            Обзор ключевых показателей рынка
          </p>
        </div>

        {/* Фильтр времени */}
        <div
          style={{
            background: "#fff",
            padding: 5,
            borderRadius: 10,
            display: "flex",
            gap: 5,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          {["week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              style={{
                border: "none",
                background: timeRange === period ? "#b22222" : "transparent",
                color: timeRange === period ? "white" : "#666",
                padding: "8px 15px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "0.3s",
                textTransform: "capitalize",
              }}
            >
              {period === "week"
                ? "Неделя"
                : period === "month"
                  ? "Месяц"
                  : "Год"}
            </button>
          ))}
        </div>
      </div>

      {/* 1. КАРТОЧКИ СТАТИСТИКИ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {/* Карточка 1 */}
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          <div
            style={{
              padding: 15,
              background: "#e6ffe6",
              borderRadius: "50%",
              color: "green",
            }}
          >
            <ArrowUp size={24} />
          </div>
          <div>
            <div style={{ color: "#999", fontSize: 12 }}>Общая выручка</div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>₽ 1,2 млн</div>
            <div style={{ color: "green", fontSize: 12, fontWeight: "bold" }}>
              +12.5% к прошлому
            </div>
          </div>
        </div>

        {/* Карточка 2 */}
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          <div
            style={{
              padding: 15,
              background: "#ffe6e6",
              borderRadius: "50%",
              color: "#b22222",
            }}
          >
            <ArrowDown size={24} />
          </div>
          <div>
            <div style={{ color: "#999", fontSize: 12 }}>
              Активность конкурентов
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>Высокая</div>
            <div style={{ color: "#b22222", fontSize: 12, fontWeight: "bold" }}>
              Демпинг цен замечен
            </div>
          </div>
        </div>

        {/* Карточка 3 */}
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          <div
            style={{
              padding: 15,
              background: "#e6f7ff",
              borderRadius: "50%",
              color: "#0088fe",
            }}
          >
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ color: "#999", fontSize: 12 }}>
              Мониторинг товаров
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>452 шт.</div>
            <div style={{ color: "#0088fe", fontSize: 12, fontWeight: "bold" }}>
              Все данные актуальны
            </div>
          </div>
        </div>
      </div>

      {/* 2. ГЛАВНЫЕ ГРАФИКИ */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Левая часть: График выручки */}
        <div className="card" style={{ height: 400 }}>
          <h3>Динамика цен (Вы vs Рынок)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b22222" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#b22222" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#b22222"
                fillOpacity={1}
                fill="url(#colorIncome)"
                name="Ваша цена"
              />
              <Area
                type="monotone"
                dataKey="competitors"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorComp)"
                name="Рынок"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Правая часть: Сравнение (Радар) */}
        <div
          className="card"
          style={{
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Бенчмаркинг</h3>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>
            Сравнение с лидером рынка
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="Мы"
                dataKey="A"
                stroke="#b22222"
                fill="#b22222"
                fillOpacity={0.6}
              />
              <Radar
                name="Конкурент"
                dataKey="B"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. ПОСЛЕДНЯЯ АКТИВНОСТЬ (ЛЕНТА) */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>🔔 Лента событий</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {[
            {
              icon: Zap,
              color: "orange",
              text: 'Конкурент "Альфа" снизил цену на iPhone 15',
              time: "10 мин назад",
            },
            {
              icon: Users,
              color: "blue",
              text: 'Новый игрок "Gamma" появился в категории Электроника',
              time: "2 часа назад",
            },
            {
              icon: Activity,
              color: "green",
              text: "Ваша рентабельность выросла на 2% благодаря репрайсингу",
              time: "Вчера",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                paddingBottom: 10,
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  padding: 10,
                  background: "#f9f9f9",
                  borderRadius: 10,
                  color: item.color,
                }}
              >
                <item.icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: "500" }}>
                  {item.text}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>{item.time}</div>
              </div>
              <button
                style={{
                  border: "1px solid #ddd",
                  background: "transparent",
                  borderRadius: 5,
                  padding: "5px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Детали
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
