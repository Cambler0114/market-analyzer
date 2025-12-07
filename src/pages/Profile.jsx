import React, { useState } from "react";
import { X } from "lucide-react";

const Profile = () => {
  // 1. Читаем данные из LocalStorage (или ставим заглушку, если их нет)
  const storedName = localStorage.getItem("userName") || "Пользователь";
  const storedEmail = localStorage.getItem("userEmail") || "user@example.com";

  const user = {
    name: storedName, // Теперь имя динамическое
    email: storedEmail, // И почта тоже
    role: "Пользователь", // Роль пока оставим статичной или тоже можно передавать с сервера
    avatar: `https://ui-avatars.com/api/?name=${storedName}&background=b22222&color=fff&size=128`, // Аватар генерируется по имени
  };

  const [showModal, setShowModal] = useState(false);

  // Автоматически подставляем текущий email в форму смены пароля
  const [passForm, setPassForm] = useState({
    email: storedEmail,
    oldPassword: "",
    newPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://market-api-xz12.onrender.com/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passForm),
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setShowModal(false);
        setPassForm({ ...passForm, oldPassword: "", newPassword: "" });
      } else {
        alert("Ошибка: " + data.message);
      }
    } catch (err) {
      alert("Ошибка сервера");
    }
  };

  const handleLogoutAll = () => {
    if (
      window.confirm(
        "Вы уверены? Вам придется войти заново на этом устройстве.",
      )
    ) {
      fetch("https://market-api-xz12.onrender.com/api/logout-all", { method: "POST" }).then(
        () => {
          alert("Выполнен выход со всех устройств.");
          localStorage.clear();
          window.location.href = "/login";
        },
      );
    }
  };

  return (
    <div>
      <h1>👤 Профиль пользователя</h1>

      {/* Карточка профиля */}
      <div
        className="card"
        style={{
          display: "flex",
          gap: 30,
          alignItems: "center",
          maxWidth: 600,
        }}
      >
        <img
          src={user.avatar}
          alt="Avatar"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "4px solid #eee",
          }}
        />

        <div>
          {/* Используем данные из переменной user */}
          <h2 style={{ marginBottom: 5, marginTop: 0 }}>{user.name}</h2>
          <span
            style={{
              background: "#333",
              color: "white",
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {user.role}
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              gap: 10,
              marginTop: 20,
              fontSize: 14,
            }}
          >
            <b style={{ color: "#666" }}>Email:</b> <span>{user.email}</span>
            <b style={{ color: "#666" }}>Статус:</b>{" "}
            <span style={{ color: "green", fontWeight: "bold" }}>
              ● Активен
            </span>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ maxWidth: 600, borderLeft: "5px solid #b22222" }}
      >
        <h3>🔐 Безопасность аккаунта</h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
          Рекомендуем менять пароль каждые 3 месяца для защиты данных.
        </p>

        <div style={{ display: "flex", gap: 15 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#333",
              color: "white",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
          >
            Сменить пароль
          </button>

          <button
            onClick={handleLogoutAll}
            style={{
              background: "#fff",
              border: "1px solid #b22222",
              color: "#b22222",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
          >
            Выйти со всех устройств
          </button>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО СМЕНЫ ПАРОЛЯ */}
      {showModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              width: 350,
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            <X
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                cursor: "pointer",
                color: "#999",
              }}
            />

            <h3 style={{ marginTop: 0 }}>Смена пароля</h3>

            <form
              onSubmit={handleChangePassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
                marginTop: 20,
              }}
            >
              <div>
                <label
                  style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}
                >
                  Ваш Email
                </label>
                {/* Поле Email делаем readOnly (только для чтения), чтобы нельзя было менять */}
                <input
                  type="email"
                  value={passForm.email}
                  readOnly
                  style={{ background: "#eee", color: "#666" }}
                />
              </div>
              <div>
                <label
                  style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}
                >
                  Старый пароль
                </label>
                <input
                  type="password"
                  value={passForm.oldPassword}
                  onChange={(e) =>
                    setPassForm({ ...passForm, oldPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label
                  style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}
                >
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={passForm.newPassword}
                  onChange={(e) =>
                    setPassForm({ ...passForm, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#b22222",
                  color: "white",
                  padding: 12,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                Обновить пароль
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
