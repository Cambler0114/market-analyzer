import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  BarChart2,
  Bell,
  FileText,
  Home,
  LineChart,
  LogOut,
  Settings,
} from "lucide-react";

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
      <Icon size={20} style={{ marginRight: 15 }} />
      {label}
    </Link>
  );
};

const Layout = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Загружаем уведомления при старте
  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  }, []);

  // Закрываем меню, если кликнули мимо
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid-layout">
      <aside>
        <h2>Compare Profit</h2>

        <nav>
          <SidebarItem to="/" icon={Home} label="Домой" />

          <div className="nav-category">Ценообразование</div>
          <SidebarItem to="/pricing/overview" icon={FileText} label="Обзор" />
          <SidebarItem
            to="/pricing/competitors"
            icon={BarChart2}
            label="Конкуренты"
          />
          <SidebarItem to="/pricing/alerts" icon={Bell} label="Оповещения" />
          <SidebarItem to="/pricing/params" icon={Settings} label="Параметры" />

          <div className="nav-category">Рентабельность</div>
          <SidebarItem to="/profit/stats" icon={LineChart} label="Статистика" />
          <SidebarItem
            to="/profit/changes"
            icon={FileText}
            label="Изменения цен"
          />
          <SidebarItem
            to="/profit/notifications"
            icon={Bell}
            label="Уведомления"
          />
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              display: "flex",
              alignItems: "center",
              color: "#666",
              fontSize: "16px",
            }}
          >
            <LogOut size={18} /> <span style={{ marginLeft: 10 }}>Выйти</span>
          </button>
        </div>
      </aside>

      <main style={{ padding: "40px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <input
            type="text"
            placeholder="поиск"
            style={{
              width: "300px",
              borderRadius: "25px",
              border: "1px solid #ccc",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              fontSize: "24px",
            }}
          >
            {/* Блок уведомлений */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      background: "#b22222",
                      color: "white",
                      fontSize: "10px",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* Выпадающее меню */}
              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 40,
                    width: 300,
                    background: "white",
                    border: "1px solid #eee",
                    borderRadius: 10,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #eee",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Уведомления
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div
                        style={{
                          padding: 20,
                          textAlign: "center",
                          fontSize: 14,
                          color: "#999",
                        }}
                      >
                        Нет новых уведомлений
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: "10px 15px",
                            borderBottom: "1px solid #f5f5f5",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "start",
                            gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{n.status}</span>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: 13 }}>
                              {n.title}
                            </div>
                            <div style={{ color: "#666", fontSize: 12 }}>
                              {n.desc}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    to="/pricing/alerts"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      display: "block",
                      padding: 10,
                      textAlign: "center",
                      fontSize: 13,
                      color: "#b22222",
                      textDecoration: "none",
                    }}
                  >
                    Показать все
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/support"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ cursor: "pointer", position: "relative" }}>
                ✉️
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    background: "#b22222",
                    borderRadius: "50%",
                    border: "1px solid white",
                  }}
                ></span>
              </div>
            </Link>

            <Link
              to="/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ cursor: "pointer" }}>👤</div>
            </Link>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
