import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Paperclip, Send } from "lucide-react";

const SupportChat = () => {
  // Начальное состояние сообщений
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Здравствуйте! Это служба поддержки Compare Profit. Чем я могу вам помочь?",
      sender: "support",
      time: "09:00",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Для авто-скролла вниз
  const messagesEndRef = useRef(null);

  // Функция авто-скролла
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Отправка сообщения
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Добавляем сообщение пользователя
    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true); // Включаем "Оператор печатает..."

    // 2. Имитация ответа через 1.5 сек
    setTimeout(() => {
      const replies = [
        "Спасибо за обращение! Мы уже проверяем информацию.",
        "Передал ваш запрос техническому специалисту.",
        "Попробуйте обновить страницу или очистить кэш браузера.",
        "Да, эта функция доступна в тарифе PRO.",
        "Могу я еще чем-то помочь?",
      ];
      // Выбираем случайный ответ
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const supportMsg = {
        id: Date.now() + 1,
        text: randomReply,
        sender: "support",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, supportMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <h1>💬 Техническая поддержка</h1>

      {/* Окно чата */}
      <div
        className="card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Шапка чата */}
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
            background: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#b22222",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <MessageCircle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: "bold" }}>Оператор (Александр)</div>
            <div style={{ fontSize: 12, color: "green" }}>● Онлайн</div>
          </div>
        </div>

        {/* Область сообщений */}
        <div
          style={{
            flex: 1,
            padding: 20,
            overflowY: "auto",
            background: "#fff",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 15,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                <div
                  style={{
                    padding: "10px 15px",
                    borderRadius: 15,
                    borderBottomRightRadius: msg.sender === "user" ? 0 : 15,
                    borderBottomLeftRadius: msg.sender === "support" ? 0 : 15,
                    background: msg.sender === "user" ? "#b22222" : "#f0f0f0",
                    color: msg.sender === "user" ? "white" : "#333",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Анимация "печатает..." */}
          {isTyping && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginLeft: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#ccc",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite",
                }}
              ></div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#ccc",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite 0.2s",
                }}
              ></div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#ccc",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite 0.4s",
                }}
              ></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <form
          onSubmit={handleSend}
          style={{
            padding: 15,
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 10,
            background: "#f9f9f9",
          }}
        >
          <button
            type="button"
            style={{ background: "transparent", color: "#999" }}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "10px 15px",
            }}
          />
          <button
            type="submit"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#b22222",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Добавим простую анимацию для точек через style тег */}
      <style>{`
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default SupportChat;
