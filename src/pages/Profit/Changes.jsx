import React from "react";

const Changes = () => {
  const history = [
    {
      date: "Сегодня, 10:00",
      product: "Игровой ноутбук X1",
      old: 120000,
      new: 115000,
      initiator: "Робот",
    },
    {
      date: "Вчера, 14:30",
      product: "Мышь беспроводная",
      old: 1500,
      new: 1800,
      initiator: "Менеджер",
    },
    {
      date: "01.12.2025",
      product: 'Монитор 27"',
      old: 25000,
      new: 24500,
      initiator: "Робот",
    },
    {
      date: "28.11.2025",
      product: "Клавиатура мех.",
      old: 5000,
      new: 5000,
      initiator: "Проверка",
    },
  ];

  const getDiff = (oldP, newP) => {
    const diff = newP - oldP;
    if (diff > 0) return <span style={{ color: "green" }}>▲ +{diff} ₽</span>;
    if (diff < 0) return <span style={{ color: "red" }}>▼ {diff} ₽</span>;
    return <span style={{ color: "gray" }}>= 0 ₽</span>;
  };

  return (
    <div>
      <h1>🔄 История изменений цен</h1>
      <p>Лог всех корректировок стоимости товаров.</p>

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ddd", textAlign: "left" }}>
              <th style={{ padding: 10 }}>Дата</th>
              <th>Товар</th>
              <th>Было</th>
              <th>Стало</th>
              <th>Разница</th>
              <th>Инициатор</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{item.date}</td>
                <td>
                  <b>{item.product}</b>
                </td>
                <td>{item.old.toLocaleString()} ₽</td>
                <td>{item.new.toLocaleString()} ₽</td>
                <td>{getDiff(item.old, item.new)}</td>
                <td>
                  <i>{item.initiator}</i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Changes;
