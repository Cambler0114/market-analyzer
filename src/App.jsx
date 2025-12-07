import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import Profile from "./pages/Profile";

// Страницы авторизации
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Основные страницы
import Dashboard from "./pages/Dashboard";

// Страницы Ценообразования (Pricing)
import Overview from "./pages/Pricing/Overview";
import Competitors from "./pages/Pricing/Competitors";
import Alerts from "./pages/Pricing/Alerts";
import Params from "./pages/Pricing/Params";

// Страницы Рентабельности (Profit)
import Stats from "./pages/Profit/Stats";
import Changes from "./pages/Profit/Changes";
import Notifications from "./pages/Profit/Notifications";

//NotFound
import NotFound from "./pages/NotFound";
//Chat
import SupportChat from "./pages/SupportChat";

function App() {
  // ИЗМЕНЕНИЕ 1: Проверяем localStorage при запуске сайта
  // Если там есть запись 'isAuth' === 'true', то пользователь считается вошедшим
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuth") === "true",
  );

  const handleLogin = () => {
    // ИЗМЕНЕНИЕ 2: Сохраняем вход в память браузера
    localStorage.setItem("isAuth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    // Добавляем очистку данных пользователя
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route
          path="/login"
          element={
            // Если уже вошли, не пускаем на страницу логина, редиректим на главную
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />

        {/* Защищенные маршруты */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          //SupportChat
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<SupportChat />} />
          <Route path="pricing/overview" element={<Overview />} />
          {/* Главная */}
          <Route index element={<Dashboard />} />
          {/* Профиль */}
          <Route path="profile" element={<Profile />} />
          {/* Раздел Ценообразование */}
          <Route path="pricing/overview" element={<Overview />} />
          <Route path="pricing/competitors" element={<Competitors />} />
          <Route path="pricing/alerts" element={<Alerts />} />
          <Route path="pricing/params" element={<Params />} />
          {/* Раздел Рентабельность */}
          <Route path="profit/stats" element={<Stats />} />
          <Route path="profit/changes" element={<Changes />} />
          <Route path="profit/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
