import express from "express";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// --- БАЗА ДАННЫХ (Имитация) ---

// 1. Конкуренты
const competitors = [
  {
    id: 1,
    name: 'Компания "Альфа"',
    threat: "Высокий",
    color: "red",
    share: "35%",
    letter: "🅰️",
  },
  {
    id: 2,
    name: 'ООО "Бета Ритейл"',
    threat: "Средний",
    color: "orange",
    share: "15%",
    letter: "🅱️",
  },
  {
    id: 3,
    name: "Gamma Group",
    threat: "Низкий",
    color: "green",
    share: "5%",
    letter: "G",
  },
];
//Пользователи системы
const users = [
  { email: "admin@mail.ru", password: "123", name: "Администратор" },
];
// 2. Статистика (Доходы)
const stats = [
  { label: "Янв", value: 100, display: "10 млн" },
  { label: "Фев", value: 150, display: "15 млн" },
  { label: "Мар", value: 120, display: "12 млн" },
  { label: "Апр", value: 250, display: "25 млн", highlight: true },
  { label: "Май", value: 180, display: "18 млн" },
  { label: "Июн", value: 200, display: "20 млн" },
];

let alerts = [
  {
    id: 1,
    status: "🔴",
    date: "03.12.2025 10:45",
    title: "Резкое снижение цены!",
    desc: "Альфа снизила цену на 25%.",
    bg: "#fff0f0",
    action: "Снизить цену",
  },
  {
    id: 2,
    status: "🟡",
    date: "02.12.2025 18:20",
    title: "Низкая маржинальность",
    desc: "Прибыль менее 3%.",
    bg: "#fffff0",
    action: "Настроить",
  },
  {
    id: 3,
    status: "🔵",
    date: "01.12.2025 09:00",
    title: "Отчет готов",
    desc: "Статистика доступна.",
    bg: "white",
    action: "Скачать",
  },
];

// 3. Данные для Дашборда
const dashboardData = {
  trends: { value: "120", change: "+ 5.2%", positive: true },
  competitorsActivity: {
    value: "Увеличена",
    change: "- 3.1%",
    positive: false,
  },
  priceChanges: { value: "Снижено", change: "+10%", positive: true },

  // Новые данные для таблицы
  activity: [
    {
      id: 1,
      date: "1 мая - 9 мая",
      competitor: "Б",
      changes: "1.2 тыс",
      alerts: 300,
      color: "#b22222",
    },
    {
      id: 2,
      date: "10 мая - 18 мая",
      competitor: "А",
      changes: "800",
      alerts: 120,
      color: "orange",
    },
    {
      id: 3,
      date: "20 мая - 29 мая",
      competitor: "G",
      changes: "2.5 тыс",
      alerts: 50,
      color: "green",
    },
    {
      id: 4,
      date: "1 июня - 5 июня",
      competitor: "Б",
      changes: "500",
      alerts: 10,
      color: "#b22222",
    },
  ],
};

let userSettings = {
  currency: "RUB",
  frequency: "15min",
  autoRepricing: true,
  minMargin: 5,
  maxDiscount: 30,
};

// --- API МАРШРУТЫ ---
app.get("/api/alerts", (req, res) => res.json(alerts));
// Получить конкурентов
app.get("/api/competitors", (req, res) => res.json(competitors));

app.post("/api/competitors", (req, res) => {
  const newComp = { ...req.body, id: Date.now(), color: "gray", letter: "?" };
  competitors.push(newComp);
  res.json(newComp);
});

app.get("/api/settings", (req, res) => res.json(userSettings));
app.post("/api/settings", (req, res) => {
  userSettings = req.body; // Обновляем переменную на сервере
  res.json({ success: true, message: "Настройки сохранены!" });
});
// Получить статистику
app.get("/api/stats", (req, res) => res.json(stats));

// Получить данные для Дашборда
app.get("/api/dashboard", (req, res) => res.json(dashboardData));

// Авторизация (Логин)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // Ищем пользователя в массиве
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Неверный логин или пароль" });
  }
});
// РЕГИСТРАЦИЯ (Новый маршрут)
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  // Проверка: есть ли такой уже?
  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "Пользователь уже существует" });
  }

  // Добавляем нового
  const newUser = { name, email, password };
  users.push(newUser);
  console.log("Новый пользователь:", newUser); // Для отладки в терминале
  res.json({ success: true, message: "Регистрация успешна!" });
});

app.post("/api/change-password", (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // 1. Ищем пользователя
  const userIndex = users.findIndex(
    (u) => u.email === email && u.password === oldPassword,
  );

  if (userIndex !== -1) {
    // 2. Меняем пароль
    users[userIndex].password = newPassword;
    console.log(`Пароль для ${email} изменен на ${newPassword}`);
    res.json({ success: true, message: "Пароль успешно изменен!" });
  } else {
    res.status(400).json({ success: false, message: "Старый пароль неверен" });
  }
});

// ВЫХОД СО ВСЕХ УСТРОЙСТВ
app.post("/api/logout-all", (req, res) => {
  console.log("Пользователь запросил выход со всех устройств");
  res.json({
    success: true,
    message: "Сессии на других устройствах завершены.",
  });
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
  console.log(`Тестовый аккаунт: admin@mail.ru / 12345`);

  app.delete("/api/alerts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    alerts = alerts.filter((a) => a.id !== id); // Удаляем из массива
    res.json({ success: true });
  });
});
