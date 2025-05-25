import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const App = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [dailyTasks, setDailyTasks] = useState({});
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [manicureTime, setManicureTime] = useState({
    handStart: '', handEnd: '',
    footStart: '', footEnd: '',
    handRemovalStart: '', handRemovalEnd: '',
    footRemovalStart: '', footRemovalEnd: '',
    handComplete: false, footComplete: false
  });

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const apiBase = 'https://nail-care-api.onrender.com';
  const taskKeys = ['massage', 'moisturizer', 'water', 'relax'];
  const weekKeys = ['saltSoak', 'vinegarBright', 'baseCoat', 'onionGarlic', 'nailMask'];
  const weekNames = {
    saltSoak: '鹽水泡指甲', vinegarBright: '白醋亮甲',
    baseCoat: '護甲油', onionGarlic: '洋蔥/大蒜', nailMask: '指甲敷膜'
  };

  const formatDate = (d) => d.toISOString().split('T')[0];
  const getWeekDates = () => {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() + (currentWeek * 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();
  const weekStr = formatDate(weekDates[0]).substring(0, 7);

  const loadData = async () => {
    const res1 = await fetch(`${apiBase}/api/daily-tasks`).then(r => r.json());
    const res2 = await fetch(`${apiBase}/api/weekly-tasks`).then(r => r.json());
    const res3 = await fetch(`${apiBase}/api/manicure-time`).then(r => r.json());
    setDailyTasks(res1);
    setWeeklyTasks(res2);
    setManicureTime(res3);
  };

  useEffect(() => { loadData(); }, []);

  const toggleDaily = async (date, key) => {
    const current = dailyTasks[date]?.[key];
    const res = await fetch(`${apiBase}/api/daily-tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, taskKey: key, completed: !current })
    });
    if (res.ok) loadData();
  };

  const toggleWeekly = async (key) => {
    const current = weeklyTasks[weekStr]?.[key];
    const res = await fetch(`${apiBase}/api/weekly-tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week: weekStr, taskKey: key, completed: !current })
    });
    if (res.ok) loadData();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">💅 指甲保養追蹤本</h1>

      <h2 className="text-xl font-semibold text-purple-700 mb-2">每日任務</h2>
      <table className="w-full text-sm border rounded shadow bg-white mb-6">
        <thead className="bg-pink-100 text-pink-800">
          <tr>
            <th className="p-2">日期</th>
            {taskKeys.map(key => <th key={key} className="p-2">{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {weekDates.map((d, i) => {
            const dateStr = formatDate(d);
            return (
              <tr key={i} className="text-center border-t">
                <td className="p-2 font-medium text-left">{d.getMonth() + 1}/{d.getDate()}（{weekdays[d.getDay()]}）</td>
                {taskKeys.map(key => (
                  <td className="p-2" key={key}>
                    <button onClick={() => toggleDaily(dateStr, key)}>
                      {dailyTasks[dateStr]?.[key] ? '✅' : '❌'}
                    </button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold text-purple-700 mb-2">每週任務</h2>
      <ul className="list-disc pl-6 mb-6 text-sm">
        {weekKeys.map(key => (
          <li key={key}>
            <button className="mr-2" onClick={() => toggleWeekly(key)}>
              {weeklyTasks[weekStr]?.[key] ? '✅' : '❌'}
            </button>
            {weekNames[key]}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-purple-700 mb-2">美甲時間</h2>
      <div className="grid grid-cols-2 gap-4 text-sm bg-purple-50 p-4 rounded shadow mb-10">
        {Object.entries(manicureTime).map(([k, v]) => (
          <div key={k}><strong>{k}：</strong>{v?.toString() || '--'}</div>
        ))}
      </div>

      <div className="text-center">
        <button className="bg-purple-100 px-4 py-2 rounded mr-2" onClick={() => setCurrentWeek(currentWeek - 1)}>← 上週</button>
        <button className="bg-purple-100 px-4 py-2 rounded" onClick={() => setCurrentWeek(currentWeek + 1)}>下週 →</button>
      </div>
    </div>
  );
};

export default App;
