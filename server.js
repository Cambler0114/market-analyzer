import express from "express";
import cors from "cors";
import mongoose from "mongoose"; // Подключаем базу данных

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ПОДКЛЮЧЕНИЕ К MONGODB ---
const MONGO_URI =
  "mongodb+srv://shamil:Ifvbkm@cluster0.9rba8zl.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ База данных MongoDB подключена"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// --- СХЕМЫ ДАННЫХ (Как выглядят данные в БД) ---

// Схема пользователя
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// Схема конкурента
const CompetitorSchema = new mongoose.Schema({
  name: String,
  threat: String,
  color: String,
  share: String,
  letter: String,
});
const Competitor = mongoose.model("Competitor", CompetitorSchema);

// --- ПЕРВОНАЧАЛЬНЫЕ ДАННЫЕ (ЧТОБЫ БАЗА НЕ БЫЛА ПУСТОЙ) ---
// Этот код проверит, есть ли админ, и если нет — создаст его
const initDB = async () => {
  const adminExists = await User.findOne({ email: "admin@mail.ru" });
  if (!adminExists) {
    await User.create({
      email: "admin@mail.ru",
      password: "123",
      name: "Администратор",
    });
    console.log("Admin создан");
  }

  const count = await Competitor.countDocuments();
  if (count === 0) {
    await Competitor.insertMany([
      {
        name: 'Компания "Альфа"',
        threat: "Высокий",
        color: "red",
        share: "35%",
        letter: "🅰️",
      },
      {
        name: 'ООО "Бета Ритейл"',
        threat: "Средний",
        color: "orange",
        share: "15%",
        letter: "🅱️",
      },
      {
        name: "Gamma Group",
        threat: "Низкий",
        color: "green",
        share: "5%",
        letter: "G",
      },
    ]);
    console.log("Конкуренты добавлены");
  }
};
// Запускаем проверку при старте
initDB();

// --- СТАТИЧНЫЕ ДАННЫЕ (Их можно пока не хранить в БД для простоты) ---
const stats = [
  { label: "Янв", value: 100, display: "10 млн" },
  { label: "Фев", value: 150, display: "15 млн" },
  { label: "Мар", value: 120, display: "12 млн" },
  { label: "Апр", value: 250, display: "25 млн", highlight: true },
  { label: "Май", value: 180, display: "18 млн" },
  { label: "Июн", value: 200, display: "20 млн" },
];

const dashboardData = {
  trends: { value: "120", change: "+ 5.2%", positive: true },
  competitorsActivity: {
    value: "Увеличена",
    change: "- 3.1%",
    positive: false,
  },
  priceChanges: { value: "Снижено", change: "+10%", positive: true },
  activity: [
    {
      id: 1,
      date: "1 мая",
      competitor: "Б",
      changes: "1.2 тыс",
      alerts: 300,
      color: "#b22222",
    },
    {
      id: 2,
      date: "10 мая",
      competitor: "А",
      changes: "800",
      alerts: 120,
      color: "orange",
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

let alerts = [
  {
    id: 1,
    status: "🔴",
    date: "03.12.2025",
    title: "Резкое снижение!",
    desc: "Демпинг цен",
    bg: "#fff0f0",
    action: "Снизить",
  },
];

// --- API МАРШРУТЫ ---

// 1. КОНКУРЕНТЫ (ТЕПЕРЬ ИЗ БД)
app.get("/api/competitors", async (req, res) => {
  const comps = await Competitor.find();
  res.json(comps);
});

app.post("/api/competitors", async (req, res) => {
  const newComp = await Competitor.create({
    ...req.body,
    color: "gray",
    letter: "?",
  });
  res.json(newComp);
});

// 2. АВТОРИЗАЦИЯ (ИЗ БД)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // Ищем в настоящей базе данных
  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Неверный логин или пароль" });
  }
});

// 3. РЕГИСТРАЦИЯ (В БД)
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Проверяем, есть ли такой email в БД
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Пользователь уже существует" });
  }

  // Создаем и сохраняем навсегда
  await User.create({ name, email, password });
  console.log("Новый пользователь сохранен в MongoDB:", email);
  res.json({ success: true, message: "Регистрация успешна!" });
});

// 4. СМЕНА ПАРОЛЯ (В БД)
app.post("/api/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const user = await User.findOne({ email, password: oldPassword });
  if (user) {
    user.password = newPassword;
    await user.save(); // Сохраняем изменения
    res.json({ success: true, message: "Пароль успешно изменен!" });
  } else {
    res.status(400).json({ success: false, message: "Старый пароль неверен" });
  }
});

// Остальные маршруты (пока статические)
app.get("/api/alerts", (req, res) => res.json(alerts));
app.get("/api/settings", (req, res) => res.json(userSettings));
app.post("/api/settings", (req, res) => {
  userSettings = req.body;
  res.json({ success: true });
});
app.get("/api/stats", (req, res) => res.json(stats));
app.get("/api/dashboard", (req, res) => res.json(dashboardData));
app.post("/api/logout-all", (req, res) => res.json({ success: true }));

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
