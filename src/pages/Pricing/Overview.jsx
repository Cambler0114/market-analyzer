import React, { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { X } from "lucide-react"; // Иконка закрытия для модального окна

const Overview = () => {
  // 1. ИСХОДНЫЕ ДАННЫЕ (теперь в State, чтобы их можно было менять)
  const initialData = [
    {
      id: "elec",
      category: "Электроника",
      avg: 50000,
      min: 12000,
      max: 150000,
      change: 5,
      positive: true,
    },
    {
      id: "appl",
      category: "Бытовая техника",
      avg: 25000,
      min: 5000,
      max: 80000,
      change: -2,
      positive: false,
    },
    {
      id: "auto",
      category: "Автозапчасти",
      avg: 8000,
      min: 500,
      max: 45000,
      change: 0,
      neutral: true,
    },
  ];

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Состояние для фильтров (все включены по умолчанию)
  const [filters, setFilters] = useState({
    elec: true,
    appl: true,
    auto: true,
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  // Показываем только те данные, у которых фильтр === true
  const filteredData = data.filter((item) => filters[item.id]);

  // Подготовка данных для Графика (Pie Chart)
  const pieData = filteredData.map((item) => ({
    name: item.category,
    value: item.avg, // Используем среднюю цену как "вес" для диаграммы
  }));

  // --- ФУНКЦИЯ 1: СКАЧАТЬ CSV ---
  const handleDownloadCSV = () => {
    // 1. Создаем заголовки
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Категория,Средняя цена,Мин. цена,Макс. цена,Динамика\n";

    // 2. Добавляем строки
    filteredData.forEach((row) => {
      csvContent += `${row.category},${row.avg},${row.min},${row.max},${row.change}%\n`;
    });

    // 3. Создаем ссылку и кликаем по ней
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "market_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ФУНКЦИЯ 2: ОБНОВИТЬ ДАННЫЕ ---
  const handleRefresh = () => {
    setLoading(true);
    // Имитация задержки сервера
    setTimeout(() => {
      // Генерируем небольшие случайные изменения цифр, чтобы было видно обновление
      const newData = data.map((item) => ({
        ...item,
        avg: item.avg + Math.floor(Math.random() * 2000) - 1000, // +/- 1000 руб
        change: item.change + Math.floor(Math.random() * 3) - 1, // +/- 1%
      }));

      setData(newData);
      setLoading(false);
    }, 1000);
  };

  // --- ФУНКЦИЯ 3: УПРАВЛЕНИЕ ФИЛЬТРАМИ ---
  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ position: "relative" }}>
      <h1>Обзор цен</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Текущая ситуация на рынке по категориям товаров.
      </p>

      {/* Контент страницы */}
      {loading ? (
        // Простой скелетон или спиннер
        <div style={{ padding: 50, textAlign: "center", color: "#999" }}>
          <h2>🔄 Обновление данных рынка...</h2>
        </div>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* Левая колонка: Таблица */}
          <div className="card">
            <h3>Детализация по категориям</h3>
            {filteredData.length === 0 ? (
              <p style={{ padding: 20, textAlign: "center" }}>
                Все категории скрыты фильтром
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Категория</th>
                    <th>Средняя</th>
                    <th>Динамика</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <b>{row.category}</b>
                      </td>
                      <td>{row.avg.toLocaleString()} ₽</td>
                      <td
                        style={{
                          color:
                            row.change === 0
                              ? "gray"
                              : row.change > 0
                                ? "green"
                                : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {row.change > 0 ? "▲" : row.change < 0 ? "▼" : "●"}{" "}
                        {row.change}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Правая колонка: Круговая диаграмма */}
          <div
            className="card"
            style={{
              height: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Доли категорий (по выручке)</h3>
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()} ₽`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ marginTop: 50, color: "#ccc" }}>
                Нет данных для графика
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- КНОПКИ ДЕЙСТВИЙ --- */}
      <h3 style={{ marginTop: "30px" }}>Быстрые действия</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Кнопка 1: Скачать */}
        <div
          onClick={handleDownloadCSV}
          className="card"
          style={{
            flex: 1,
            background: "#e6ffe6",
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <b>📥 Скачать отчет (CSV)</b>
          <br />
          <small>Экспорт текущей таблицы</small>
        </div>

        {/* Кнопка 2: Обновить */}
        <div
          onClick={handleRefresh}
          className="card"
          style={{
            flex: 1,
            background: "#ffe6e6",
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <b>🔄 Обновить данные</b>
          <br />
          <small>Запросить свежие цены</small>
        </div>

        {/* Кнопка 3: Фильтры */}
        <div
          onClick={() => setShowFilterModal(true)}
          className="card"
          style={{
            flex: 1,
            background: "#e6e6ff",
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <b>⚙️ Настроить фильтры</b>
          <br />
          <small>Скрыть/показать категории</small>
        </div>
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО ФИЛЬТРОВ --- */}
      {showFilterModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            zIndex: 10,
          }}
        >
          <div
            className="card"
            style={{ width: 300, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h3>Фильтры отображения</h3>
              <X
                style={{ cursor: "pointer" }}
                onClick={() => setShowFilterModal(false)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.elec}
                  onChange={() => toggleFilter("elec")}
                />
                Электроника
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.appl}
                  onChange={() => toggleFilter("appl")}
                />
                Бытовая техника
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.auto}
                  onChange={() => toggleFilter("auto")}
                />
                Автозапчасти
              </label>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 10,
                background: "#b22222",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
