import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "100px", margin: 0, color: "#b22222" }}>404</h1>
      <h2 style={{ fontSize: "24px" }}>Упс! Страница не найдена.</h2>
      <p style={{ color: "#666", maxWidth: "400px", margin: "20px 0" }}>
        Похоже, вы пытаетесь попасть на страницу, которой не существует или она
        была удалена.
      </p>

      <Link
        to="/"
        style={{
          textDecoration: "none",
          background: "#b22222",
          color: "white",
          padding: "12px 30px",
          borderRadius: "25px",
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
