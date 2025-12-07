import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ИСПРАВЛЕННАЯ СТРОКА:
      // 1. Вставьте СВОЮ ссылку с Render
      // 2. Обязательно добавьте /api/login в конце
      const response = await fetch(
        "https://market-analyzer-r1yg.onrender.com./api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // --- ВОТ ТУТ ИЗМЕНЕНИЯ ---
        // 1. Сохраняем данные, пришедшие с сервера, в память браузера
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        onLogin(); // Вызываем обновление стейта в App.js
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#e0e0e0",
      }}
    >
      <div className="card" style={{ width: "350px", textAlign: "center" }}>
        <h2 style={{ color: "#b22222" }}>Compare Profit</h2>
        <h3>Вход в систему</h3>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: 15,
              background: "#ffe6e6",
              padding: 5,
              borderRadius: 5,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Email (admin@mail.ru)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль (12345)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#b22222",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Войти
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: "12px" }}>
          Нет аккаунта?{" "}
          <a href="/register" style={{ color: "#b22222" }}>
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
