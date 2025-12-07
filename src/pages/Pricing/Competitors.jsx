import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const Competitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем задержку сети 1.5 секунды, чтобы вы успели увидеть красоту
    setTimeout(() => {
      fetch("https://hasanov-shamil-babsz.vercel.app/api/competitors")
        .then((response) => response.json())
        .then((data) => {
          setCompetitors(data);
          setFilteredCompetitors(data);
          setLoading(false);
        })
        .catch((error) => console.error("Ошибка:", error));
    }, 1500);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = competitors.filter((comp) =>
      comp.name.toLowerCase().includes(term),
    );
    setFilteredCompetitors(filtered);
  };

  const addCompetitor = () => {
    fetch("https://market-analyzer-r1yg.onrender.com./api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Новая Компания" }),
    })
      .then((res) => res.json())
      .then((newComp) => {
        const updatedList = [...competitors, newComp];
        setCompetitors(updatedList);
        setFilteredCompetitors(updatedList);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>🏢 Список конкурентов</h1>
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            style={{ position: "absolute", left: 10, top: 10, color: "#999" }}
          />
          <input
            type="text"
            placeholder="Быстрый фильтр..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ paddingLeft: 35, width: 250 }}
          />
        </div>
      </div>

      {loading ? (
        // --- БЛОК СКЕЛЕТОНОВ ---
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: 40,
          }}
        >
          {/* Рисуем 6 фейковых карточек */}
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                height: 100,
              }}
            >
              {/* Круглый скелетон для аватара */}
              <div
                className="skeleton"
                style={{ width: 60, height: 60, borderRadius: "50%" }}
              ></div>
              <div style={{ flex: 1 }}>
                {/* Полоски текста */}
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "60%", height: 20, marginBottom: 10 }}
                ></div>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "40%" }}
                ></div>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // --- РЕАЛЬНЫЙ КОНТЕНТ ---
        <>
          <p style={{ color: "#666", marginBottom: 20 }}>
            Всего найдено: {filteredCompetitors.length}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredCompetitors.map((comp) => (
              <div
                key={comp.id}
                className="card"
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "50%",
                  }}
                >
                  {comp.letter}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{comp.name}</h3>
                  <p style={{ margin: "5px 0" }}>
                    Уровень угрозы:{" "}
                    <b style={{ color: comp.color }}>{comp.threat}</b>
                  </p>
                  <p style={{ margin: "0", color: "#666" }}>
                    Доля рынка: {comp.share}
                  </p>
                </div>
              </div>
            ))}

            <div
              onClick={addCompetitor}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#e0e0e0",
                border: "2px dashed #999",
                cursor: "pointer",
                minHeight: 120,
              }}
            >
              <h3>+ Добавить</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Competitors;
