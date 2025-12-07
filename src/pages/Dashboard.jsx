import React, { useEffect, useState } from "react";
import { Activity, TrendingUp, Users } from "lucide-react";

// Компонент для верхней карточки метрики
const MetricCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div
    className="card"
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <h3
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: 0,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </h3>
      {Icon && <Icon size={20} color="#b22222" />}
    </div>

    <div>
      <h1 style={{ fontSize: "36px", margin: "10px 0", color: "#333" }}>
        {value}
      </h1>
      <span
        style={{
          color: isPositive ? "#155724" : "#721c24",
          background: isPositive ? "#d4edda" : "#f8d7da",
          padding: "5px 12px",
          borderRadius: "15px",
          fontSize: "13px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {change}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://market-analyzer-r1yg.onrender.com/api/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки дашборда:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div>
        <div
          className="skeleton"
          style={{ width: 300, height: 40, marginBottom: 30 }}
        ></div>

        {/* Верхние карточки */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div className="skeleton card" style={{ height: 120, flex: 1 }}></div>
          <div className="skeleton card" style={{ height: 120, flex: 1 }}></div>
          <div className="skeleton card" style={{ height: 120, flex: 1 }}></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          {/* Таблица слева */}
          <div className="card">
            <div
              className="skeleton"
              style={{ width: "40%", height: 30, marginBottom: 20 }}
            ></div>
            <div
              className="skeleton"
              style={{ width: "100%", height: 40, marginBottom: 10 }}
            ></div>
            <div
              className="skeleton"
              style={{ width: "100%", height: 40, marginBottom: 10 }}
            ></div>
            <div
              className="skeleton"
              style={{ width: "100%", height: 40, marginBottom: 10 }}
            ></div>
          </div>

          {/* График справа */}
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 10,
              paddingBottom: 40,
            }}
          >
            <div className="skeleton" style={{ width: 30, height: 60 }}></div>
            <div className="skeleton" style={{ width: 30, height: 100 }}></div>
            <div className="skeleton" style={{ width: 30, height: 80 }}></div>
            <div className="skeleton" style={{ width: 30, height: 120 }}></div>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <h1 style={{ marginBottom: 30 }}>Панель управления</h1>

      {/* 1. ВЕРХНИЕ КАРТОЧКИ (МЕТРИКИ) */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <MetricCard
          title="Ценовые тенденции"
          value={data.trends.value}
          change={data.trends.change}
          isPositive={data.trends.positive}
          icon={TrendingUp}
        />
        <MetricCard
          title="Активность конкурентов"
          value={data.competitorsActivity.value}
          change={data.competitorsActivity.change}
          isPositive={data.competitorsActivity.positive}
          icon={Users}
        />
        <MetricCard
          title="Изменения"
          value={data.priceChanges.value}
          change={data.priceChanges.change}
          isPositive={data.priceChanges.positive}
          icon={Activity}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        {/* 2. ТАБЛИЦА АКТИВНОСТИ (ЛЕВАЯ ЧАСТЬ) */}
        <div className="card">
          <h3
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "15px",
            }}
          >
            Ценовая деятельность{" "}
            <small style={{ color: "#999", fontWeight: "normal" }}>
              (прошлый месяц)
            </small>
          </h3>

          <table style={{ marginTop: "0" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 0 }}>Дата</th>
                <th>Конкурент</th>
                <th>Изменения</th>
                <th>Оповещения</th>
              </tr>
            </thead>
            <tbody>
              {/* Проверяем, есть ли массив activity в данных */}
              {data.activity && data.activity.length > 0 ? (
                data.activity.map((row) => (
                  <tr key={row.id}>
                    <td style={{ paddingLeft: 0, color: "#555" }}>
                      {row.date}
                    </td>
                    <td>
                      <span
                        style={{
                          background: row.color || "#999",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        {row.competitor}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{row.changes}</td>
                    <td style={{ color: "#666" }}>{row.alerts}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                    Данных нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. ГРАФИК "ВЗГЛЯД КОНКУРЕНТОВ" (ПРАВАЯ ЧАСТЬ) */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <h3 style={{ marginBottom: 30 }}>Взгляд конкурентов</h3>

          {/* CSS-график (имитация макета) */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "15px",
              height: "150px",
            }}
          >
            <div
              style={{
                width: 30,
                height: "40%",
                background: "#b32424",
                borderRadius: "6px",
              }}
              title="Пн: 40%"
            ></div>
            <div
              style={{
                width: 30,
                height: "80%",
                background: "#b22222",
                borderRadius: "6px",
              }}
              title="Вт: 80%"
            ></div>
            <div
              style={{
                width: 30,
                height: "60%",
                background: "#b22222",
                borderRadius: "6px",
              }}
              title="Ср: 60%"
            ></div>
            <div
              style={{
                width: 30,
                height: "100%",
                background: "#b22222",
                borderRadius: "6px",
              }}
              title="Чт: 100%"
            ></div>
            <div
              style={{
                width: 30,
                height: "90%",
                background: "#b22222",
                borderRadius: "6px",
              }}
              title="Пт: 90%"
            ></div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "25px",
              fontSize: "14px",
              marginTop: 15,
              color: "#888",
              fontWeight: "bold",
            }}
          >
            <span>Пн</span>
            <span>Вт</span>
            <span>Ср</span>
            <span>Чт</span>
            <span>Пт</span>
          </div>
        </div>
      </div>

      {/* 4. НИЖНЯЯ СЕКЦИЯ (ПРИМЕР ТОВАРОВ) - как на макете */}
      <h3 style={{ marginTop: 30 }}>Ценообразование конкурентов</h3>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead style={{ background: "#f9f9f9" }}>
            <tr>
              <th style={{ paddingLeft: 20 }}>Продукт</th>
              <th>Статус</th>
              <th>Цена</th>
              <th>Рейтинг</th>
              <th>Уведомление</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ paddingLeft: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#eee",
                      borderRadius: 5,
                    }}
                  ></div>
                  <b>Игровой PC Case</b>
                </div>
              </td>
              <td>
                <span
                  style={{
                    color: "green",
                    background: "#e6ffe6",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  Активен
                </span>
              </td>
              <td>200 000 ₽</td>
              <td>⭐️ 4.5</td>
              <td>210 (↓ -10%)</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#eee",
                      borderRadius: 5,
                    }}
                  ></div>
                  <b>Sedan Model S</b>
                </div>
              </td>
              <td>
                <span
                  style={{
                    color: "gray",
                    background: "#eee",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  Неактивен
                </span>
              </td>
              <td>100 000 ₽</td>
              <td>⭐️ 4.1</td>
              <td>120 (↓ -20%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
