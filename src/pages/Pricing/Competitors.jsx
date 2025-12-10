import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react"; // Импортировали Trash2

const Competitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    threat: "Средний",
    share: "1%",
  });

  // Загрузка
  useEffect(() => {
    fetch("https://market-analyzer-r1yg.onrender.com/api/competitors")
      .then((response) => response.json())
      .then((data) => {
        setCompetitors(data);
        setFilteredCompetitors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = competitors.filter((comp) =>
      comp.name.toLowerCase().includes(term),
    );
    setFilteredCompetitors(filtered);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ДОБАВЛЕНИЕ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://market-analyzer-r1yg.onrender.com/api/competitors",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const newComp = await response.json();
      const updatedList = [...competitors, newComp];
      setCompetitors(updatedList);
      setFilteredCompetitors(updatedList);
      setShowModal(false);
      setFormData({ name: "", threat: "Средний", share: "1%" });
    } catch (err) {
      alert("Ошибка при сохранении");
    }
  };

  // --- НОВАЯ ФУНКЦИЯ: УДАЛЕНИЕ ---
  const handleDelete = async (id, name, e) => {
    e.stopPropagation(); // Чтобы клик не срабатывал на саму карточку (если будет кликабельной)

    // Спрашиваем подтверждение
    if (!window.confirm(`Вы точно хотите удалить конкурента "${name}"?`))
      return;

    try {
      // Отправляем запрос на сервер
      await fetch(
        `https://market-analyzer-r1yg.onrender.com/api/competitors/${id}`,
        {
          method: "DELETE",
        },
      );

      // Удаляем из списка на экране
      const updatedList = competitors.filter((c) => c._id !== id);
      setCompetitors(updatedList);

      // Обновляем и отфильтрованный список тоже
      const updatedFiltered = filteredCompetitors.filter((c) => c._id !== id);
      setFilteredCompetitors(updatedFiltered);
    } catch (err) {
      alert("Не удалось удалить. Возможно, проблема с сервером.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: 40,
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="card"
              style={{ height: 100, background: "#f0f0f0" }}
            ></div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredCompetitors.map((comp) => (
            <div
              key={comp._id || comp.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                position: "relative",
              }}
            >
              {/* Кнопка удаления */}
              <button
                onClick={(e) => handleDelete(comp._id, comp.name, e)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                  padding: 5,
                }}
                title="Удалить"
              >
                <Trash2
                  size={16}
                  onMouseOver={(e) => (e.target.style.color = "red")}
                  onMouseOut={(e) => (e.target.style.color = "#999")}
                />
              </button>

              <div
                style={{
                  width: 50,
                  height: 50,
                  fontSize: "24px",
                  background: "#f4f4f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {comp.letter}
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", paddingRight: 20 }}>
                  {comp.name}
                </h3>
                <p style={{ margin: "5px 0", fontSize: 14 }}>
                  Уровень угрозы:{" "}
                  <b style={{ color: comp.color }}>{comp.threat}</b>
                </p>
                <p style={{ margin: "0", color: "#666", fontSize: 12 }}>
                  Доля рынка: {comp.share}
                </p>
              </div>
            </div>
          ))}

          <div
            onClick={() => setShowModal(true)}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff0f0",
              border: "2px dashed #b22222",
              cursor: "pointer",
              minHeight: 120,
              color: "#b22222",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ffe6e6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#fff0f0")}
          >
            <div style={{ textAlign: "center" }}>
              <Plus size={30} />
              <div style={{ fontWeight: "bold" }}>Добавить</div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="card"
            style={{ width: 400, position: "relative", padding: 30 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0 }}>Новый конкурент</h2>
              <X
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(false)}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <div>
                <label style={{ fontSize: 12, fontWeight: "bold" }}>
                  Название компании
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Например: ООО "ТехноМир"'
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: "bold" }}>
                  Уровень угрозы
                </label>
                <select
                  name="threat"
                  value={formData.threat}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 5,
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="Высокий">🔴 Высокий</option>
                  <option value="Средний">🟠 Средний</option>
                  <option value="Низкий">🟢 Низкий</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: "bold" }}>
                  Доля рынка
                </label>
                <input
                  type="text"
                  name="share"
                  value={formData.share}
                  onChange={handleInputChange}
                  placeholder="Например: 12%"
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  marginTop: 10,
                  background: "#b22222",
                  color: "white",
                  padding: 12,
                  fontWeight: "bold",
                }}
              >
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitors;
