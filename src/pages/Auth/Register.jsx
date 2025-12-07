import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) {
      setError("Пароли не совпадают!");
      return;
    }

    try {
      // ИСПРАВЛЕННАЯ ССЫЛКА:
      const response = await fetch(
        "https://market-analyzer-r1yg.onrender.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        alert("Аккаунт создан! Теперь войдите.");
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Ошибка сервера");
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
        <h3>Регистрация</h3>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            name="name"
            placeholder="Имя"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPass"
            placeholder="Повторите пароль"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#333",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Создать аккаунт
          </button>
        </form>
        <p style={{ marginTop: 20 }}>
          Уже есть аккаунт?{" "}
          <a href="/login" style={{ color: "#b22222" }}>
            Войти
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
