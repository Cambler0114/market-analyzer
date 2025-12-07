import React from "react";

const Notifications = () => {
  return (
    <div>
      <h1>📩 Каналы уведомлений</h1>
      <p>Настройте, куда и когда отправлять отчеты.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        {/* Левая колонка - КУДА */}
        <div className="card" style={{ background: "#f9f9f9" }}>
          <h3>📢 Куда отправлять?</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <input type="checkbox" defaultChecked /> <b>E-mail рассылка</b>
              <br />
              <input
                type="text"
                defaultValue="admin@company.com"
                style={{ width: "90%", padding: 8, marginTop: 5 }}
              />
            </div>
            <hr style={{ width: "100%", border: "1px solid #fff" }} />
            <div>
              <input type="checkbox" /> <b>Telegram бот</b>
              <br />
              <input
                type="text"
                placeholder="@username"
                style={{ width: "90%", padding: 8, marginTop: 5 }}
              />
            </div>
            <hr style={{ width: "100%", border: "1px solid #fff" }} />
            <div>
              <input type="checkbox" /> <b>SMS (только критические)</b>
              <br />
              <input
                type="text"
                placeholder="+7 (999)..."
                style={{ width: "90%", padding: 8, marginTop: 5 }}
              />
            </div>
          </div>
        </div>

        {/* Правая колонка - КОГДА */}
        <div className="card" style={{ background: "#eefdee" }}>
          <h3>⏰ Когда отправлять?</h3>
          <ul style={{ lineHeight: "2" }}>
            <li>
              <b>Ежедневный дайджест</b> — Время:{" "}
              <input type="time" defaultValue="09:00" />
            </li>
            <li>
              <b>Еженедельный отчет (PDF)</b> — День:
              <select style={{ marginLeft: 5 }}>
                <option>Понедельник</option>
                <option selected>Пятница</option>
              </select>
            </li>
            <li>
              <b>Мгновенно</b>
              <br />
              <small>
                <i>При падении рентабельности ниже 10%</i>
              </small>
            </li>
          </ul>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Сохранить настройки рассылки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
