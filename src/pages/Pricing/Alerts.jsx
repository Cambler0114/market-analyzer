import React, { useEffect, useState } from "react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("https://market-api-xz12.onrender.com/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data));
  }, []);

  const handleAction = (id) => {
    // Отправляем запрос на удаление
    fetch(`https://market-api-xz12.onrender.com/api/alerts/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        // Убираем из списка на экране
        setAlerts(alerts.filter((item) => item.id !== id));
        alert("Действие выполнено успешно!");
      });
  };

  return (
    <div>
      <h1>🔔 Оповещения</h1>
      <p>Критические события.</p>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "15px" }}>Статус</th>
              <th>Дата</th>
              <th>Сообщение</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  style={{
                    backgroundColor: alert.bg,
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      fontSize: "20px",
                    }}
                  >
                    {alert.status}
                  </td>
                  <td>{alert.date}</td>
                  <td style={{ padding: "15px" }}>
                    <b>{alert.title}</b>
                    <br />
                    <span style={{ fontSize: "14px", color: "#555" }}>
                      {alert.desc}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAction(alert.id)}
                      style={{
                        padding: "8px 15px",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        color: "black",
                      }}
                      onMouseOver={(e) => (e.target.style.background = "#eee")}
                      onMouseOut={(e) => (e.target.style.background = "#fff")}
                    >
                      {alert.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  Нет новых оповещений 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alerts;
