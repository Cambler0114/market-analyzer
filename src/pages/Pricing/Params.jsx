import React, { useEffect, useState } from "react";

const Params = () => {
  const [settings, setSettings] = useState({
    currency: "RUB",
    frequency: "15min",
    autoRepricing: false,
    minMargin: 0,
    maxDiscount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Загрузка настроек с сервера
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Отправка на сервер
    fetch("http://localhost:5000/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message); // Показываем сообщение от сервера
      })
      .catch(() => alert("Ошибка сохранения"));
  };

  if (loading) return <div style={{ padding: 40 }}>Загрузка настроек...</div>;

  return (
    <div>
      <h1>⚙️ Параметры системы</h1>
      <p>Глобальные настройки мониторинга и ценообразования.</p>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ maxWidth: "800px", marginTop: 20 }}
      >
        {/* Секция 1 */}
        <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 10 }}>
          1. Общие настройки
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "20px",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <label style={{ textAlign: "right", fontWeight: "bold" }}>
            Валюта:
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            style={{ padding: 8, width: 200 }}
          >
            <option value="RUB">Рубль (₽)</option>
            <option value="USD">Доллар ($)</option>
            <option value="EUR">Евро (€)</option>
          </select>

          <label style={{ textAlign: "right", fontWeight: "bold" }}>
            Частота обновлений:
          </label>
          <div style={{ display: "flex", gap: 15 }}>
            <label>
              <input
                type="radio"
                name="frequency"
                value="15min"
                checked={settings.frequency === "15min"}
                onChange={handleChange}
              />{" "}
              15 мин
            </label>
            <label>
              <input
                type="radio"
                name="frequency"
                value="1hour"
                checked={settings.frequency === "1hour"}
                onChange={handleChange}
              />{" "}
              Час
            </label>
            <label>
              <input
                type="radio"
                name="frequency"
                value="24hours"
                checked={settings.frequency === "24hours"}
                onChange={handleChange}
              />{" "}
              Сутки
            </label>
          </div>
        </div>

        {/* Секция 2 */}
        <h3
          style={{
            borderBottom: "2px solid #eee",
            paddingBottom: 10,
            marginTop: 30,
          }}
        >
          2. Автоматизация
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "20px",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <label style={{ textAlign: "right", fontWeight: "bold" }}>
            Авто-репрайсинг:
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="autoRepricing"
              checked={settings.autoRepricing}
              onChange={handleChange}
              style={{ width: 20, height: 20 }}
            />
            Разрешить автоматическое изменение цен
          </label>

          <label style={{ textAlign: "right", fontWeight: "bold" }}>
            Минимальная маржа (%):
          </label>
          <input
            type="number"
            name="minMargin"
            value={settings.minMargin}
            onChange={handleChange}
            style={{ padding: 8, width: 80 }}
          />

          <label style={{ textAlign: "right", fontWeight: "bold" }}>
            Максимальная скидка (%):
          </label>
          <input
            type="number"
            name="maxDiscount"
            value={settings.maxDiscount}
            onChange={handleChange}
            style={{ padding: 8, width: 80 }}
          />
        </div>

        <div
          style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid #eee" }}
        >
          <button
            type="submit"
            style={{
              padding: "12px 25px",
              background: "#b22222",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              marginRight: 10,
              fontWeight: "bold",
            }}
          >
            💾 Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
};

export default Params;
